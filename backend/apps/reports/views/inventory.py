import math
from datetime import date, timedelta
from decimal import Decimal

from django.db.models import DecimalField, Sum
from django.db.models.functions import Coalesce
from django.utils import timezone
from dateutil.relativedelta import relativedelta

from rest_framework.views import APIView
from rest_framework.response import Response

from apps.accounts.permissions import CanViewReports
from apps.inventory.services import get_stock
from apps.products.models import Product
from apps.sales.models import Sale, SaleItem

from apps.reports.base import BaseReportView
from apps.reports.serializers import (
    SlowMovingSerializer,
    DeadStockSerializer,
    InventoryValuationSerializer,
    InventorySummarySerializer,
    StockAgingSerializer,
    ReorderSuggestionSerializer,
)
from apps.reports.services import (
    get_sales_aggregation,
    get_stock_map,
    get_inventory_valuation,
    get_inventory_summary,
    get_stock_aging_report,
)


class DeadStockView(BaseReportView):
    serializer_class = DeadStockSerializer
    filename = "dead-stock"
    search_fields = ["name"]
    ordering_fields = ["current_stock", "days_since_sale", "minimum_stock"]
    default_ordering = "-days_since_sale"

    def get_summary(self, rows):
        return {
            "products": len(rows),
            "units": sum(row["current_stock"] for row in rows),
        }

    def get(self, request):
        days = int(request.GET.get("days", 90))
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        today = date.today()

        results = []

        for product in Product.objects.filter(is_active=True):
            stock = get_stock(product)
            if stock <= 0:
                continue

            sales = SaleItem.objects.filter(
                product=product,
                sale__status=Sale.STATUS_ACTIVE,
            ).select_related("sale")

            if start_date:
                sales = sales.filter(sale__sale_date__gte=start_date)

            if end_date:
                sales = sales.filter(sale__sale_date__lte=end_date)

            latest_sale = sales.order_by("-sale__sale_date").first()

            if latest_sale is None:
                results.append({
                    "id": product.id,
                    "name": product.name,
                    "current_stock": stock,
                    "last_sale_date": None,
                    "days_since_sale": None,
                    "minimum_stock": product.minimum_stock,
                })
                continue

            last_date = latest_sale.sale.sale_date
            days_since = (today - last_date).days

            if days_since >= days:
                results.append({
                    "id": product.id,
                    "name": product.name,
                    "current_stock": stock,
                    "last_sale_date": last_date,
                    "days_since_sale": days_since,
                    "minimum_stock": product.minimum_stock,
                })

        return self.render(request, results)


class SlowMovingView(BaseReportView):
    serializer_class = SlowMovingSerializer
    filename = "slow-moving"
    search_fields = ["product_name"]
    ordering_fields = ["quantity_sold", "current_stock"]
    default_ordering = "quantity_sold"

    def get_summary(self, rows):
        return {
            "products": len(rows),
            "total_sold": sum(row["quantity_sold"] for row in rows),
        }

    def get(self, request):
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        limit = request.GET.get("limit")

        if not start_date:
            start_date = date.today() - timedelta(days=30)

        data = get_sales_aggregation(start_date=start_date, end_date=end_date)
        stock_map = get_stock_map()
        rows = []

        for row in data:
            rows.append({
                "product_id": row["product_id"],
                "product_name": row["product__name"],
                "quantity_sold": row["quantity_sold"],
                "current_stock": stock_map.get(row["product_id"], 0),
            })

        if limit:
            rows = rows[: int(limit)]

        return self.render(request, rows)


class FastMovingView(BaseReportView):
    serializer_class = SlowMovingSerializer
    filename = "fast-moving"
    search_fields = ["product_name"]
    ordering_fields = ["quantity_sold", "current_stock"]
    default_ordering = "-quantity_sold"

    def get_summary(self, rows):
        return {
            "products": len(rows),
            "total_sold": sum(row["quantity_sold"] for row in rows),
        }

    def get(self, request):
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        limit = request.GET.get("limit")

        if not start_date:
            start_date = date.today() - timedelta(days=30)

        data = get_sales_aggregation(start_date=start_date, end_date=end_date)
        stock_map = get_stock_map()
        rows = []

        for row in data:
            rows.append({
                "product_id": row["product_id"],
                "product_name": row["product__name"],
                "quantity_sold": row["quantity_sold"],
                "current_stock": stock_map.get(row["product_id"], 0),
            })

        if limit:
            rows = rows[: int(limit)]

        return self.render(request, rows)


class ReorderSuggestionsView(BaseReportView):
    serializer_class = ReorderSuggestionSerializer
    filename = "reorder-suggestions"

    def get(self, request):
        three_months_ago = timezone.now().date() - relativedelta(months=3)

        sales = (
            SaleItem.objects.filter(
                sale__status=Sale.STATUS_ACTIVE,
                sale__sale_date__gte=three_months_ago,
            )
            .values("product")
            .annotate(
    sold=Coalesce(
        Sum("quantity"),
        Decimal("0"),
        output_field=DecimalField(max_digits=18, decimal_places=3),
    )
)
        )

        sold_map = {row["product"]: float(row["sold"]) for row in sales}
        rows = []

        for product in Product.objects.all():
            current = get_stock(product)
            minimum = product.minimum_stock

            if current >= minimum:
                continue

            sold_last_3_months = sold_map.get(product.id, 0)
            avg_monthly = sold_last_3_months / 3
            daily_sales = avg_monthly / 30 if avg_monthly > 0 else 0
            days_of_stock = current / daily_sales if daily_sales > 0 else 999
            profit = Decimal(product.selling_price) - Decimal(product.cost_price)
            shortage = max(minimum - current, 0)

            if avg_monthly < 3:
                suggested = shortage
                priority = "TO MINIMUM"
                reason = "Slow moving product"
            elif profit <= 0:
                suggested = shortage
                priority = "TO MINIMUM"
                reason = "Low or negative profit"
            elif days_of_stock > 60:
                suggested = shortage
                priority = "TO MINIMUM"
                reason = f"Stock covers {int(days_of_stock)} days"
            else:
                if avg_monthly < 10:
                    multiplier = 1
                elif avg_monthly < 30:
                    multiplier = 1.5
                else:
                    multiplier = 2

                suggested = math.ceil(shortage + (avg_monthly * multiplier))
                priority = "ORDER MORE"
                reason = "Profitable and sells well"

            rows.append({
                "id": product.id,
                "barcode": product.barcode,
                "product": product.name,
                "current_stock": current,
                "minimum_stock": minimum,
                "avg_monthly_sales": round(avg_monthly, 2),
                "profit_per_unit": round(profit, 2),
                "shortage": shortage,
                "suggested_order": suggested,
                "priority": priority,
                "reason": reason,
                "days_of_stock": round(days_of_stock, 1),
            })

        rows.sort(key=lambda x: (x["priority"] != "ORDER MORE", x["current_stock"]))
        return self.render(request, rows)


class InventoryValuationView(BaseReportView):
    serializer_class = InventoryValuationSerializer
    filename = "inventory-valuation"

    def get(self, request):
        rows = get_inventory_valuation(
            start_date=request.GET.get("start_date"),
            end_date=request.GET.get("end_date"),
        )
        return self.render(request, rows)


class InventorySummaryView(APIView):
    permission_classes = [CanViewReports]

    def get(self, request):
        serializer = InventorySummarySerializer(get_inventory_summary())
        return Response(serializer.data)


class StockAgingView(BaseReportView):
    serializer_class = StockAgingSerializer
    filename = "stock-aging"

    def get(self, request):
        rows = get_stock_aging_report(
            start_date=request.GET.get("start_date"),
            end_date=request.GET.get("end_date"),
        )
        return self.render(request, rows)
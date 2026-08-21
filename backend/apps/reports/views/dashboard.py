from datetime import date
from decimal import Decimal

from django.db.models import Sum, F, ExpressionWrapper, DecimalField
from rest_framework.views import APIView
from rest_framework.response import Response

from apps.accounts.permissions import CanViewReports
from apps.inventory.services import get_stock
from apps.products.models import Product
from apps.purchases.models import Purchase
from apps.sales.models import Sale, SaleItem
from apps.suppliers.models import Supplier

from apps.reports.services import (
    get_inventory_summary,
    get_profit_loss_report,
    get_cogs_report,
    get_stock_aging_report,
)
from .sales import TopProfitProductsView


class DashboardView(APIView):
    permission_classes = [CanViewReports]

    def get(self, request):
        today = date.today()
        month_start = today.replace(day=1)

        total_products = Product.objects.count()
        total_suppliers = Supplier.objects.count()
        total_sales = Sale.objects.filter(status=Sale.STATUS_ACTIVE).count()
        total_purchases = Purchase.objects.filter(status=Purchase.STATUS_ACTIVE).count()

        today_sales = (
            Sale.objects.filter(
                status=Sale.STATUS_ACTIVE,
                sale_date=today,
            ).aggregate(total=Sum("total"))["total"]
            or Decimal("0")
        )

        month_sales = (
            Sale.objects.filter(
                status=Sale.STATUS_ACTIVE,
                sale_date__gte=month_start,
            ).aggregate(total=Sum("total"))["total"]
            or Decimal("0")
        )

        inventory_value = Decimal("0")
        low_stock_count = 0
        dead_stock_count = 0

        for product in Product.objects.filter(is_active=True):
            stock = get_stock(product)
            inventory_value += stock * product.cost_price

            latest_sale = (
                SaleItem.objects.filter(
                    product=product,
                    sale__status=Sale.STATUS_ACTIVE,
                )
                .order_by("-sale__sale_date")
                .first()
            )

            if stock <= product.minimum_stock:
                low_stock_count += 1
            if stock > 0 and latest_sale is None:
                dead_stock_count += 1

        best_product = (
            SaleItem.objects.filter(sale__status=Sale.STATUS_ACTIVE)
            .values("product__name")
            .annotate(qty=Sum("quantity"))
            .order_by("-qty")
            .first()
        )

        top_profit = (
            SaleItem.objects.filter(sale__status=Sale.STATUS_ACTIVE)
            .values("product__name")
            .annotate(
                profit=Sum(
                    ExpressionWrapper(
                        (F("unit_price") - F("cost_price")) * F("quantity"),
                        output_field=DecimalField(
                            max_digits=15,
                            decimal_places=2,
                        ),
                    )
                )
            )
            .order_by("-profit")
            .first()
        )

        recent_sales = (
            Sale.objects.filter(status=Sale.STATUS_ACTIVE)
            .order_by("-sale_date")[:5]
            .values(
                "invoice_number",
                "sale_date",
                "total",
            )
        )

        recent_purchases = (
            Purchase.objects.filter(status=Purchase.STATUS_ACTIVE)
            .order_by("-purchase_date")[:5]
            .values(
                "invoice_number",
                "purchase_date",
            )
        )

        return Response({
            "total_products": total_products,
            "total_suppliers": total_suppliers,
            "total_sales": total_sales,
            "total_purchases": total_purchases,
            "today_sales": today_sales,
            "month_sales": month_sales,
            "inventory_value": inventory_value,
            "low_stock_count": low_stock_count,
            "dead_stock_count": dead_stock_count,
            "best_selling_product": best_product["product__name"] if best_product else None,
            "top_profit_product": top_profit["product__name"] if top_profit else None,
            "recent_sales": recent_sales,
            "recent_purchases": recent_purchases,
        })


class DashboardAnalyticsView(APIView):
    permission_classes = [CanViewReports]

    def get(self, request):
        return Response({
            "inventory_summary": get_inventory_summary(),
            "profit_loss": get_profit_loss_report(),
            "cogs": get_cogs_report(),
            "stock_aging": get_stock_aging_report()[:5],
            "top_profit_products": TopProfitProductsView().get(request).data[:5],
        })
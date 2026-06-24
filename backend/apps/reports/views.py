from decimal import Decimal
from datetime import date, timedelta

from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, F, DecimalField, ExpressionWrapper

from apps.products.models import Product
from apps.suppliers.models import Supplier
from apps.sales.models import Sale
from apps.sales.models import SaleItem
from apps.purchases.models import Purchase

from apps.reports.services import (
    get_sales_aggregation, get_stock_map, get_cogs_report,
    get_inventory_valuation, get_inventory_summary,get_profit_loss_report,
    get_stock_aging_report
    )
from apps.inventory.services import get_stock

from .serializers import (
    SlowMovingSerializer,
    TopProfitProductSerializer,
    InventoryValuationSerializer,
    InventorySummarySerializer,
    COGSReportSerializer,
    ProfitLossSerializer,
    StockAgingSerializer
)

class DashboardView(APIView):

    def get(self, request):

        total_products = Product.objects.count()
        total_suppliers = Supplier.objects.count()
        total_sales = Sale.objects.count()
        total_purchases = Purchase.objects.count()

        low_stock_count = 0
        inventory_value = Decimal("0")

        for product in Product.objects.filter(is_active=True):
            stock = get_stock(product)

            inventory_value += stock * product.cost_price

            if stock <= product.minimum_stock:
                low_stock_count += 1

        return Response({
            "total_products": total_products,
            "total_suppliers": total_suppliers,
            "total_sales": total_sales,
            "total_purchases": total_purchases,
            "low_stock_count": low_stock_count,
            "inventory_value": inventory_value,
        })
    

class DeadStockView(APIView):

    def get(self, request):

        days = int(request.GET.get("days", 90))
        today = date.today()

        results = []

        for product in Product.objects.filter(is_active=True):

            stock = get_stock(product)
            if stock <= 0:
                continue

            latest_sale = (
                SaleItem.objects
                .filter(product=product)
                .select_related("sale")
                .order_by("-sale__sale_date")
                .first()
            )

            if not latest_sale:
                results.append({
                    "id": product.id,
                    "name": product.name,
                    "current_stock": stock,
                    "last_sale_date": None,
                    "days_since_sale": None,
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
                })

        results.sort(
            key=lambda x: x["days_since_sale"] or 999999,
            reverse=True
        )

        return Response(results)
    

class SlowMovingView(APIView):

    def get(self, request):

        days = int(request.GET.get("days", 30))
        since_date = date.today() - timedelta(days=days)

        data = get_sales_aggregation(since_date=since_date)

        results = []

        for row in data:

            results.append({
                "product_id": row["product_id"],
                "product_name": row["product__name"],
                "quantity_sold": row["quantity_sold"],
                "current_stock": 0,
            })

        results.sort(key=lambda x: x["quantity_sold"])

        return Response(
            SlowMovingSerializer(results, many=True).data
        )
    
class FastMovingView(APIView):

    def get(self, request):

        days = int(request.GET.get("days", 30))
        since_date = date.today() - timedelta(days=days)

        data = get_sales_aggregation(since_date=since_date)

        results = []

        for row in data:

            results.append({
                "product_id": row["product_id"],
                "product_name": row["product__name"],
                "quantity_sold": row["quantity_sold"],
                "current_stock": 0,
            })

        results.sort(
            key=lambda x: x["quantity_sold"],
            reverse=True
        )

        return Response(
            SlowMovingSerializer(results, many=True).data
        )
    
class TopProfitProductsView(APIView):

    def get(self, request):

        profit_expr = ExpressionWrapper(
            (F("unit_price") - F("cost_price")) * F("quantity"),
            output_field=DecimalField(max_digits=15, decimal_places=2)
        )

        data = (
            SaleItem.objects
            .values(
                "product_id",
                "product__name"
            )
            .annotate(
                total_profit=Sum(profit_expr)
            )
            .order_by("-total_profit")
        )

        results = [
            {
                "product_id": row["product_id"],
                "product_name": row["product__name"],
                "total_profit": row["total_profit"],
            }
            for row in data
        ]

        serializer = TopProfitProductSerializer(
            results,
            many=True
        )

        return Response(serializer.data)
    
class ReorderSuggestionsView(APIView):

    def get(self, request):

        data = get_sales_aggregation(
            since_date=date.today() - timedelta(days=30)
        )

        stock_map = get_stock_map()

        results = []

        for row in data:

            stock = stock_map.get(row["product_id"], 0)

            minimum_stock = row["product__minimum_stock"]

            if stock > minimum_stock:
                continue

            results.append({
                "product_id": row["product_id"],
                "product_name": row["product__name"],
                "current_stock": stock,
                "minimum_stock": minimum_stock,
                "recommended_order": max(
                    minimum_stock * 2,
                    row["quantity_sold"]
                ),
            })

        results.sort(key=lambda x: x["current_stock"])

        return Response(results)


class InventoryValuationView(APIView):
    def get(self, request):

        data = (
            get_inventory_valuation()
        )

        serializer = (
            InventoryValuationSerializer(
                data,
                many=True
            )
        )

        return Response(
            serializer.data
        )
    
class InventorySummaryView(APIView):

    def get(self, request):

        data = get_inventory_summary()

        serializer = (
            InventorySummarySerializer(
                data
            )
        )

        return Response(
            serializer.data
        )
    
class COGSReportView(APIView):

    def get(self, request):

        start_date = request.GET.get(
            "start_date"
        )

        end_date = request.GET.get(
            "end_date"
        )

        data = get_cogs_report(
            start_date=start_date,
            end_date=end_date,
        )

        serializer = (
            COGSReportSerializer(
                data
            )
        )

        return Response(
            serializer.data
        )
    
class ProfitLossReportView(APIView):

    def get(self, request):

        start_date = request.GET.get(
            "start_date"
        )

        end_date = request.GET.get(
            "end_date"
        )

        data = get_profit_loss_report(
            start_date=start_date,
            end_date=end_date,
        )

        serializer = (
            ProfitLossSerializer(
                data
            )
        )

        return Response(
            serializer.data
        )
    
class StockAgingView(APIView):

    def get(self, request):

        data = (
            get_stock_aging_report()
        )

        serializer = (
            StockAgingSerializer(
                data,
                many=True
            )
        )

        return Response(
            serializer.data
        )
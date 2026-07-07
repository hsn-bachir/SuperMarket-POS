from decimal import Decimal
from datetime import date, timedelta
from urllib import request

from django.db.models import (
    Sum,
    F,
    DecimalField,
    ExpressionWrapper,
)

from rest_framework.views import APIView
from rest_framework.response import Response

from apps.accounts.permissions import CanViewReports
from apps.inventory.services import get_stock
from apps.products.models import Product
from apps.purchases.models import Purchase
from apps.sales.models import Sale, SaleItem
from apps.suppliers.models import Supplier

from .serializers import (
    SlowMovingSerializer,
    DeadStockSerializer,
    TopProfitProductSerializer,
    InventoryValuationSerializer,
    InventorySummarySerializer,
    COGSReportSerializer,
    ProfitLossSerializer,
    StockAgingSerializer,
    ReorderSuggestionSerializer,
)

from .base import BaseReportView

from .services import (
    get_sales_aggregation,
    get_stock_map,
    get_inventory_valuation,
    get_inventory_summary,
    get_cogs_report,
    get_profit_loss_report,
    get_stock_aging_report,
)

from rest_framework.generics import GenericAPIView

from apps.common.pagination import (
    StandardResultsPagination,
)

from .utils import paginate_api_view

class DashboardView(APIView):
    permission_classes = [CanViewReports]
    def get(self, request):
        today = date.today()
        month_start = today.replace(day=1)
        total_products = Product.objects.count()
        total_suppliers = Supplier.objects.count()
        total_sales = Sale.objects.count()
        total_purchases = Purchase.objects.count()

        today_sales = (
            Sale.objects.filter(
                sale_date=today
            ).aggregate(
                total=Sum("total")
            )["total"]
            or Decimal("0")
        )

        month_sales = (
            Sale.objects.filter(
                sale_date__gte=month_start
            ).aggregate(
                total=Sum("total")
            )["total"]
            or Decimal("0")
        )

        inventory_value = Decimal("0")
        low_stock_count = 0
        dead_stock_count = 0

        for product in Product.objects.filter(is_active=True):
            stock = get_stock(product)
            inventory_value += (
                stock * product.cost_price
            )
            latest_sale = (
                SaleItem.objects
                .filter(product=product)
                .order_by("-sale__sale_date")
                .first()
            )
            if stock <= product.minimum_stock:
                low_stock_count += 1
            if stock > 0 and latest_sale is None:
                dead_stock_count += 1
        best_product = (
            SaleItem.objects
            .values("product__name")
            .annotate(
                qty=Sum("quantity")
            )
            .order_by("-qty")
            .first()
        )
        top_profit = (
            SaleItem.objects
            .values("product__name")
            .annotate(
                profit=Sum(
                    ExpressionWrapper(
                        (F("unit_price") - F("cost_price"))
                        * F("quantity"),
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
            Sale.objects
            .order_by("-sale_date")[:5]
            .values(
                "invoice_number",
                "sale_date",
                "total",
            )
        )
        recent_purchases = (
            Purchase.objects
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
            "best_selling_product":
                best_product["product__name"]
                if best_product else None,
            "top_profit_product":
                top_profit["product__name"]
                if top_profit else None,
            "recent_sales": recent_sales,
            "recent_purchases": recent_purchases,
        })
    
class DeadStockView(BaseReportView):
    serializer_class = DeadStockSerializer
    filename = "dead-stock"

    def get(self, request):
        days = int(
            request.GET.get("days", 90)
        )
        today = date.today()
        results = []
        for product in Product.objects.filter(
            is_active=True
        ):
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

            if latest_sale is None:
                results.append({
                    "id": product.id,
                    "name": product.name,
                    "current_stock": stock,
                    "last_sale_date": None,
                    "days_since_sale": None,
                    "minimum_stock":
                        product.minimum_stock,
                })
                continue

            last_date = latest_sale.sale.sale_date
            days_since = (
                today - last_date
            ).days

            if days_since >= days:
                results.append({
                    "id": product.id,
                    "name": product.name,
                    "current_stock": stock,
                    "last_sale_date": last_date,
                    "days_since_sale": days_since,
                    "minimum_stock":
                        product.minimum_stock,
                })

        results.sort(
            key=lambda x:
                x["days_since_sale"]
                or 999999,
            reverse=True,
        )
        return self.render(
            request,
            results,
        )
    
class SlowMovingView(BaseReportView):
    serializer_class = SlowMovingSerializer
    filename = "slow-moving"
    def get(self, request):
        start_date = request.GET.get(
            "start_date"
        )
        end_date = request.GET.get(
            "end_date"
        )
        if not start_date:
            start_date = (
                date.today()
                - timedelta(days=30)
            )
        data = get_sales_aggregation(
            start_date=start_date,
            end_date=end_date,
        )
        stock_map = get_stock_map()
        rows = []
        for row in data:
            rows.append({
                "product_id":
                    row["product_id"],
                "product_name":
                    row["product__name"],
                "quantity_sold":
                    row["quantity_sold"],
                "current_stock":
                    stock_map.get(
                        row["product_id"],
                        0,
                    ),
            })

        rows.sort(
            key=lambda x:
                x["quantity_sold"]
        )

        return self.render(
            request,
            rows,
        )
    
class FastMovingView(BaseReportView):
    serializer_class = SlowMovingSerializer
    filename = "fast-moving"

    def get(self, request):
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        if not start_date:
            start_date = (
                date.today()
                - timedelta(days=30)
            )
        data = get_sales_aggregation(
            start_date=start_date,
            end_date=end_date,
        )
        stock_map = get_stock_map()
        results = []
        for row in data:
            results.append({
                "product_id":
                    row["product_id"],
                "product_name":
                    row["product__name"],
                "quantity_sold":
                    row["quantity_sold"],
                "current_stock":
                    stock_map.get(
                        row["product_id"],
                        0,
                    ),
            })
        results.sort(
            key=lambda x:
                x["quantity_sold"],
            reverse=True,
        )
        return self.render(
            request,
            results,
        )
    
class TopProfitProductsView(BaseReportView):

    serializer_class = (
        TopProfitProductSerializer
    )
    filename = "top-profit-products"
    def get(self, request):
        start_date = request.GET.get(
            "start_date"
        )
        end_date = request.GET.get(
            "end_date"
        )
        profit_expr = ExpressionWrapper(
            (F("unit_price") - F("cost_price"))
            * F("quantity"),
            output_field=DecimalField(
                max_digits=15,
                decimal_places=2,
            ),
        )
        queryset = SaleItem.objects.all()
        if start_date:
            queryset = queryset.filter(
                sale__sale_date__gte=start_date
            )
        if end_date:
            queryset = queryset.filter(
                sale__sale_date__lte=end_date
            )

        rows = (
    queryset
    .values(
        "product_id",
        "product__name",
    )
    .annotate(
        total_profit=Sum(
            profit_expr
        )
    )
    .order_by("-total_profit")
)

        results = [
    {
        "product_id": row["product_id"],
        "product_name": row["product__name"],
        "total_profit": row["total_profit"],
    }
    for row in rows
]

        return self.render(
    request,
    results,
)
    
class ReorderSuggestionsView(BaseReportView):
    serializer_class = ReorderSuggestionSerializer
    filename = "reorder-suggestions"

    def get(self, request):
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        if not start_date:
            start_date = (
                date.today()
                - timedelta(days=30)
            )
        data = get_sales_aggregation(
            start_date=start_date,
            end_date=end_date,
        )
        stock_map = get_stock_map()
        results = []
        for row in data:
            stock = stock_map.get(
                row["product_id"],
                0,
            )
            minimum_stock = row[
                "product__minimum_stock"
            ]
            if stock > minimum_stock:
                continue
            recommended = max(
                minimum_stock * 2,
                max(
                    row["quantity_sold"] - stock,
                    0,
                ),
            )
            results.append({
                "product_id":
                    row["product_id"],
                "product_name":
                    row["product__name"],
                "current_stock":
                    stock,
                "minimum_stock":
                    minimum_stock,
                "recommended_order":
                    recommended,
            })

        results.sort(
            key=lambda x:
                x["current_stock"]
        )
        return self.render(
            request,
            results,
        )
    
class InventoryValuationView(BaseReportView):
    serializer_class = InventoryValuationSerializer
    filename = "inventory-valuation"

    def get(self, request):
        return self.render(
            request,
            get_inventory_valuation(),
        )
    
class InventorySummaryView(APIView):
    permission_classes = [
        CanViewReports,
    ]
    def get(self, request):

        serializer = (
            InventorySummarySerializer(
                get_inventory_summary()
            )
        )
        return Response(
            serializer.data
        )
    
class COGSReportView(APIView):
    permission_classes = [
        CanViewReports,
    ]
    def get(self, request):
        start_date = request.GET.get(
            "start_date"
        )
        end_date = request.GET.get(
            "end_date"
        )
        serializer = (
            COGSReportSerializer(
                get_cogs_report(
                    start_date=start_date,
                    end_date=end_date,
                )
            )
        )
        return Response(
            serializer.data
        )
    
class ProfitLossReportView(APIView):
    permission_classes = [
        CanViewReports,
    ]
    def get(self, request):
        start_date = request.GET.get(
            "start_date"
        )
        end_date = request.GET.get(
            "end_date"
        )
        serializer = (
            ProfitLossSerializer(
                get_profit_loss_report(
                    start_date=start_date,
                    end_date=end_date,
                )
            )
        )
        return Response(
            serializer.data
        )
    
class StockAgingView(BaseReportView):
    serializer_class = StockAgingSerializer
    filename = "stock-aging"

    def get(self, request):
        return self.render(
            request,
            get_stock_aging_report(),
        )
    
class DashboardAnalyticsView(APIView):
    permission_classes = [CanViewReports]

    def get(self, request):
        return Response({
            "inventory_summary": get_inventory_summary(),
            "profit_loss": get_profit_loss_report(),
            "cogs": get_cogs_report(),
            "stock_aging": get_stock_aging_report()[:5],
            "top_profit_products": TopProfitProductsView().get(
                request
            ).data[:5],
        })
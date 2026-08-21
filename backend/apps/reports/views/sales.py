from django.db.models import Sum, F, DecimalField, ExpressionWrapper
from rest_framework.views import APIView
from rest_framework.response import Response

from apps.accounts.permissions import CanViewReports
from apps.sales.models import Sale, SaleItem

from apps.reports.base import BaseReportView
from apps.reports.serializers import TopProfitProductSerializer, COGSReportSerializer, ProfitLossSerializer
from apps.reports.services import get_cogs_report, get_profit_loss_report


class TopProfitProductsView(BaseReportView):
    serializer_class = TopProfitProductSerializer
    filename = "top-profit-products"

    def get(self, request):
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        limit = request.GET.get("limit")

        profit_expr = ExpressionWrapper(
            (F("unit_price") - F("cost_price")) * F("quantity"),
            output_field=DecimalField(
                max_digits=15,
                decimal_places=2,
            ),
        )

        queryset = SaleItem.objects.filter(sale__status=Sale.STATUS_ACTIVE)

        if start_date:
            queryset = queryset.filter(sale__sale_date__gte=start_date)

        if end_date:
            queryset = queryset.filter(sale__sale_date__lte=end_date)

        rows = [
            {
                "product_id": row["product_id"],
                "product_name": row["product__name"],
                "total_profit": row["total_profit"],
            }
            for row in (
                queryset.values("product_id", "product__name")
                .annotate(total_profit=Sum(profit_expr))
                .order_by("-total_profit")
            )
        ]

        if limit:
            rows = rows[: int(limit)]

        return self.render(request, rows)


class COGSReportView(APIView):
    permission_classes = [CanViewReports]

    def get(self, request):
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        serializer = COGSReportSerializer(
            get_cogs_report(
                start_date=start_date,
                end_date=end_date,
            )
        )
        return Response(serializer.data)


class ProfitLossReportView(APIView):
    permission_classes = [CanViewReports]

    def get(self, request):
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        serializer = ProfitLossSerializer(
            get_profit_loss_report(
                start_date=start_date,
                end_date=end_date,
            )
        )
        return Response(serializer.data)
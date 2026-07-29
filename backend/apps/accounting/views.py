from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework import status, viewsets
from rest_framework.decorators import action

##expenses
from apps.accounting.models import (
    Expense,
    ExpenseCategory,
)
from apps.accounting.serializers import (
    ExpenseSerializer,
    ExpenseCategorySerializer,
)
from apps.accounting.services.expense_service import ExpenseService


class ExpenseCategoryViewSet(ModelViewSet):

    queryset = ExpenseCategory.objects.all()
    serializer_class = ExpenseCategorySerializer


class ExpenseViewSet(ModelViewSet):

    queryset = (
        Expense.objects
        .select_related(
            "category",
            "supplier",
            "created_by",
        )
    )

    serializer_class = ExpenseSerializer

    def perform_create(self, serializer):

        ExpenseService.create_expense(
            created_by=self.request.user,
            **serializer.validated_data,
        )

    def destroy(self, request, *args, **kwargs):

        expense = self.get_object()

        ExpenseService.cancel_expense(
            expense,
            user=request.user,
        )

        return Response(
            status=status.HTTP_204_NO_CONTENT,
        )

##payments
from apps.accounting.models import Payment
from apps.accounting.serializers import PaymentSerializer
from apps.accounting.services.payment_service import PaymentService


class PaymentViewSet(viewsets.ModelViewSet):

    queryset = (
        Payment.objects
        .select_related(
            "created_by",
            "content_type",
        )
        .order_by("-date", "-id")
    )

    serializer_class = PaymentSerializer

    @action(
        detail=True,
        methods=["post"],
    )
    def cancel(self, request, pk=None):

        payment = self.get_object()

        PaymentService.cancel_payment(
            payment,
            user=request.user,
        )

        serializer = self.get_serializer(payment)

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):

        payment = self.get_object()

        PaymentService.delete_payment(payment)

        return Response(
            status=status.HTTP_204_NO_CONTENT,
        )

###ledgar
from django.shortcuts import get_object_or_404

from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounting.models import Account
from apps.accounting.serializers import (
    LedgerSerializer,
    TrialBalanceSerializer,
)
from apps.accounting.services.ledger_service import (
    LedgerService,
)

from apps.reports.exporters import export_response


class AccountLedgerView(APIView):

    def get(
        self,
        request,
        code,  # <--- Matches the <str:code> in urls.py
    ):
        account = get_object_or_404(
            Account,
            code=code,  # <--- Fetches Account by code (e.g., 1000)
        )

        ledger = LedgerService.get_account_ledger(
            account=account,
            start_date=request.GET.get("start_date"),
            end_date=request.GET.get("end_date"),
        )

        export = export_response(
            request,
            f"ledger_{account.code}",
            ledger["transactions"],
        )

        if export:
            return export

        serializer = LedgerSerializer(ledger)

        return Response(serializer.data)


##trail balance
from apps.accounting.services.trial_balance_service import TrialBalanceService
class TrialBalanceView(APIView):

    def get(self, request):

        report = TrialBalanceService.get_trial_balance(
            start_date=request.GET.get(
                "start_date"
            ),
            end_date=request.GET.get(
                "end_date"
            ),
        )

        export = export_response(
            request,
            "trial_balance",
            report["accounts"],
        )

        if export:
            return export

        serializer = TrialBalanceSerializer(
            report
        )

        return Response(
            serializer.data
        )
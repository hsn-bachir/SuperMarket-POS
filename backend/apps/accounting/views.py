from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.accounts.permissions import IsAdminOrManager
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
    permission_classes = [IsAdminOrManager]


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
    permission_classes = [IsAdminOrManager]

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
    permission_classes = [IsAdminOrManager]

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
    permission_classes = [IsAdminOrManager]

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
    permission_classes = [IsAdminOrManager]

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

##Financial Statements
from datetime import date

from apps.accounting.serializers import (
    IncomeStatementSerializer,
)
from apps.accounting.services.income_statement_service import (
    IncomeStatementService,
)

class IncomeStatementView(APIView):
    permission_classes = [IsAdminOrManager]

    def get(self, request):

        start_date = request.GET.get(
            "start_date"
        )

        end_date = request.GET.get(
            "end_date"
        )

        if start_date:
            start_date = date.fromisoformat(
                start_date
            )

        if end_date:
            end_date = date.fromisoformat(
                end_date
            )

        report = (
            IncomeStatementService
            .get_income_statement(
                start_date=start_date,
                end_date=end_date,
            )
        )

        rows = []

        for row in report["revenue"]:

            rows.append(
                {
                    "Section": "Revenue",
                    "Code": row["code"],
                    "Account": row["name"],
                    "Amount": row["amount"],
                }
            )

        rows.append(
            {
                "Section": "",
                "Code": "",
                "Account": "Total Revenue",
                "Amount": report["total_revenue"],
            }
        )

        for row in report["expenses"]:

            rows.append(
                {
                    "Section": "Expense",
                    "Code": row["code"],
                    "Account": row["name"],
                    "Amount": row["amount"],
                }
            )

        rows.append(
            {
                "Section": "",
                "Code": "",
                "Account": "Total Expenses",
                "Amount": report["total_expenses"],
            }
        )

        rows.append(
            {
                "Section": "",
                "Code": "",
                "Account": "Net Profit",
                "Amount": report["net_profit"],
            }
        )

        export = export_response(
            request,
            "income_statement",
            rows,
        )

        if export:
            return export

        serializer = (
            IncomeStatementSerializer(
                report
            )
        )

        return Response(
            serializer.data
        )

from apps.accounting.serializers import (
    BalanceSheetSerializer,
)

from apps.accounting.services.balance_sheet_service import (
    BalanceSheetService,
)

class BalanceSheetView(APIView):
    permission_classes = [IsAdminOrManager]

    def get(self, request):

        end_date = request.GET.get(
            "end_date"
        )


        if end_date:

            end_date = date.fromisoformat(
                end_date
            )


        report = (
            BalanceSheetService
            .get_balance_sheet(
                end_date=end_date
            )
        )


        rows = []


        # Assets

        for row in report["assets"]:

            rows.append(
                {
                    "Section": "Assets",
                    "Code": row["code"],
                    "Account": row["name"],
                    "Amount": row["amount"],
                }
            )


        rows.append(
            {
                "Section": "",
                "Code": "",
                "Account": "Total Assets",
                "Amount": report["total_assets"],
            }
        )


        # Liabilities

        for row in report["liabilities"]:

            rows.append(
                {
                    "Section": "Liabilities",
                    "Code": row["code"],
                    "Account": row["name"],
                    "Amount": row["amount"],
                }
            )


        rows.append(
            {
                "Section": "",
                "Code": "",
                "Account": "Total Liabilities",
                "Amount": report["total_liabilities"],
            }
        )


        # Equity

        for row in report["equity"]:

            rows.append(
                {
                    "Section": "Equity",
                    "Code": row["code"],
                    "Account": row["name"],
                    "Amount": row["amount"],
                }
            )


        rows.append(
            {
                "Section": "",
                "Code": "",
                "Account": "Total Equity",
                "Amount": report["total_equity"],
            }
        )


        export = export_response(
            request,
            "balance_sheet",
            rows,
        )


        if export:

            return export


        serializer = BalanceSheetSerializer(
            report
        )


        return Response(
            serializer.data
        )


from apps.accounting.services.cash_flow_service import (
    CashFlowService,
)

from apps.accounting.serializers import (
    CashFlowSerializer,
)


class CashFlowView(APIView):
    permission_classes = [IsAdminOrManager]

    def get(self, request):

        start_date = request.GET.get(
            "start_date"
        )

        end_date = request.GET.get(
            "end_date"
        )


        if start_date:

            start_date = date.fromisoformat(
                start_date
            )


        if end_date:

            end_date = date.fromisoformat(
                end_date
            )


        report = (
            CashFlowService
            .get_cash_flow(
                start_date=start_date,
                end_date=end_date,
            )
        )


        rows = []


        for section, title in [
            ("operating", "Operating"),
            ("investing", "Investing"),
            ("financing", "Financing"),
        ]:

            for row in report[section]:

                rows.append(
                    {
                        "Section": title,
                        "Code": row["code"],
                        "Account": row["name"],
                        "Amount": row["amount"],
                    }
                )


        rows.extend(
            [
                {
                    "Section": "",
                    "Code": "",
                    "Account": "Net Operating Cash",
                    "Amount": report["net_operating"],
                },

                {
                    "Section": "",
                    "Code": "",
                    "Account": "Net Investing Cash",
                    "Amount": report["net_investing"],
                },

                {
                    "Section": "",
                    "Code": "",
                    "Account": "Net Financing Cash",
                    "Amount": report["net_financing"],
                },

                {
                    "Section": "",
                    "Code": "",
                    "Account": "Net Cash Change",
                    "Amount": report["net_cash_change"],
                },
            ]
        )


        export = export_response(
            request,
            "cash_flow_statement",
            rows,
        )


        if export:

            return export


        serializer = CashFlowSerializer(
            report
        )


        return Response(
            serializer.data
        )


### periods

from rest_framework.viewsets import ReadOnlyModelViewSet

from apps.accounting.models import AccountingPeriod

from apps.accounting.serializers import (
    AccountingPeriodSerializer,
)

from apps.accounting.services.accounting_period_service import (
    AccountingPeriodService,
)

from apps.accounting.services.closing_service import (
    ClosingService,
)


class AccountingPeriodViewSet(
    ReadOnlyModelViewSet
):
    permission_classes = [IsAdminOrManager]

    queryset = (
        AccountingPeriod.objects
        .order_by("-start_date")
    )

    serializer_class = AccountingPeriodSerializer


    @action(
        detail=False,
        methods=["get"],
    )
    def current(self, request):

        period = (
            AccountingPeriodService
            .get_current_period(
                transaction_date=date.today()
            )
        )

        serializer = self.get_serializer(
            period
        )

        return Response(
            serializer.data
        )


    @action(
        detail=True,
        methods=["post"],
    )
    def close(
        self,
        request,
        pk=None,
    ):

        period = self.get_object()


        ClosingService.close_period(
            period=period,
            user=request.user,
        )


        serializer = self.get_serializer(
            period
        )


        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


    @action(
        detail=True,
        methods=["post"],
    )
    def reopen(
        self,
        request,
        pk=None,
    ):

        period = self.get_object()


        AccountingPeriodService.reopen_period(
            period=period,
            user=request.user,
        )


        serializer = self.get_serializer(
            period
        )


        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )
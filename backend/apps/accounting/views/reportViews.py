from datetime import date
from django.shortcuts import get_object_or_404

from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsAdminOrManager
from apps.accounting.models.accountModel import Account
from apps.accounting.serializers.reportsSerializer import (
    LedgerSerializer,
    TrialBalanceSerializer,
    IncomeStatementSerializer,
    BalanceSheetSerializer,
    CashFlowSerializer,
)
from apps.accounting.services.report_services.ledger_service import LedgerService
from apps.accounting.services.report_services.trial_balance_service import TrialBalanceService
from apps.accounting.services.report_services.income_statement_service import IncomeStatementService
from apps.accounting.services.report_services.balance_sheet_service import BalanceSheetService
from apps.accounting.services.report_services.cash_flow_service import CashFlowService

from apps.reports.exporters import export_response


class AccountLedgerView(APIView):
    permission_classes = [IsAdminOrManager]

    def get(self, request, code):
        account = get_object_or_404(Account, code=code)
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


class TrialBalanceView(APIView):
    permission_classes = [IsAdminOrManager]

    def get(self, request):
        report = TrialBalanceService.get_trial_balance(
            start_date=request.GET.get("start_date"),
            end_date=request.GET.get("end_date"),
        )

        export = export_response(
            request,
            "trial_balance",
            report["accounts"],
        )
        if export:
            return export

        serializer = TrialBalanceSerializer(report)
        return Response(serializer.data)


class IncomeStatementView(APIView):
    permission_classes = [IsAdminOrManager]

    def get(self, request):
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")

        if start_date:
            start_date = date.fromisoformat(start_date)
        if end_date:
            end_date = date.fromisoformat(end_date)

        report = IncomeStatementService.get_income_statement(
            start_date=start_date,
            end_date=end_date,
        )

        rows = []
        for row in report["revenue"]:
            rows.append({
                "Section": "Revenue",
                "Code": row["code"],
                "Account": row["name"],
                "Amount": row["amount"],
            })

        rows.append({
            "Section": "",
            "Code": "",
            "Account": "Total Revenue",
            "Amount": report["total_revenue"],
        })

        for row in report["expenses"]:
            rows.append({
                "Section": "Expense",
                "Code": row["code"],
                "Account": row["name"],
                "Amount": row["amount"],
            })

        rows.append({
            "Section": "",
            "Code": "",
            "Account": "Total Expenses",
            "Amount": report["total_expenses"],
        })

        rows.append({
            "Section": "",
            "Code": "",
            "Account": "Net Profit",
            "Amount": report["net_profit"],
        })

        export = export_response(request, "income_statement", rows)
        if export:
            return export

        serializer = IncomeStatementSerializer(report)
        return Response(serializer.data)


class BalanceSheetView(APIView):
    permission_classes = [IsAdminOrManager]

    def get(self, request):
        end_date = request.GET.get("end_date")
        if end_date:
            end_date = date.fromisoformat(end_date)

        report = BalanceSheetService.get_balance_sheet(end_date=end_date)

        rows = []
        for row in report["assets"]:
            rows.append({
                "Section": "Assets",
                "Code": row["code"],
                "Account": row["name"],
                "Amount": row["amount"],
            })

        rows.append({
            "Section": "",
            "Code": "",
            "Account": "Total Assets",
            "Amount": report["total_assets"],
        })

        for row in report["liabilities"]:
            rows.append({
                "Section": "Liabilities",
                "Code": row["code"],
                "Account": row["name"],
                "Amount": row["amount"],
            })

        rows.append({
            "Section": "",
            "Code": "",
            "Account": "Total Liabilities",
            "Amount": report["total_liabilities"],
        })

        for row in report["equity"]:
            rows.append({
                "Section": "Equity",
                "Code": row["code"],
                "Account": row["name"],
                "Amount": row["amount"],
            })

        rows.append({
            "Section": "",
            "Code": "",
            "Account": "Total Equity",
            "Amount": report["total_equity"],
        })

        export = export_response(request, "balance_sheet", rows)
        if export:
            return export

        serializer = BalanceSheetSerializer(report)
        return Response(serializer.data)


class CashFlowView(APIView):
    permission_classes = [IsAdminOrManager]

    def get(self, request):
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")

        if start_date:
            start_date = date.fromisoformat(start_date)
        if end_date:
            end_date = date.fromisoformat(end_date)

        report = CashFlowService.get_cash_flow(
            start_date=start_date,
            end_date=end_date,
        )

        rows = []
        for section, title in [
            ("operating", "Operating"),
            ("investing", "Investing"),
            ("financing", "Financing"),
        ]:
            for row in report[section]:
                rows.append({
                    "Section": title,
                    "Code": row["code"],
                    "Account": row["name"],
                    "Amount": row["amount"],
                })

        rows.extend([
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
        ])

        export = export_response(request, "cash_flow_statement", rows)
        if export:
            return export

        serializer = CashFlowSerializer(report)
        return Response(serializer.data)
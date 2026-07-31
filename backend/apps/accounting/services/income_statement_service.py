from decimal import Decimal

from django.db.models import Sum

from apps.accounting.models import (
    Account,
    JournalLine,
)
from apps.common.enums import (
    AccountType,
    NormalBalance,
)


class IncomeStatementService:

    @staticmethod
    def get_income_statement(
        *,
        start_date=None,
        end_date=None,
    ):

        accounts = (
            Account.objects
            .filter(
                is_active=True,
                is_postable=True,
                account_type__in=[
                    AccountType.REVENUE,
                    AccountType.EXPENSE,
                ],
            )
            .order_by("code")
        )

        journal_lines = JournalLine.objects.filter(journal_entry__status="POSTED")

        if start_date:
            journal_lines = journal_lines.filter(
                journal_entry__date__gte=start_date,
            )

        if end_date:
            journal_lines = journal_lines.filter(
                journal_entry__date__lte=end_date,
            )

        balances = (
            journal_lines
            .order_by()
            .values("account_id")
            .annotate(
                total_debit=Sum("debit"),
                total_credit=Sum("credit"),
            )
        )

        balance_map = {
            row["account_id"]: row
            for row in balances
        }

        revenue = []
        expenses = []

        total_revenue = Decimal("0.00")
        total_expenses = Decimal("0.00")

        for account in accounts:

            values = balance_map.get(
                account.id,
                {},
            )

            debit = (
                values.get("total_debit")
                or Decimal("0.00")
            )

            credit = (
                values.get("total_credit")
                or Decimal("0.00")
            )

            if account.normal_balance == NormalBalance.DEBIT:
                balance = debit - credit
            else:
                balance = credit - debit

            amount = abs(balance)

            row = {
                "account_id": account.id,
                "code": account.code,
                "name": account.name,
                "amount": amount,
            }

            if account.account_type == AccountType.REVENUE:

                revenue.append(row)
                total_revenue += amount

            else:

                expenses.append(row)
                total_expenses += amount

        return {

            "revenue": revenue,

            "total_revenue": total_revenue,

            "expenses": expenses,

            "total_expenses": total_expenses,

            "net_profit": (
                total_revenue
                - total_expenses
            ),
        }
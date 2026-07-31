from decimal import Decimal

from django.db.models import Sum

from apps.accounting.models import (
    Account,
    JournalLine,
)
from apps.common.enums import NormalBalance


class TrialBalanceService:

    @staticmethod
    def get_trial_balance(
        *,
        start_date=None,
        end_date=None,
    ):
        accounts = (
            Account.objects
            .filter(
                is_active=True,
                is_postable=True,
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

        rows = []
        total_debit = Decimal("0.00")
        total_credit = Decimal("0.00")

        for account in accounts:
            values = balance_map.get(account.id, {})

            debit = values.get("total_debit") or Decimal("0.00")
            credit = values.get("total_credit") or Decimal("0.00")

            if account.normal_balance == NormalBalance.DEBIT:
                balance = debit - credit
            else:
                balance = credit - debit

            debit_balance = Decimal("0.00")
            credit_balance = Decimal("0.00")

            if balance >= 0:
                if account.normal_balance == NormalBalance.DEBIT:
                    debit_balance = balance
                else:
                    credit_balance = balance
            else:
                if account.normal_balance == NormalBalance.DEBIT:
                    credit_balance = abs(balance)
                else:
                    debit_balance = abs(balance)

            total_debit += debit_balance
            total_credit += credit_balance

            rows.append(
                {
                    "id": account.id,
                    "account_id": account.id,
                    "code": account.code,
                    "name": account.name,
                    "normal_balance": account.normal_balance,  # <--- Added key
                    "debit": debit_balance,
                    "credit": credit_balance,
                }
            )

        return {
            "accounts": rows,
            "total_debit": total_debit,
            "total_credit": total_credit,
            "is_balanced": (total_debit == total_credit),
        }
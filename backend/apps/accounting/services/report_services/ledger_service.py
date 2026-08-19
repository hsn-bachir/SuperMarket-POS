from decimal import Decimal

from django.db.models import Sum

from apps.accounting.models.journalModel import JournalLine
from apps.common.enums import NormalBalance


class LedgerService:

    @staticmethod
    def get_account_ledger(
        *,
        account,
        start_date=None,
        end_date=None,
    ):

        # Base query
        queryset = (
            JournalLine.objects
            .filter(account=account, journal_entry__status="POSTED")
            .select_related(
                "journal_entry",
                "account",
            )
        )

        # -------------------------
        # Opening Balance
        # -------------------------

        opening_balance = Decimal("0.00")

        if start_date:

            previous_lines = queryset.filter(
                journal_entry__date__lt=start_date
            )

            total_debit = (
                previous_lines.aggregate(
                    total=Sum("debit")
                )["total"]
                or Decimal("0.00")
            )

            total_credit = (
                previous_lines.aggregate(
                    total=Sum("credit")
                )["total"]
                or Decimal("0.00")
            )

            if account.normal_balance == NormalBalance.DEBIT:
                opening_balance = (
                    total_debit - total_credit
                )
            else:
                opening_balance = (
                    total_credit - total_debit
                )

        # -------------------------
        # Apply Date Filters
        # -------------------------

        if start_date:
            queryset = queryset.filter(
                journal_entry__date__gte=start_date
            )

        if end_date:
            queryset = queryset.filter(
                journal_entry__date__lte=end_date
            )

        queryset = queryset.order_by(
            "journal_entry__date",
            "journal_entry__id",
            "id",
        )

        # -------------------------
        # Running Balance
        # -------------------------

        running_balance = opening_balance

        total_debit = Decimal("0.00")
        total_credit = Decimal("0.00")

        transactions = []

        for line in queryset:

            total_debit += line.debit
            total_credit += line.credit

            if account.normal_balance == NormalBalance.DEBIT:

                running_balance += line.debit
                running_balance -= line.credit

            else:

                running_balance += line.credit
                running_balance -= line.debit

            transactions.append(
                {
                    "date": line.journal_entry.date,
                    "journal_number": line.journal_entry.id,
                    "journal_type": line.journal_entry.journal_type,
                    "description": line.description
                    or line.journal_entry.description,
                    "reference": str(
                        line.journal_entry.reference
                    )
                    if line.journal_entry.reference
                    else "",
                    "debit": line.debit,
                    "credit": line.credit,
                    "running_balance": running_balance,
                }
            )

        return {

            "account": {
                "id": account.id,
                "code": account.code,
                "name": account.name,
            },

            "opening_balance": opening_balance,

            "transactions": transactions,

            "total_debit": total_debit,

            "total_credit": total_credit,

            "closing_balance": running_balance,
        }
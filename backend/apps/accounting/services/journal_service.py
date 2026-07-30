from decimal import Decimal

from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.db import transaction

from apps.accounting.models import (
    JournalEntry,
    JournalLine,
)
from apps.accounting.services.accounting_period_service import (
    AccountingPeriodService,
)


class JournalService:

    @staticmethod
    @transaction.atomic
    def create_entry(
        *,
        date,
        journal_type,
        description,
        created_by,
        lines,
        reference=None,
    ):
        # Validate accounting period
        period = AccountingPeriodService.validate_transaction_date(date)

        # Validate journal lines before saving anything
        JournalService.validate_lines(lines)

        # Create journal header
        entry = JournalEntry.objects.create(
            period=period,
            date=date,
            journal_type=journal_type,
            description=description,
            created_by=created_by,
        )

        # Attach generic reference if provided
        if reference:
            entry.content_type = ContentType.objects.get_for_model(reference)
            entry.object_id = reference.pk
            entry.save(update_fields=["content_type", "object_id"])

        # Create journal lines
        JournalLine.objects.bulk_create(
            [
                JournalLine(
                    journal_entry=entry,
                    account=line["account"],
                    debit=line.get("debit", Decimal("0.00")),
                    credit=line.get("credit", Decimal("0.00")),
                    description=line.get("description", ""),
                )
                for line in lines
            ]
        )

        return entry

    @staticmethod
    def validate_lines(lines):
        """
        Validate journal lines before saving.
        """

        if len(lines) < 2:
            raise ValidationError(
                "A journal entry must contain at least two lines."
            )

        total_debit = Decimal("0.00")
        total_credit = Decimal("0.00")

        for line in lines:
            account = line["account"]

            debit = line.get("debit", Decimal("0.00"))
            credit = line.get("credit", Decimal("0.00"))

            if not account.is_postable:
                raise ValidationError(
                    f"Account '{account.code}' is not postable."
                )

            if debit < 0 or credit < 0:
                raise ValidationError(
                    "Debit and credit amounts cannot be negative."
                )

            if debit > 0 and credit > 0:
                raise ValidationError(
                    f"Account '{account.code}' cannot have both debit and credit."
                )

            if debit == 0 and credit == 0:
                raise ValidationError(
                    f"Account '{account.code}' must have either a debit or credit amount."
                )

            total_debit += debit
            total_credit += credit

        if total_debit != total_credit:
            raise ValidationError(
                {
                    "journal": "Journal entry is not balanced.",
                    "debit": total_debit,
                    "credit": total_credit,
                }
            )

        return True
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
from apps.common.enums import EntryStatus


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
        allow_closing_period=False,
    ):
        # Validate accounting period
        period = AccountingPeriodService.validate_transaction_date(
            date,
            allow_closing_period=allow_closing_period,
        )

        # Validate journal lines before saving anything
        JournalService.validate_lines(lines)

        if reference and JournalService._has_existing_posting(reference, journal_type, description):
            raise ValidationError("A posting already exists for this document.")

        # Create journal header
        entry = JournalEntry.objects.create(
            period=period,
            date=date,
            journal_type=journal_type,
            description=description,
            created_by=created_by,
            status=EntryStatus.POSTED,
            updated_by=created_by,
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
                    created_by=created_by,
                    updated_by=created_by,
                )
                for line in lines
            ]
        )

        entry.updated_by = created_by
        entry.save(update_fields=["updated_by", "updated_at"])

        return entry

    @staticmethod
    def _has_existing_posting(reference, journal_type, description=None):
        if not reference:
            return False

        content_type = ContentType.objects.get_for_model(reference)
        queryset = JournalEntry.objects.filter(
            content_type=content_type,
            object_id=reference.pk,
            journal_type=journal_type,
            status=EntryStatus.POSTED,
        )

        if description and str(description).lower().startswith("reverse"):
            return False

        return queryset.exists()

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

            if not account.is_active:
                raise ValidationError(
                    f"Account '{account.code}' is inactive."
                )

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
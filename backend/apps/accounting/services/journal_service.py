from decimal import Decimal

from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.db import transaction

from apps.accounting.models.journalModel import (
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
        reversal_of=None,
    ):
        """
        Create and post a journal entry.

        Normal entry:
            reversal_of=None

        Reversal entry:
            reversal_of=<posted JournalEntry>

        A journal is created as DRAFT internally, validated,
        populated with lines, and then transitioned to POSTED
        inside the same atomic transaction.
        """

        # ---------------------------------------------------------
        # VALIDATE ACCOUNTING PERIOD
        # ---------------------------------------------------------

        period = AccountingPeriodService.validate_transaction_date(
            date,
            allow_closing_period=allow_closing_period,
        )

        # ---------------------------------------------------------
        # VALIDATE JOURNAL LINES
        # ---------------------------------------------------------

        JournalService.validate_lines(lines)

        # ---------------------------------------------------------
        # VALIDATE REVERSAL
        # ---------------------------------------------------------

        if reversal_of is not None:
            JournalService.validate_reversal(reversal_of)

        # ---------------------------------------------------------
        # PREVENT DUPLICATE DOCUMENT POSTING
        # ---------------------------------------------------------

        if reference and reversal_of is None:
            if JournalService._has_existing_posting(
                reference=reference,
                journal_type=journal_type,
            ):
                raise ValidationError(
                    "A posted journal already exists for this document."
                )

        # ---------------------------------------------------------
        # CREATE JOURNAL AS DRAFT
        # ---------------------------------------------------------

        entry = JournalEntry.objects.create(
            period=period,
            date=date,
            journal_type=journal_type,
            description=description,
            created_by=created_by,
            updated_by=created_by,
            status=EntryStatus.DRAFT,
            reversal_of=reversal_of,
        )

        # ---------------------------------------------------------
        # ATTACH GENERIC REFERENCE
        # ---------------------------------------------------------

        if reference is not None:
            entry.content_type = ContentType.objects.get_for_model(
                reference
            )
            entry.object_id = reference.pk

            entry.save(
                update_fields=[
                    "content_type",
                    "object_id",
                    "updated_at",
                ]
            )

        # ---------------------------------------------------------
        # CREATE JOURNAL LINES
        # ---------------------------------------------------------

        JournalLine.objects.bulk_create(
            [
                JournalLine(
                    journal_entry=entry,
                    account=line["account"],
                    debit=line.get(
                        "debit",
                        Decimal("0.00"),
                    ),
                    credit=line.get(
                        "credit",
                        Decimal("0.00"),
                    ),
                    description=line.get(
                        "description",
                        "",
                    ),
                    created_by=created_by,
                    updated_by=created_by,
                )
                for line in lines
            ]
        )

        # ---------------------------------------------------------
        # POST JOURNAL
        # ---------------------------------------------------------

        entry.status = EntryStatus.POSTED
        entry.updated_by = created_by

        entry.save(
            update_fields=[
                "status",
                "updated_by",
                "updated_at",
            ]
        )

        return entry

    # =============================================================
    # DUPLICATE POSTING
    # =============================================================

    @staticmethod
    def _has_existing_posting(
        *,
        reference,
        journal_type,
    ):
        if reference is None:
            return False

        content_type = ContentType.objects.get_for_model(
            reference
        )

        return JournalEntry.objects.filter(
            content_type=content_type,
            object_id=reference.pk,
            journal_type=journal_type,
            status=EntryStatus.POSTED,
            reversal_of__isnull=True,
        ).exists()

    # =============================================================
    # REVERSAL VALIDATION
    # =============================================================

    @staticmethod
    def validate_reversal(journal_entry):
        """
        Validate that a journal can be reversed.

        A posted journal can be reversed exactly once.
        """

        if journal_entry is None:
            raise ValidationError(
                "A journal entry is required for reversal."
            )

        # Lock the journal while validating it.
        journal_entry = (
            JournalEntry.objects
            .select_for_update()
            .filter(pk=journal_entry.pk)
            .first()
        )

        if journal_entry is None:
            raise ValidationError(
                "The journal entry does not exist."
            )

        if journal_entry.status != EntryStatus.POSTED:
            raise ValidationError(
                "Only posted journal entries can be reversed."
            )

        if journal_entry.reversal is not None:
            raise ValidationError(
                "This journal entry has already been reversed."
            )

        return True

    # =============================================================
    # LINE VALIDATION
    # =============================================================

    @staticmethod
    def validate_lines(lines):
        """
        Validate journal lines before anything is saved.
        """

        if not lines:
            raise ValidationError(
                "A journal entry must contain journal lines."
            )

        if len(lines) < 2:
            raise ValidationError(
                "A journal entry must contain at least two lines."
            )

        total_debit = Decimal("0.00")
        total_credit = Decimal("0.00")

        for line in lines:

            if "account" not in line:
                raise ValidationError(
                    "Every journal line must contain an account."
                )

            account = line["account"]

            debit = Decimal(
                str(
                    line.get(
                        "debit",
                        Decimal("0.00"),
                    )
                )
            )

            credit = Decimal(
                str(
                    line.get(
                        "credit",
                        Decimal("0.00"),
                    )
                )
            )

            # -----------------------------------------------------
            # ACCOUNT VALIDATION
            # -----------------------------------------------------

            if not account.is_active:
                raise ValidationError(
                    f"Account '{account.code}' is inactive."
                )

            if not account.is_postable:
                raise ValidationError(
                    f"Account '{account.code}' is not postable."
                )

            # -----------------------------------------------------
            # AMOUNT VALIDATION
            # -----------------------------------------------------

            if debit < 0 or credit < 0:
                raise ValidationError(
                    "Debit and credit amounts cannot be negative."
                )

            if debit > 0 and credit > 0:
                raise ValidationError(
                    f"Account '{account.code}' cannot have "
                    "both debit and credit."
                )

            if debit == 0 and credit == 0:
                raise ValidationError(
                    f"Account '{account.code}' must have either "
                    "a debit or credit amount."
                )

            total_debit += debit
            total_credit += credit

        # ---------------------------------------------------------
        # BALANCE VALIDATION
        # ---------------------------------------------------------

        if total_debit != total_credit:
            raise ValidationError(
                {
                    "journal": "Journal entry is not balanced.",
                    "debit": total_debit,
                    "credit": total_credit,
                }
            )

        if total_debit <= 0:
            raise ValidationError(
                "Journal entry must contain a positive amount."
            )

        return True
from decimal import Decimal

from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q, Sum

from apps.accounting.models.accountModel import Account
from apps.common.enums import (
    EntryStatus,
    JournalType,
)


class JournalEntryQuerySet(models.QuerySet):

    def delete(self, *args, **kwargs):
        if self.filter(
            status=EntryStatus.POSTED
        ).exists():
            raise ValidationError(
                "Posted journal entries cannot be deleted."
            )

        return super().delete(*args, **kwargs)


class JournalEntryManager(
    models.Manager.from_queryset(JournalEntryQuerySet)
):
    pass


class JournalEntry(models.Model):

    # =============================================================
    # IDENTIFICATION
    # =============================================================

    sequence = models.PositiveIntegerField(
        db_index=True,
        editable=False,
    )

    number = models.CharField(
        max_length=30,
        unique=True,
        editable=False,
    )

    # =============================================================
    # JOURNAL INFORMATION
    # =============================================================

    date = models.DateField()

    journal_type = models.CharField(
        max_length=30,
        choices=JournalType.choices,
    )

    description = models.TextField(
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=EntryStatus.choices,
        default=EntryStatus.DRAFT,
    )

    # =============================================================
    # ACCOUNTING PERIOD
    # =============================================================

    period = models.ForeignKey(
        "accounting.AccountingPeriod",
        on_delete=models.PROTECT,
        related_name="journal_entries",
    )

    # =============================================================
    # DOCUMENT REFERENCE
    # =============================================================

    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
    )

    object_id = models.PositiveBigIntegerField(
        null=True,
        blank=True,
    )

    reference = GenericForeignKey(
        "content_type",
        "object_id",
    )

    # =============================================================
    # REVERSAL RELATIONSHIP
    # =============================================================

    reversal_of = models.OneToOneField(
        "self",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="reversal",
    )

    # =============================================================
    # AUDIT
    # =============================================================

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="journal_entries",
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="updated_journal_entries",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    objects = JournalEntryManager()

    class Meta:
        ordering = [
            "-date",
            "-sequence",
        ]

    # =============================================================
    # STRING REPRESENTATION
    # =============================================================

    def __str__(self):
        return self.number

    # =============================================================
    # MODEL VALIDATION
    # =============================================================

    def clean(self):
        super().clean()

        # ---------------------------------------------------------
        # PERIOD VALIDATION
        # ---------------------------------------------------------

        if self.period_id and self.date:

            if not (
                self.period.start_date
                <= self.date
                <= self.period.end_date
            ):
                raise ValidationError(
                    "Journal date must fall within "
                    "its accounting period."
                )

        # ---------------------------------------------------------
        # REVERSAL VALIDATION
        # ---------------------------------------------------------

        if self.reversal_of_id:

            if self.reversal_of_id == self.pk:
                raise ValidationError(
                    "A journal entry cannot reverse itself."
                )

            if self.reversal_of.status != EntryStatus.POSTED:
                raise ValidationError(
                    "Only posted journal entries can be reversed."
                )

    # =============================================================
    # SAVE
    # =============================================================

    def save(self, *args, **kwargs):

        # =========================================================
        # EXISTING JOURNAL
        # =========================================================

        if self.pk:

            original = (
                JournalEntry.objects
                .filter(pk=self.pk)
                .values(
                    "status",
                    "date",
                    "journal_type",
                    "description",
                    "period_id",
                    "content_type_id",
                    "object_id",
                    "created_by_id",
                    "reversal_of_id",
                )
                .first()
            )

            if original:

                # -------------------------------------------------
                # POSTED JOURNAL IMMUTABILITY
                # -------------------------------------------------

                if original["status"] == EntryStatus.POSTED:

                    protected_fields = [
                        "date",
                        "journal_type",
                        "description",
                        "period_id",
                        "content_type_id",
                        "object_id",
                        "created_by_id",
                        "status",
                        "reversal_of_id",
                    ]

                    current_values = {
                        "date": self.date,
                        "journal_type": self.journal_type,
                        "description": self.description,
                        "period_id": self.period_id,
                        "content_type_id": self.content_type_id,
                        "object_id": self.object_id,
                        "created_by_id": self.created_by_id,
                        "status": self.status,
                        "reversal_of_id": self.reversal_of_id,
                    }

                    changed_fields = [
                        field
                        for field in protected_fields
                        if current_values[field]
                        != original[field]
                    ]

                    if changed_fields:
                        raise ValidationError(
                            "Posted journal entries are immutable. "
                            "Create a reversal entry instead."
                        )

        # =========================================================
        # POSTED JOURNAL VALIDATION
        # =========================================================

        if self.status == EntryStatus.POSTED:

            # A brand-new journal must not bypass the
            # DRAFT → POSTED lifecycle.
            if not self.pk:
                raise ValidationError(
                    "A journal entry must be created as draft "
                    "before posting."
                )

            lines = self.lines.all()

            if lines.count() < 2:
                raise ValidationError(
                    "A posted journal entry must contain "
                    "at least two lines."
                )

            totals = lines.aggregate(
                debit=Sum("debit"),
                credit=Sum("credit"),
            )

            total_debit = (
                totals["debit"]
                or Decimal("0.00")
            )

            total_credit = (
                totals["credit"]
                or Decimal("0.00")
            )

            if total_debit <= 0 or total_credit <= 0:
                raise ValidationError(
                    "A posted journal entry must contain "
                    "debit and credit amounts."
                )

            if total_debit != total_credit:
                raise ValidationError(
                    "A posted journal entry must be balanced."
                )

        # =========================================================
        # SEQUENCE
        # =========================================================

        if not self.sequence:

            last_entry = (
                JournalEntry.objects
                .order_by("-sequence")
                .first()
            )

            self.sequence = (
                last_entry.sequence + 1
                if last_entry
                else 1
            )

        # =========================================================
        # JOURNAL NUMBER
        # =========================================================

        if not self.number:
            self.number = (
                f"JE-{self.sequence:06d}"
            )

        # =========================================================
        # VALIDATE
        # =========================================================

        self.full_clean()

        super().save(*args, **kwargs)

    # =============================================================
    # DELETE
    # =============================================================

    def delete(self, *args, **kwargs):

        if self.status == EntryStatus.POSTED:
            raise ValidationError(
                "Posted journal entries cannot be deleted."
            )

        return super().delete(*args, **kwargs)


class JournalLine(models.Model):

    # =============================================================
    # RELATIONSHIPS
    # =============================================================

    journal_entry = models.ForeignKey(
        JournalEntry,
        on_delete=models.CASCADE,
        related_name="lines",
    )

    account = models.ForeignKey(
        Account,
        on_delete=models.PROTECT,
        related_name="lines",
    )

    # =============================================================
    # DESCRIPTION
    # =============================================================

    description = models.CharField(
        max_length=255,
        blank=True,
    )

    # =============================================================
    # AUDIT
    # =============================================================

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="created_journal_lines",
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="updated_journal_lines",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    # =============================================================
    # AMOUNTS
    # =============================================================

    debit = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    credit = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    # =============================================================
    # META
    # =============================================================

    class Meta:
        ordering = ["id"]

        constraints = [
            # No negative amounts.
            models.CheckConstraint(
                check=(
                    Q(debit__gte=0)
                    & Q(credit__gte=0)
                ),
                name="journal_line_non_negative",
            ),

            # Exactly one side must contain a value.
            models.CheckConstraint(
                check=(
                    (
                        Q(debit__gt=0)
                        & Q(credit=0)
                    )
                    |
                    (
                        Q(debit=0)
                        & Q(credit__gt=0)
                    )
                ),
                name="journal_line_exactly_one_side",
            ),
        ]

    # =============================================================
    # STRING REPRESENTATION
    # =============================================================

    def __str__(self):
        return (
            f"{self.account.code} - "
            f"{self.account.name}"
        )

    # =============================================================
    # VALIDATION
    # =============================================================

    def clean(self):
        super().clean()

        # ---------------------------------------------------------
        # AMOUNT VALIDATION
        # ---------------------------------------------------------

        if self.debit < 0 or self.credit < 0:
            raise ValidationError(
                "Debit and credit cannot be negative."
            )

        if self.debit > 0 and self.credit > 0:
            raise ValidationError(
                "A line cannot have both debit and credit."
            )

        if self.debit == 0 and self.credit == 0:
            raise ValidationError(
                "Debit or credit must have value."
            )

        # ---------------------------------------------------------
        # ACCOUNT VALIDATION
        # ---------------------------------------------------------

        if not self.account.is_active:
            raise ValidationError(
                "Cannot post to an inactive account."
            )

        if not self.account.is_postable:
            raise ValidationError(
                "Cannot post to a parent account."
            )

    # =============================================================
    # SAVE
    # =============================================================

    def save(self, *args, **kwargs):

        # ---------------------------------------------------------
        # PROTECT POSTED JOURNAL LINES
        # ---------------------------------------------------------

        if self.pk:

            original = (
                JournalLine.objects
                .filter(pk=self.pk)
                .select_related("journal_entry")
                .first()
            )

            if original:

                if (
                    original.journal_entry.status
                    == EntryStatus.POSTED
                ):
                    raise ValidationError(
                        "Journal lines belonging to a posted "
                        "journal entry cannot be modified."
                    )

        self.full_clean()

        super().save(*args, **kwargs)

    # =============================================================
    # DELETE
    # =============================================================

    def delete(self, *args, **kwargs):

        if self.journal_entry.status == EntryStatus.POSTED:
            raise ValidationError(
                "Journal lines belonging to a posted "
                "journal entry cannot be deleted."
            )

        return super().delete(*args, **kwargs)
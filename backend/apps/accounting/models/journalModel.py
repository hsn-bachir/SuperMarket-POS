from decimal import Decimal
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Sum
from apps.accounting.models.accountModel import Account

from apps.common.enums import (
    EntryStatus,
    JournalType,
)


class JournalEntryQuerySet(models.QuerySet):

    def delete(self):
        if self.filter(status=EntryStatus.POSTED).exists():
            raise ValidationError(
                "Posted journal entries cannot be deleted."
            )

        return super().delete()


class JournalEntryManager(models.Manager.from_queryset(JournalEntryQuerySet)):
    pass


class JournalEntry(models.Model):

    sequence = models.PositiveIntegerField(
        db_index=True,
        editable=False,
    )

    number = models.CharField(
        max_length=30,
        unique=True,
        editable=False,
    )

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
        default=EntryStatus.POSTED,
    )

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

    def clean(self):
        super().clean()

        if self.period_id and self.date:
            if not (
                self.period.start_date
                <= self.date
                <= self.period.end_date
            ):
                raise ValidationError(
                    "Journal date must fall within its accounting period."
                )

    period = models.ForeignKey(
        "accounting.AccountingPeriod",
        on_delete=models.PROTECT,
        related_name="journal_entries",
    )

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


    class Meta:
        ordering = [
            "-date",
            "-sequence",
        ]


    def __str__(self):
        return self.number


    def save(self, *args, **kwargs):

        if self.status == EntryStatus.POSTED and self.pk:
            lines = self.lines.all()
            totals = lines.aggregate(
                debit=Sum("debit"),
                credit=Sum("credit"),
            )

            if lines.count() < 2:
                raise ValidationError(
                    "A posted journal entry must contain at least two lines."
                )

            if not totals["debit"] or not totals["credit"]:
                raise ValidationError(
                    "A posted journal entry must contain debit and credit lines."
                )

            if totals["debit"] != totals["credit"]:
                raise ValidationError(
                    "A posted journal entry must be balanced."
                )

        if self.status == EntryStatus.POSTED and not self.pk:
            raise ValidationError(
                "A journal entry must be created as draft before posting."
            )

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


        if not self.number:
            self.number = f"JE-{self.sequence:06d}"


        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.status == EntryStatus.POSTED:
            raise ValidationError(
                "Posted journal entries cannot be deleted."
            )

        return super().delete(*args, **kwargs)


from django.db.models import Q

class JournalLine(models.Model):

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

    description = models.CharField(
        max_length=255,
        blank=True,
    )

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

    class Meta:
        ordering=["id"]

        constraints = [
            models.CheckConstraint(
                check=(
                    Q(debit__gte=0) &
                    Q(credit__gte=0) &
                    (
                        Q(debit__gt=0) |
                        Q(credit__gt=0)
                    )
                ),
                name="valid_debit_credit"
            )
        ]

    def __str__(self):

        return (
            f"{self.account.code} - "
            f"{self.account.name}"
        )


    def clean(self):

        super().clean()


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


        if not self.account.is_postable:
            raise ValidationError(
                "Cannot post to a parent account."
            )


    def save(self,*args,**kwargs):
        self.full_clean()
        super().save(*args,**kwargs)
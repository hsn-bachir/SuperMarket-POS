from django.core.exceptions import ValidationError
from django.db import models

from apps.common.enums import (
    AccountType,
    NormalBalance,
)


class Account(models.Model):

    code = models.CharField(
        max_length=20,
        unique=True,
        db_index=True,
    )

    name = models.CharField(
        max_length=150,
    )

    account_type = models.CharField(
        max_length=20,
        choices=AccountType.choices,
    )

    normal_balance = models.CharField(
        max_length=10,
        choices=NormalBalance.choices,
    )

    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="children",
    )

    level = models.PositiveSmallIntegerField(
        default=0,
        editable=False,
    )

    is_postable = models.BooleanField(
        default=True,
    )

    allow_manual_entries = models.BooleanField(
        default=True,
    )

    description = models.TextField(
        blank=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )


    class Meta:
        ordering = ["code"]
        verbose_name = "Account"
        verbose_name_plural = "Chart of Accounts"


    def __str__(self):
        return f"{self.code} - {self.name}"


    def get_expected_normal_balance(self):

        mapping = {
            AccountType.ASSET: NormalBalance.DEBIT,
            AccountType.EXPENSE: NormalBalance.DEBIT,
            AccountType.LIABILITY: NormalBalance.CREDIT,
            AccountType.EQUITY: NormalBalance.CREDIT,
            AccountType.REVENUE: NormalBalance.CREDIT,
        }

        return mapping[self.account_type]


    def clean(self):

        super().clean()


        # Cannot be own parent
        if self.parent == self:
            raise ValidationError(
                {
                    "parent":
                    "An account cannot be its own parent."
                }
            )


        # Validate normal balance
        expected_balance = self.get_expected_normal_balance()

        if self.normal_balance != expected_balance:
            raise ValidationError(
                {
                    "normal_balance":
                    f"{self.account_type} accounts must have "
                    f"{expected_balance} normal balance."
                }
            )


        # Child accounts must have same type
        if self.parent:

            if self.parent.account_type != self.account_type:
                raise ValidationError(
                    {
                        "account_type":
                        "Child accounts must have the same "
                        "account type as the parent."
                    }
                )


        # Prevent circular hierarchy

        ancestor = self.parent

        while ancestor:

            if ancestor == self:
                raise ValidationError(
                    {
                        "parent":
                        "Circular account hierarchy detected."
                    }
                )

            ancestor = ancestor.parent


        # Accounts with children cannot be postable

        if (
            self.pk
            and self.is_postable
            and self.children.exists()
        ):
            raise ValidationError(
                {
                    "is_postable":
                    "Accounts with children cannot be postable."
                }
            )


    def save(self, *args, **kwargs):

        if self.parent:
            self.level = self.parent.level + 1

        else:
            self.level = 0


        self.full_clean()

        super().save(*args, **kwargs)



from decimal import Decimal
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

from apps.common.enums import (
    EntryStatus,
    JournalType,
)


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
        default=EntryStatus.DRAFT,
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

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="journal_entries",
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


from decimal import Decimal
from django.db.models import Q
from django.core.exceptions import ValidationError
from django.db import models


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
                        Q(debit=0) |
                        Q(credit=0)
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
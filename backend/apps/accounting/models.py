from django.core.exceptions import ValidationError
from django.db import models

from apps.common.enums import (
    AccountType,
    NormalBalance,
    CashFlowCategory,
    EntryStatus,
)

######Account
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

    cash_flow_category = models.CharField(
    max_length=20,
    choices=CashFlowCategory.choices,
    default=CashFlowCategory.NONE,
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


### journals
from decimal import Decimal
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

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

###### expenses
from apps.common.models import TimeStampedModel


class ExpenseCategory(TimeStampedModel):
    name = models.CharField(max_length=100, unique=True)

    account = models.ForeignKey(
        Account,
        on_delete=models.PROTECT,
        related_name="expense_categories",
    )

    description = models.TextField(
        blank=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    class Meta:
        ordering = ["name"]
        verbose_name = "Expense Category"
        verbose_name_plural = "Expense Categories"

    def clean(self):
        super().clean()

        if self.account.account_type != AccountType.EXPENSE:
            raise ValidationError({
                "account": "Expense category must be linked to an Expense account."
            })

        if not self.account.is_postable:
            raise ValidationError({
                "account": "Only postable accounts may be assigned."
            })

    def __str__(self):
        return self.name


from django.core.validators import MinValueValidator
from apps.common.enums import PaymentMethod,ExpenseStatus
from apps.suppliers.models import Supplier


class Expense(TimeStampedModel):
    number = models.CharField(
        max_length=20,
        unique=True,
        editable=False,
    )

    date = models.DateField()

    category = models.ForeignKey(
        ExpenseCategory,
        on_delete=models.PROTECT,
        related_name="expenses",
    )

    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
    )

    description = models.TextField(
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=ExpenseStatus.choices,
        default=ExpenseStatus.DRAFT,
    )

    reference = models.CharField(
        max_length=100,
        blank=True,
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="created_expenses",
    )

    class Meta:
        ordering = ["-date", "-id"]

    def __str__(self):
        return self.number

#### payments
from apps.common.enums import (
    PaymentStatus,
    PaymentType,
)

class Payment(TimeStampedModel):

    number = models.CharField(
        max_length=20,
        unique=True,
        editable=False,
    )

    date = models.DateField()

    payment_type = models.CharField(
        max_length=20,
        choices=PaymentType.choices,
    )

    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[
            MinValueValidator(
                Decimal("0.01")
            )
        ],
    )

    # Business document being paid
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

    external_reference = models.CharField(
        max_length=100,
        blank=True,
        help_text="Cheque number, bank transaction ID, receipt number, etc.",
    )

    description = models.TextField(
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.DRAFT,
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="created_payments",
    )

    class Meta:
        ordering = ["-date", "-id"]

    def __str__(self):
        return self.number

###period


from apps.common.enums import PeriodStatus


class AccountingPeriod(models.Model):
    name = models.CharField(
        max_length=50,
        unique=True,
    )

    start_date = models.DateField()

    end_date = models.DateField()

    status = models.CharField(
        max_length=10,
        choices=PeriodStatus.choices,
        default=PeriodStatus.OPEN,
    )

    closed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    closed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="closed_accounting_periods",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["start_date"]
        verbose_name = "Accounting Period"
        verbose_name_plural = "Accounting Periods"

    def __str__(self):
        return self.name

    def clean(self):
        super().clean()

        if self.start_date >= self.end_date:
            raise ValidationError(
                "End date must be after start date."
            )

        overlap = AccountingPeriod.objects.filter(
            start_date__lte=self.end_date,
            end_date__gte=self.start_date,
        ).exclude(pk=self.pk)

        if overlap.exists():
            raise ValidationError(
                "Accounting periods cannot overlap."
            )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def is_open(self):
        return self.status == PeriodStatus.OPEN


    @property
    def is_closed(self):
        return self.status == PeriodStatus.CLOSED


    @property
    def is_closing(self):
        return self.status == PeriodStatus.CLOSING

    @property
    def fiscal_year(self):
        return self.start_date.year
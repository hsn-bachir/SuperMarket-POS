from apps.common.models import TimeStampedModel
from django.core.exceptions import ValidationError
from django.db import models
from apps.accounting.models.accountModel import Account
from decimal import Decimal
from django.conf import settings

from apps.common.enums import (
    AccountType,
)

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

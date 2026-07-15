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
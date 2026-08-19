from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
from django.conf import settings
from apps.common.models import TimeStampedModel
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


from apps.common.enums import (
    PaymentStatus,
    PaymentType,
    PaymentMethod,
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

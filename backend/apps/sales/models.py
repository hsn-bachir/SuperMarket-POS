from django.db import models
from django.core.exceptions import ValidationError

from apps.common.enums import Currency
from apps.common.enums import PaymentMethod


class Sale(models.Model):
    STATUS_ACTIVE = "ACTIVE"
    STATUS_CANCELLED = "CANCELLED"

    STATUS_CHOICES = (
        (STATUS_ACTIVE, "Active"),
        (STATUS_CANCELLED, "Cancelled"),
    )

    class Meta:
        indexes = [
            models.Index(fields=["sale_date"]),
        ]

    invoice_number = models.CharField(
        max_length=100,
        unique=True,
    )

    currency = models.CharField(
        max_length=3,
        choices=Currency.choices,
    )

    exchange_rate = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=1,
    )

    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
    )

    sale_date = models.DateField()

    total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default=STATUS_ACTIVE,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return self.invoice_number


class SaleItem(models.Model):
    class Meta:
        indexes = [
            models.Index(fields=["product"]),
            models.Index(fields=["service"]),
        ]

    sale = models.ForeignKey(
        Sale,
        on_delete=models.CASCADE,
        related_name="items",
    )

    product = models.ForeignKey(
        "products.Product",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
    )

    service = models.ForeignKey(
        "services.Service",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
    )

    quantity = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    cost_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    def clean(self):
        has_product = self.product is not None
        has_service = self.service is not None

        if has_product == has_service:
            raise ValidationError(
                "Exactly one of product or service must be selected."
            )

    @property
    def subtotal(self):
        return self.quantity * self.unit_price

    @property
    def item_name(self):
        if self.product:
            return self.product.name

        if self.service:
            return self.service.name

        return ""

    @property
    def item_type(self):
        if self.product:
            return "PRODUCT"

        if self.service:
            return "SERVICE"

        return None

    def __str__(self):
        return (
            f"{self.sale.invoice_number} - "
            f"{self.item_name}"
        )
from django.db import models
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
        unique=True
    )

    currency = models.CharField(
        max_length=3,
        choices=Currency.choices
    )

    exchange_rate = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=1
    )

    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices
    )

    sale_date = models.DateField()

    total = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default=STATUS_ACTIVE,
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )


class SaleItem(models.Model):

    class Meta:
        indexes = [
            models.Index(fields=["product"]),
        ]

    sale = models.ForeignKey(
        Sale,
        on_delete=models.CASCADE,
        related_name="items"
    )

    product = models.ForeignKey(
        "products.Product",
        on_delete=models.PROTECT
    )

    quantity = models.PositiveIntegerField()

    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    cost_price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    @property
    def subtotal(self):
        return self.quantity * self.unit_price
    
    def __str__(self):
        return f"{self.sale.invoice_number} - {self.product.name}"
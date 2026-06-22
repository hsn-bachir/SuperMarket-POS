from django.db import models
from apps.common.enums import Currency
from apps.common.enums import PaymentMethod

class Sale(models.Model):

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

    created_at = models.DateTimeField(
        auto_now_add=True
    )


class SaleItem(models.Model):

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
        return self.invoice_number
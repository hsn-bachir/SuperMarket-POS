from django.db import models

from apps.common.enums import Currency
from apps.common.enums import PaymentMethod


class Purchase(models.Model):

    STATUS_ACTIVE = "ACTIVE"
    STATUS_CANCELLED = "CANCELLED"
    STATUS_CHOICES = (
        (STATUS_ACTIVE, "Active"),
        (STATUS_CANCELLED, "Cancelled"),
    )

    supplier = models.ForeignKey(
        "suppliers.Supplier",
        on_delete=models.PROTECT,
        related_name="purchases",
    )

    invoice_number = models.CharField(
        max_length=100,
        unique=True,
    )

    currency = models.CharField(
        max_length=3,
        choices=Currency.choices,
    )

    total_amount = models.DecimalField(
        max_digits=18,
        decimal_places=4,
        default=0
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default=STATUS_ACTIVE,
    )

    exchange_rate = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=1,
    )

    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
        default=PaymentMethod.CASH,
    )

    purchase_date = models.DateField()

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    @property
    def total(self):
        return sum(
            item.subtotal
            for item in self.items.all()
        )

    def __str__(self):
        return self.invoice_number


class PurchaseItem(models.Model):

    purchase = models.ForeignKey(
        Purchase,
        on_delete=models.CASCADE,
        related_name="items",
    )

    product = models.ForeignKey(
        "products.Product",
        on_delete=models.PROTECT,
    )

    quantity = models.PositiveIntegerField()

    cost_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    @property
    def subtotal(self):
        return self.quantity * self.cost_price

    def __str__(self):
        return (
            f"{self.purchase.invoice_number} "
            f"- {self.product.name}"
        )
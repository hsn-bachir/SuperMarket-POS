from django.db import models

from apps.common.enums import Currency


class Purchase(models.Model):

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

    exchange_rate = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=1,
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
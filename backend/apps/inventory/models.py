from django.db import models
from apps.common.enums import MovementType

class InventoryMovement(models.Model):

    product = models.ForeignKey(
        "products.Product",
        on_delete=models.PROTECT,
        related_name="movements"
    )

    movement_type = models.CharField(
        max_length=20,
        choices=MovementType.choices
    )

    quantity = models.IntegerField()

    reason = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    reference_type = models.CharField(
        max_length=50
    )

    reference_id = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )
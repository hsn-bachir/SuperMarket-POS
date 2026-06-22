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

    reference_type = models.CharField(
        max_length=50
    )

    reference_id = models.PositiveIntegerField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )
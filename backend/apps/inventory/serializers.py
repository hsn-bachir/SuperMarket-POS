from rest_framework import serializers
from .models import InventoryMovement


class InventoryMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )

    class Meta:
        model = InventoryMovement

        fields = (
            "id",
            "product",
            "product_name",
            "movement_type",
            "quantity",
            "reference_type",
            "reference_id",
            "created_at",
        )
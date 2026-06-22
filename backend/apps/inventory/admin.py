from django.contrib import admin
from .models import InventoryMovement


@admin.register(InventoryMovement)
class InventoryMovementAdmin(
    admin.ModelAdmin
):
    list_display = (
        "id",
        "product",
        "movement_type",
        "quantity",
        "reference_type",
        "reference_id",
        "created_at",
    )

    list_filter = (
        "movement_type",
    )

    search_fields = (
        "product__name",
        "product__barcode",
    )
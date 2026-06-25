from django.urls import path

from .views import (
    InventoryMovementListView,
    InventoryAdjustmentView
)

urlpatterns = [
    path(
        "",
        InventoryMovementListView.as_view(),
        name="inventory-history",
    ),

    path(
        "adjustment/",
        InventoryAdjustmentView.as_view()
    ),
]
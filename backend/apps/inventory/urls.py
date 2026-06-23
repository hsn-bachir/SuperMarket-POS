from django.urls import path

from .views import (
    InventoryMovementListView,
)

urlpatterns = [
    path(
        "",
        InventoryMovementListView.as_view(),
        name="inventory-history",
    ),
]
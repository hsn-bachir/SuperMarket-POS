from django.urls import path

from .views import (
    PurchaseListView,
    PurchaseCreateView,
    PurchaseDetailView,
    PurchaseUpdateView,
    PurchaseDeleteView,
)

urlpatterns = [
    path(
        "",
        PurchaseListView.as_view(),
        name="purchase-list",
    ),

    path(
        "create/",
        PurchaseCreateView.as_view(),
        name="purchase-create",
    ),

    path(
        "<int:pk>/",
        PurchaseDetailView.as_view(),
        name="purchase-detail",
    ),

    path(
        "<int:pk>/update/",
        PurchaseUpdateView.as_view(),
        name="purchase-update",
    ),

    path(
        "<int:pk>/delete/",
        PurchaseDeleteView.as_view(),
        name="purchase-delete",
    ),
]
from django.urls import path

from .views import (
    ProductListView,
    ProductDetailView,
    LowStockProductsView
)

urlpatterns = [
    path(
        "",
        ProductListView.as_view(),
        name="product-list",
    ),

    path(
        "<int:pk>/",
        ProductDetailView.as_view(),
        name="product-detail",
    ),

    path(
        "low-stock/",
        LowStockProductsView.as_view(),
        name="low-stock-products",
    ),
]
from django.urls import path
from .views import (
    DashboardView,
    DeadStockView,
    SlowMovingView,
    FastMovingView,
    TopProfitProductsView,
    ReorderSuggestionsView
)

urlpatterns = [
    path(
        "dashboard/",
        DashboardView.as_view(),
        name="dashboard",
    ),

    path(
        "dead-stock/",
        DeadStockView.as_view(),
        name="dead-stock",
    ),

    path(
        "slow-moving/",
        SlowMovingView.as_view(),
        name="slow-moving",
    ),

    path(
        "fast-moving/",
        FastMovingView.as_view(),
        name="fast-moving",
    ),

    path(
        "top-profit-products/",
        TopProfitProductsView.as_view(),
        name="top-profit-products",
    ),

    path(
        "reorder-suggestions/",
        ReorderSuggestionsView.as_view(),
        name="reorder-suggestions",
),
]
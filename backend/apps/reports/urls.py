from django.urls import path
from .views import (
    DashboardView,
    DeadStockView,
    SlowMovingView,
    FastMovingView,
    TopProfitProductsView,
    ReorderSuggestionsView,
    InventoryValuationView,
    InventorySummaryView,
    COGSReportView,
    ProfitLossReportView,
    StockAgingView
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

    path(
        "inventory-valuation/",
        InventoryValuationView.as_view(),
        name="inventory-valuation",
    ),

    path(
        "inventory-summary/",
        InventorySummaryView.as_view(),
        name="inventory-summary",
    ),

    path(
        "cogs/",
        COGSReportView.as_view(),
        name="cogs-report",
    ),

    path(
        "profit-loss/",
        ProfitLossReportView.as_view(),
        name="profit-loss-report",
    ),

    path(
        "stock-aging/",
        StockAgingView.as_view(),
        name="stock-aging",
    ),
]
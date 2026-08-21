from .dashboard import DashboardView, DashboardAnalyticsView
from .inventory import (
    DeadStockView,
    SlowMovingView,
    FastMovingView,
    ReorderSuggestionsView,
    InventoryValuationView,
    InventorySummaryView,
    StockAgingView,
)
from .sales import TopProfitProductsView, COGSReportView, ProfitLossReportView

__all__ = [
    "DashboardView",
    "DashboardAnalyticsView",
    "DeadStockView",
    "SlowMovingView",
    "FastMovingView",
    "ReorderSuggestionsView",
    "InventoryValuationView",
    "InventorySummaryView",
    "StockAgingView",
    "TopProfitProductsView",
    "COGSReportView",
    "ProfitLossReportView",
]
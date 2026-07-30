from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.accounting.views import (
    ExpenseCategoryViewSet,
    ExpenseViewSet,
    PaymentViewSet,
    AccountLedgerView,
    TrialBalanceView,
    IncomeStatementView,
    BalanceSheetView,
    CashFlowView,
    AccountingPeriodViewSet,
)

router = DefaultRouter()

router.register(
    "expense-categories",
    ExpenseCategoryViewSet,
)

router.register(
    "expenses",
    ExpenseViewSet,
)

router.register(
    "payments",
    PaymentViewSet,
)

router.register(
    "periods",
    AccountingPeriodViewSet,
    basename="accounting-period",
)

urlpatterns = router.urls + [
    path(
        "ledger/<str:code>/",
        AccountLedgerView.as_view(),
        name="account-ledger",
    ),

    path(
        "trial-balance/",
        TrialBalanceView.as_view(),
    ),

    path(
        "income-statement/",
        IncomeStatementView.as_view(),
        name="income-statement",
    ),

    path(
        "balance-sheet/",
        BalanceSheetView.as_view(),
        name="balance-sheet",
    ),

    path(
        "cash-flow/",
        CashFlowView.as_view(),
        name="cash-flow",
    ),
]
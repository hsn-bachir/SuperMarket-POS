from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.accounting.views import (
    ExpenseCategoryViewSet,
    ExpenseViewSet,
    PaymentViewSet,
    AccountLedgerView,
    TrialBalanceView,
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
]
from rest_framework.routers import DefaultRouter

from apps.accounting.views import (
    ExpenseCategoryViewSet,
    ExpenseViewSet,
    PaymentViewSet,
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

urlpatterns = router.urls
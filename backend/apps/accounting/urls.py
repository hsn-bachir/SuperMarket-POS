from rest_framework.routers import DefaultRouter

from apps.accounting.views import (
    ExpenseCategoryViewSet,
    ExpenseViewSet,
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

urlpatterns = router.urls
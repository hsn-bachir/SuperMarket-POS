from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response

from apps.accounts.permissions import IsAdminOrManager
from apps.accounting.models.expensesModel import (
    Expense,
    ExpenseCategory,
)
from apps.accounting.serializers.expensesSerializer import (
    ExpenseSerializer,
    ExpenseCategorySerializer,
)
from apps.accounting.services.expense_service import ExpenseService


class ExpenseCategoryViewSet(ModelViewSet):
    queryset = ExpenseCategory.objects.all()
    serializer_class = ExpenseCategorySerializer
    permission_classes = [IsAdminOrManager]


class ExpenseViewSet(ModelViewSet):
    queryset = (
        Expense.objects
        .select_related("category", "created_by")
    )
    serializer_class = ExpenseSerializer
    permission_classes = [IsAdminOrManager]

    def destroy(self, request, *args, **kwargs):
        expense = self.get_object()
        ExpenseService.cancel_expense(
            expense,
            user=request.user,
        )
        return Response(status=status.HTTP_204_NO_CONTENT)
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.expenses.models import (
    Expense,
    ExpenseCategory,
)
from apps.expenses.serializers import (
    ExpenseSerializer,
    ExpenseCategorySerializer,
)
from apps.expenses.services.expense_service import ExpenseService


class ExpenseCategoryViewSet(ModelViewSet):

    queryset = ExpenseCategory.objects.all()
    serializer_class = ExpenseCategorySerializer


class ExpenseViewSet(ModelViewSet):

    queryset = (
        Expense.objects
        .select_related(
            "category",
            "supplier",
            "created_by",
        )
    )

    serializer_class = ExpenseSerializer

    def perform_create(self, serializer):

        ExpenseService.create_expense(
            created_by=self.request.user,
            **serializer.validated_data,
        )

    def destroy(self, request, *args, **kwargs):

        expense = self.get_object()

        ExpenseService.cancel_expense(
            expense,
            user=request.user,
        )

        return Response(
            status=status.HTTP_204_NO_CONTENT,
        )
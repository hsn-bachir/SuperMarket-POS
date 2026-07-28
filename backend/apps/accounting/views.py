from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework import status, viewsets
from rest_framework.decorators import action

##expenses
from apps.accounting.models import (
    Expense,
    ExpenseCategory,
)
from apps.accounting.serializers import (
    ExpenseSerializer,
    ExpenseCategorySerializer,
)
from apps.accounting.services.expense_service import ExpenseService


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

##payments
from apps.accounting.models import Payment
from apps.accounting.serializers import PaymentSerializer
from apps.accounting.services.payment_service import PaymentService


class PaymentViewSet(viewsets.ModelViewSet):

    queryset = (
        Payment.objects
        .select_related(
            "created_by",
            "content_type",
        )
        .order_by("-date", "-id")
    )

    serializer_class = PaymentSerializer

    @action(
        detail=True,
        methods=["post"],
    )
    def cancel(self, request, pk=None):

        payment = self.get_object()

        PaymentService.cancel_payment(
            payment,
            user=request.user,
        )

        serializer = self.get_serializer(payment)

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):

        payment = self.get_object()

        PaymentService.delete_payment(payment)

        return Response(
            status=status.HTTP_204_NO_CONTENT,
        )
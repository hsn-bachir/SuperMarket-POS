from rest_framework import serializers

from apps.accounting.models import (
    Expense,
    ExpenseCategory,
)

## expenses
class ExpenseCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = ExpenseCategory
        fields = "__all__"


class ExpenseSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    class Meta:
        model = Expense
        fields = "__all__"
        read_only_fields = (
            "number",
            "status",
            "created_by",
            "created_at",
            "updated_at",
        )

## payments
from apps.accounting.models import Payment
from apps.accounting.services.payment_service import PaymentService

class PaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Payment
        fields = "__all__"
        read_only_fields = (
            "number",
            "status",
            "created_by",
            "created_at",
            "updated_at",
        )

    def create(self, validated_data):

        request = self.context["request"]

        return PaymentService.create_payment(
            created_by=request.user,
            **validated_data,
        )
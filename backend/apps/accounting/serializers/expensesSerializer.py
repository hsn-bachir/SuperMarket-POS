from rest_framework import serializers

from apps.accounting.models.expensesModel import (
    Expense,
    ExpenseCategory,
)
from apps.accounting.services.expense_service import ExpenseService

class ExpenseCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = ExpenseCategory
        fields = "__all__"


class ExpenseSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(
    source="category.name",
    read_only=True,
)

    created_by_name = serializers.CharField(
    source="created_by.username",
    read_only=True,
)

    payment_method_display = serializers.CharField(
    source="get_payment_method_display",
    read_only=True,
)

    status_display = serializers.CharField(
    source="get_status_display",
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

    def create(self, validated_data):
        return ExpenseService.create_expense(
            created_by=self.context["request"].user,
            **validated_data,
        )

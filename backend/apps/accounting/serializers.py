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

from rest_framework import serializers


class LedgerTransactionSerializer(serializers.Serializer):

    date = serializers.DateField()

    journal_number = serializers.CharField()

    journal_type = serializers.CharField()

    description = serializers.CharField()

    reference = serializers.CharField()

    debit = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )

    credit = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )

    running_balance = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )

####ledger
class LedgerSerializer(serializers.Serializer):

    account = serializers.DictField()

    opening_balance = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )

    transactions = LedgerTransactionSerializer(
        many=True
    )

    total_debit = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )

    total_credit = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )

    closing_balance = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )


##trail balance

class TrialBalanceAccountSerializer(serializers.Serializer):

    account_id = serializers.IntegerField()

    code = serializers.CharField()

    name = serializers.CharField()

    normal_balance = serializers.CharField()

    debit = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )

    credit = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )


class TrialBalanceSerializer(serializers.Serializer):

    accounts = TrialBalanceAccountSerializer(
        many=True
    )

    total_debit = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )

    total_credit = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )

    is_balanced = serializers.BooleanField()
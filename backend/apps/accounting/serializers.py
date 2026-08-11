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

## payments
from apps.accounting.models import Payment
from apps.accounting.services.payment_service import PaymentService

class PaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Payment
        fields = [
    "id",
    "number",
    "date",
    "payment_type",
    "payment_method",
    "amount",
    "content_type",
    "object_id",
    "external_reference",
    "description",
    "status",
    "created_at",
    "updated_at",
]
        read_only_fields = [
    "number",
    "status",
    "created_by",
    "created_at",
    "updated_at",
]

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


###Financial Statements
class IncomeStatementRowSerializer(serializers.Serializer):

    account_id = serializers.IntegerField()

    code = serializers.CharField()

    name = serializers.CharField()

    amount = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )

class IncomeStatementSerializer(serializers.Serializer):

    revenue = IncomeStatementRowSerializer(
        many=True,
    )

    total_revenue = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )

    expenses = IncomeStatementRowSerializer(
        many=True,
    )

    total_expenses = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )

    net_profit = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )


class BalanceSheetRowSerializer(serializers.Serializer):

    account_id = serializers.IntegerField()

    code = serializers.CharField()

    name = serializers.CharField()

    amount = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )


class BalanceSheetSerializer(serializers.Serializer):

    assets = BalanceSheetRowSerializer(
        many=True
    )

    total_assets = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )


    liabilities = BalanceSheetRowSerializer(
        many=True
    )

    total_liabilities = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )


    equity = BalanceSheetRowSerializer(
        many=True
    )

    total_equity = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )


    balance_check = serializers.BooleanField()


class CashFlowRowSerializer(serializers.Serializer):

    account_id = serializers.IntegerField()

    code = serializers.CharField()

    name = serializers.CharField()

    amount = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )


class CashFlowSerializer(serializers.Serializer):

    operating = CashFlowRowSerializer(
        many=True
    )

    investing = CashFlowRowSerializer(
        many=True
    )

    financing = CashFlowRowSerializer(
        many=True
    )


    net_operating = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )


    net_investing = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )


    net_financing = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )


    net_cash_change = serializers.DecimalField(
        max_digits=18,
        decimal_places=2,
    )

##period
from apps.accounting.models import AccountingPeriod

class AccountingPeriodSerializer(
    serializers.ModelSerializer
):

    fiscal_year = serializers.ReadOnlyField()

    class Meta:
        model = AccountingPeriod

        fields = [
            "id",
            "name",
            "start_date",
            "end_date",
            "fiscal_year",
            "status",
            "closed_at",
            "closed_by",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "fiscal_year",
            "status",
            "closed_at",
            "closed_by",
            "created_at",
            "updated_at",
        ]
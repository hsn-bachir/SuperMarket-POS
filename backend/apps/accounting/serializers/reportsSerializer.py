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

from rest_framework import serializers


class DeadStockSerializer(serializers.Serializer):

    id = serializers.IntegerField()

    name = serializers.CharField()

    minimum_stock = serializers.IntegerField()

    current_stock = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    last_sale_date = serializers.DateField(
        allow_null=True
    )

    days_since_sale = serializers.IntegerField(
        allow_null=True
    )

class SlowMovingSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()

    product_name = serializers.CharField()

    quantity_sold = serializers.IntegerField()

    current_stock = serializers.DecimalField(
        max_digits=12,
        decimal_places=2
    )

class TopProfitProductSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()

    product_name = serializers.CharField()

    total_profit = serializers.DecimalField(
        max_digits=15,
        decimal_places=2
    )


class InventoryValuationSerializer(serializers.Serializer):

    product_id = serializers.IntegerField()
    barcode = serializers.CharField()
    category = serializers.CharField()
    product_name = serializers.CharField()
    stock = serializers.IntegerField()

    cost_price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    inventory_value = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
    )

class InventorySummarySerializer(serializers.Serializer):
    total_products = serializers.IntegerField()

    total_units = serializers.IntegerField()

    inventory_value = serializers.DecimalField(
        max_digits=14,
        decimal_places=2
    )

class COGSReportSerializer(serializers.Serializer):
    revenue = serializers.DecimalField(
        max_digits=14,
        decimal_places=2
    )

    cogs = serializers.DecimalField(
        max_digits=14,
        decimal_places=2
    )

    gross_profit = serializers.DecimalField(
        max_digits=14,
        decimal_places=2
    )

    gross_margin = serializers.DecimalField(
        max_digits=8,
        decimal_places=2
    )

class ProfitLossSerializer(serializers.Serializer):
    revenue = serializers.DecimalField(
        max_digits=14,
        decimal_places=2
    )

    cogs = serializers.DecimalField(
        max_digits=14,
        decimal_places=2
    )

    gross_profit = serializers.DecimalField(
        max_digits=14,
        decimal_places=2
    )

    operating_expenses = serializers.DecimalField(
        max_digits=14,
        decimal_places=2
    )

    net_profit = serializers.DecimalField(
        max_digits=14,
        decimal_places=2
    )

    gross_margin = serializers.DecimalField(
        max_digits=8,
        decimal_places=2
    )

    net_margin = serializers.DecimalField(
        max_digits=8,
        decimal_places=2
    )

class StockAgingSerializer(serializers.Serializer):

    product_id = serializers.IntegerField()

    product_name = serializers.CharField()

    minimum_stock = serializers.IntegerField()

    stock = serializers.IntegerField()

    inventory_value = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
    )

    last_sale_date = serializers.DateField(
        allow_null=True,
    )

    days_since_last_sale = serializers.IntegerField(
        allow_null=True,
    )


class ReorderSuggestionSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()

    product_name = serializers.CharField()

    current_stock = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    minimum_stock = serializers.IntegerField()

    recommended_order = serializers.IntegerField()
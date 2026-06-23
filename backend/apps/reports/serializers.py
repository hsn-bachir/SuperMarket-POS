from rest_framework import serializers


class DeadStockSerializer(serializers.Serializer):
    id = serializers.IntegerField()

    name = serializers.CharField()

    current_stock = serializers.DecimalField(
        max_digits=12,
        decimal_places=2
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
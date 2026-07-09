from rest_framework import serializers

from .services import create_sale

from .models import Sale
from .models import SaleItem
from apps.products.models import Product


class SaleItemInputSerializer(serializers.Serializer):
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all()
    )

    quantity = serializers.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    unit_price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2
    )


class SaleCreateSerializer(serializers.Serializer):
    invoice_number = serializers.CharField(
        required=False
    )
    currency = serializers.CharField()
    exchange_rate = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=1
    )
    payment_method = serializers.CharField()
    sale_date = serializers.DateField()
    items = SaleItemInputSerializer(
        many=True
    )

    def create(self, validated_data):
        return create_sale(
            **validated_data,
            user=self.context["request"].user,
        )


class SaleItemSerializer(
    serializers.ModelSerializer
):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )

    class Meta:
        model = SaleItem

        fields = (
            "id",
            "product",
            "product_name",
            "quantity",
            "unit_price",
            "cost_price",
            "subtotal",
        )


class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(
        many=True,
        read_only=True
    )
    class Meta:
        model = Sale
        fields = "__all__"

class SaleUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = (
            "payment_method",
            "sale_date",
        )
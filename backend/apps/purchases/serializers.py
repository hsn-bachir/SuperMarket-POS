from rest_framework import serializers

from apps.suppliers.models import Supplier
from apps.products.models import Product

from .services import create_purchase


class PurchaseItemInputSerializer(serializers.Serializer):
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all()
    )
    quantity = serializers.DecimalField(
        max_digits=12,
        decimal_places=2
    )
    cost_price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2
    )


class PurchaseCreateSerializer(serializers.Serializer):
    supplier = serializers.PrimaryKeyRelatedField(
        queryset=Supplier.objects.all()
    )

    invoice_number = serializers.CharField(
        max_length=100
    )

    currency = serializers.CharField()

    exchange_rate = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        required=False,
        default=1
    )

    purchase_date = serializers.DateField()

    items = PurchaseItemInputSerializer(
        many=True
    )

    def create(self, validated_data):
        return create_purchase(
            user=self.context["request"].user,
            **validated_data
        )

from .models import Purchase, PurchaseItem


class PurchaseItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )

    class Meta:
        model = PurchaseItem
        fields = (
            "id",
            "product",
            "product_name",
            "quantity",
            "cost_price",
            "subtotal",
        )


class PurchaseSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(
        source="supplier.name",
        read_only=True
    )

    items = PurchaseItemSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Purchase
        fields = "__all__"
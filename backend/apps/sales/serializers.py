from rest_framework import serializers

from .models import Sale
from .models import SaleItem
from .services import create_sale

from apps.products.models import Product
from apps.services.models import Service


class SaleItemInputSerializer(serializers.Serializer):
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        required=False,
        allow_null=True,
    )

    service = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        required=False,
        allow_null=True,
    )

    quantity = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    unit_price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    def validate(self, attrs):
        product = attrs.get("product")
        service = attrs.get("service")

        if bool(product) == bool(service):
            raise serializers.ValidationError(
                "Exactly one of product or service must be provided."
            )

        return attrs


class SaleCreateSerializer(serializers.Serializer):
    invoice_number = serializers.CharField(
        required=False,
    )

    currency = serializers.CharField()

    exchange_rate = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=1,
    )

    payment_method = serializers.CharField()

    sale_date = serializers.DateField()

    items = SaleItemInputSerializer(
        many=True,
    )

    def create(self, validated_data):
        return create_sale(
            **validated_data,
            user=self.context["request"].user,
        )


class SaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True,
    )

    service_name = serializers.CharField(
        source="service.name",
        read_only=True,
    )

    item_name = serializers.ReadOnlyField()

    item_type = serializers.ReadOnlyField()

    class Meta:
        model = SaleItem
        fields = (
            "id",
            "item_type",
            "item_name",
            "product",
            "product_name",
            "service",
            "service_name",
            "quantity",
            "unit_price",
            "cost_price",
            "subtotal",
        )


class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(
        many=True,
        read_only=True,
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


class InvoiceSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Sale
        fields = (
            "invoice_number",
            "sale_date",
            "payment_method",
            "currency",
            "exchange_rate",
            "total",
            "items",
        )


class ServiceSaleHistorySerializer(serializers.ModelSerializer):
    invoice_number = serializers.CharField(
        source="sale.invoice_number",
        read_only=True,
    )

    sale_date = serializers.DateField(
        source="sale.sale_date",
        read_only=True,
    )

    service_name = serializers.CharField(
        source="service.name",
        read_only=True,
    )

    total = serializers.SerializerMethodField()

    class Meta:
        model = SaleItem

        fields = [
            "id",
            "invoice_number",
            "sale_date",
            "service_name",
            "quantity",
            "unit_price",
            "total",
        ]

    def get_total(self, obj):
        return obj.quantity * obj.unit_price
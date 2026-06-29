from rest_framework import serializers

from .models import Product,Category
from apps.inventory.services import get_stock


class ProductSerializer(serializers.ModelSerializer):
    current_stock = serializers.SerializerMethodField()
    class Meta:
        model = Product

        fields = (
            "id",
            "barcode",
            "name",
            "category",
            "cost_price",
            "selling_price",
            "minimum_stock",
            "is_active",
            "current_stock",
            "created_at",
            "updated_at",
        )

    def get_current_stock(self, obj):
        return get_stock(obj)
    

class LowStockProductSerializer(serializers.ModelSerializer):
    current_stock = serializers.SerializerMethodField()
    class Meta:
        model = Product

        fields = (
            "id",
            "barcode",
            "name",
            "minimum_stock",
            "current_stock",
        )

    def get_current_stock(self, obj):
        return get_stock(obj)
    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

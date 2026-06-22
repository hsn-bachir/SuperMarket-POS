from django.contrib import admin
from .models import Category
from .models import Product
from apps.inventory.services import get_stock


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
    )


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "barcode",
        "name",
        "category",
        "selling_price",
        "current_stock",
        "is_active",
    )
    def current_stock(self, obj):
        return get_stock(obj)
    current_stock.short_description = "Stock"
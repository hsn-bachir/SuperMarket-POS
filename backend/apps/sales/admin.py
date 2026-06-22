from django.contrib import admin
from .models import Sale
from .models import SaleItem


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "invoice_number",
        "payment_method",
        "total",
        "sale_date",
    )

@admin.register(SaleItem)
class SaleItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "sale",
        "product",
        "quantity",
        "unit_price",
        "cost_price",
        "subtotal",
    )
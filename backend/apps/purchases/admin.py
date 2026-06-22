from django.contrib import admin
from .models import Purchase
from .models import PurchaseItem


@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "invoice_number",
        "supplier",
        "currency",
        "purchase_date",
    )

@admin.register(PurchaseItem)
class PurchaseItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "purchase",
        "product",
        "quantity",
        "cost_price",
        "subtotal",
    )
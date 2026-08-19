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

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.status == Purchase.STATUS_ACTIVE:
            return (
                "supplier",
                "invoice_number",
                "currency",
                "total_amount",
                "exchange_rate",
                "payment_method",
                "purchase_date",
                "status",
            )
        return super().get_readonly_fields(request, obj)

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

    def has_change_permission(self, request, obj=None):
        if obj and obj.purchase.status == Purchase.STATUS_ACTIVE:
            return False
        return super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        if obj and obj.purchase.status == Purchase.STATUS_ACTIVE:
            return False
        return super().has_delete_permission(request, obj)

    def has_add_permission(self, request):
        return False
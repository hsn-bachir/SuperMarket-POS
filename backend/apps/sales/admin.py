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

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.status == Sale.STATUS_ACTIVE:
            return (
                "invoice_number",
                "payment_method",
                "total",
                "currency",
                "exchange_rate",
                "sale_date",
                "status",
            )
        return super().get_readonly_fields(request, obj)

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

    def has_change_permission(self, request, obj=None):
        if obj and obj.sale.status == Sale.STATUS_ACTIVE:
            return False
        return super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        if obj and obj.sale.status == Sale.STATUS_ACTIVE:
            return False
        return super().has_delete_permission(request, obj)

    def has_add_permission(self, request):
        return False
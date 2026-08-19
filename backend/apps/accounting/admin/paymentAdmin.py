from django.contrib import admin
from backend.apps.accounting.models.paymentModel import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):

    list_display = (
        "number",
        "date",
        "payment_type",
        "payment_method",
        "amount",
        "status",
        "created_by",
    )

    list_filter = (
        "payment_type",
        "payment_method",
        "status",
        "date",
    )

    search_fields = (
        "number",
        "description",
        "external_reference",
    )

    ordering = (
        "-date",
        "-id",
    )

    readonly_fields = (
        "number",
        "status",
        "created_at",
        "updated_at",
    )

    autocomplete_fields = (
        "created_by",
    )

    fieldsets = (
        (
            "Payment Information",
            {
                "fields": (
                    "number",
                    "date",
                    "payment_type",
                    "payment_method",
                    "amount",
                    "status",
                ),
            },
        ),
        (
            "Reference",
            {
                "fields": (
                    "content_type",
                    "object_id",
                    "external_reference",
                    "description",
                ),
            },
        ),
        (
            "Audit",
            {
                "fields": (
                    "created_by",
                    "created_at",
                    "updated_at",
                ),
            },
        ),
    )

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.status == "POSTED":
            return (
                "number",
                "date",
                "payment_type",
                "payment_method",
                "amount",
                "content_type",
                "object_id",
                "external_reference",
                "description",
                "status",
                "created_by",
                "created_at",
                "updated_at",
            )
        return super().get_readonly_fields(request, obj)

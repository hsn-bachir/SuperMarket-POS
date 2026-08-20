from django.contrib import admin

from .models import Service, ServicePriceHistory


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "is_active",
        "created_at",
        "updated_at",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "name",
        "description",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    ordering = (
        "name",
    )


@admin.register(ServicePriceHistory)
class ServicePriceHistoryAdmin(admin.ModelAdmin):
    list_display = (
        "service",
        "price",
        "effective_from",
    )

    list_filter = (
        "service",
        "effective_from",
    )

    search_fields = (
        "service__name",
    )

    readonly_fields = (
        "effective_from",
    )

    ordering = (
        "-effective_from",
    )
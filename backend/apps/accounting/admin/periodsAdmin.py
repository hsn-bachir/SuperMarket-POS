from django.contrib import admin
from apps.accounting.models.periodsModel import AccountingPeriod

@admin.register(AccountingPeriod)
class AccountingPeriodAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "start_date",
        "end_date",
        "status",
        "fiscal_year",
    )

    list_filter = (
        "status",
    )

    search_fields = (
        "name",
    )

    ordering = (
        "-start_date",
    )
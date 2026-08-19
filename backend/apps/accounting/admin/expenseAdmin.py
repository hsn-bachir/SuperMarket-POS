from django.contrib import admin
from apps.accounting.models.expensesModel import Expense, ExpenseCategory

@admin.register(ExpenseCategory)
class ExpenseCategoryAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "account",
        "is_active",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "name",
        "account__code",
        "account__name",
    )


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):

    list_display = (
        "number",
        "date",
        "category",
        "amount",
        "payment_method",
        "status",
    )

    list_filter = (
        "status",
        "payment_method",
        "category",
    )

    search_fields = (
        "number",
        "reference",
        "description",
    )

    readonly_fields = (
        "number",
        "status",
        "created_at",
        "updated_at",
    )

    date_hierarchy = "date"

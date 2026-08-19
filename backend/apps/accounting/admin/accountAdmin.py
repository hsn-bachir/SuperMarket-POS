from django.contrib import admin
from apps.accounting.models.accountModel import Account

@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):

    list_display = (
        "code",
        "account_name",
        "account_type",
        "normal_balance",
        "level",
        "is_postable",
        "is_active",
    )

    list_filter = (
        "account_type",
        "normal_balance",
        "is_postable",
        "is_active",
    )

    search_fields = (
        "code",
        "name",
    )

    ordering = (
        "code",
    )

    readonly_fields = (
        "level",
        "created_at",
        "updated_at",
    )

    fieldsets = (

        (
            "Account Information",
            {
                "fields": (
                    "code",
                    "name",
                    "description",
                )
            }
        ),

        (
            "Accounting Classification",
            {
                "fields": (
                    "account_type",
                    "normal_balance",
                )
            }
        ),

        (
            "Hierarchy",
            {
                "fields": (
                    "parent",
                    "level",
                )
            }
        ),

        (
            "Posting Rules",
            {
                "fields": (
                    "is_postable",
                    "allow_manual_entries",
                )
            }
        ),

        (
            "Status",
            {
                "fields": (
                    "is_active",
                )
            }
        ),

        (
            "System",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            }
        ),

    )


    def account_name(self, obj):

        prefix = "— " * obj.level

        return f"{prefix}{obj.name}"


    account_name.short_description = "Account"
from django.contrib import admin

from .models import (
    Account,
    JournalEntry,
    JournalLine,
)


# =========================
# Account Admin
# =========================

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



# =========================
# Journal Admin
# =========================

from decimal import Decimal

from django.contrib import admin
from django.core.exceptions import ValidationError


class JournalLineInline(admin.TabularInline):

    model = JournalLine

    extra = 2

    fields = (
        "account",
        "description",
        "debit",
        "credit",
    )



@admin.register(JournalEntry)
class JournalEntryAdmin(admin.ModelAdmin):

    inlines = [
        JournalLineInline,
    ]


    readonly_fields = (
        "number",
        "sequence",
        "created_at",
        "updated_at",
    )


    def save_model(
        self,
        request,
        obj,
        form,
        change,
    ):

        if not obj.created_by_id:
            obj.created_by = request.user

        super().save_model(
            request,
            obj,
            form,
            change,
        )


    def save_formset(
        self,
        request,
        form,
        formset,
        change,
    ):

        instances = formset.save(commit=False)


        debit = Decimal("0.00")
        credit = Decimal("0.00")


        for obj in instances:

            debit += obj.debit
            credit += obj.credit


        if debit != credit:

            raise ValidationError(
                f"""
                Journal is not balanced.

                Debit: {debit}

                Credit: {credit}
                """
            )


        for obj in instances:
            obj.save()


        for obj in formset.deleted_objects:
            obj.delete()


        formset.save_m2m()
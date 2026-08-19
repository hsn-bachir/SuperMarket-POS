from decimal import Decimal
from django.contrib import admin
from django.core.exceptions import ValidationError
from apps.accounting.models.journalModel import JournalEntry, JournalLine
from apps.accounting.services.accounting_period_service import AccountingPeriodService


class JournalLineInline(admin.TabularInline):

    model = JournalLine

    extra = 2

    fields = (
        "account",
        "description",
        "debit",
        "credit",
    )

    def has_change_permission(self, request, obj=None):
        if obj and obj.status == "POSTED":
            return False
        return super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        if obj and obj.status == "POSTED":
            return False
        return super().has_delete_permission(request, obj)



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

    def has_change_permission(self, request, obj=None):
        if obj and obj.status == "POSTED":
            return False
        return super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        if obj and obj.status == "POSTED":
            return False
        return super().has_delete_permission(request, obj)


    def save_model(
        self,
        request,
        obj,
        form,
        change,
    ):

        if not obj.created_by_id:
            obj.created_by = request.user

        if obj.period_id and obj.date:
            AccountingPeriodService.validate_transaction_date(obj.date)
            if not (
                obj.period.start_date
                <= obj.date
                <= obj.period.end_date
            ):
                raise ValidationError(
                    "Journal date must fall within its accounting period."
                )

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

        if not instances:
            raise ValidationError(
                "A journal entry must contain journal lines."
            )


        debit = Decimal("0.00")
        credit = Decimal("0.00")


        for obj in instances:


            if not obj.account.is_active:
                raise ValidationError(
                    f"Account '{obj.account.code}' is inactive."
                )

            if not obj.account.is_postable:
                raise ValidationError(
                    f"Account '{obj.account.code}' is not postable."
                )

            if not obj.account.allow_manual_entries:
                raise ValidationError(
                    f"Account '{obj.account.code}' does not allow manual entries."
                )

            if obj.debit == 0 and obj.credit == 0:
                raise ValidationError(
                    f"Account '{obj.account.code}' must have a debit or credit amount."
                )

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

        if len(instances) < 2:
            raise ValidationError(
                "A journal entry must contain at least two lines."
            )


        for obj in instances:
            obj.save()


        for obj in formset.deleted_objects:
            obj.delete()


        formset.save_m2m()

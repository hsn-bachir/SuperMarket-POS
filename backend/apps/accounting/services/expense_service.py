from django.core.exceptions import ValidationError
from django.db import transaction

from apps.accounting.services.posting_service import AccountingPostingService
from apps.accounting.models import Expense, ExpenseStatus


class ExpenseService:

    @staticmethod
    def generate_number():

        last_expense = (
            Expense.objects
            .order_by("-id")
            .first()
        )

        if not last_expense:
            return "EXP-000001"

        last_number = int(
            last_expense.number.split("-")[1]
        )

        return f"EXP-{last_number + 1:06d}"


    @staticmethod
    @transaction.atomic
    def create_expense(
        *,
        date,
        category,
        amount,
        payment_method,
        created_by,
        supplier=None,
        reference="",
        description="",
    ):

        if not created_by or not getattr(created_by, "has_perm", lambda *args, **kwargs: False)("accounting.add_expense"):
            raise ValidationError("User does not have permission to create expenses.")

        if amount <= 0:
            raise ValidationError(
                {
                    "amount": (
                        "Expense amount must be greater than zero."
                    )
                }
            )

        if not category.is_active:
            raise ValidationError(
                {
                    "category": (
                        "Expense category is inactive."
                    )
                }
            )

        if Expense.objects.filter(reference=reference, status=ExpenseStatus.POSTED).exists():
            raise ValidationError("An expense posting already exists for this reference.")

        expense = Expense.objects.create(
            number=ExpenseService.generate_number(),
            date=date,
            category=category,
            supplier=supplier,
            payment_method=payment_method,
            amount=amount,
            reference=reference,
            description=description,
            status=ExpenseStatus.DRAFT,
            created_by=created_by,
        )

        AccountingPostingService.post_expense(
            expense,
            created_by,
        )

        expense.status = ExpenseStatus.POSTED
        expense.save(
            update_fields=[
                "status",
            ]
        )

        return expense


    @staticmethod
    @transaction.atomic
    def cancel_expense(
        expense,
        *,
        user,
    ):

        if expense.status == ExpenseStatus.CANCELLED:
            raise ValidationError(
                {
                    "status": (
                        "Expense is already cancelled."
                    )
                }
            )

        AccountingPostingService.reverse_expense(
            expense,
            user,
        )

        expense.status = ExpenseStatus.CANCELLED

        expense.save(
            update_fields=[
                "status",
            ]
        )

        return expense


    @staticmethod
    @transaction.atomic
    def delete_expense(expense):

        if expense.status != ExpenseStatus.DRAFT:
            raise ValidationError(
                {
                    "status": (
                        "Only draft expenses can be deleted."
                    )
                }
            )

        expense.delete()
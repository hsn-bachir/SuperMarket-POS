from apps.accounting.services.journal_service import JournalService
from apps.common.enums import JournalType, PaymentMethod
from .base import BasePostingService, money


class ExpensePostingService(BasePostingService):

    @classmethod
    def _resolve_payment_account(cls, expense, accounts):
        if expense.payment_method == PaymentMethod.CASH:
            return accounts["cash"]
        if expense.payment_method in (PaymentMethod.CARD, PaymentMethod.TRANSFER):
            return accounts["bank"]
        return accounts["payable"]

    @classmethod
    def post(cls, expense, user):
        accounts = cls.get_accounts()
        payment_account = cls._resolve_payment_account(expense, accounts)
        amount = money(expense.amount)

        return JournalService.create_entry(
            date=expense.date,
            journal_type=JournalType.EXPENSE,
            description=f"Expense #{expense.number}",
            reference=expense,
            created_by=user,
            lines=[
                {"account": expense.category.account, "debit": amount},
                {"account": payment_account, "credit": amount},
            ],
        )

    @classmethod
    def reverse(cls, expense, user):
        accounts = cls.get_accounts()
        payment_account = cls._resolve_payment_account(expense, accounts)
        amount = money(expense.amount)

        return JournalService.create_entry(
            date=expense.date,
            journal_type=JournalType.EXPENSE,
            description=f"Reverse Expense #{expense.number}",
            reference=expense,
            created_by=user,
            lines=[
                {"account": payment_account, "debit": amount},
                {"account": expense.category.account, "credit": amount},
            ],
        )
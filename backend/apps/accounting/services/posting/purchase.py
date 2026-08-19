from apps.accounting.services.journal_service import JournalService
from apps.common.enums import JournalType
from .base import BasePostingService, money


class PurchasePostingService(BasePostingService):

    @classmethod
    def calculate_total(cls, purchase):
        return money(
            sum(
                item.quantity * item.cost_price
                for item in purchase.items.all()
            )
        )

    @classmethod
    def post(cls, purchase, user):
        accounts = cls.get_accounts()
        total = cls.calculate_total(purchase)

        return JournalService.create_entry(
            date=purchase.purchase_date,
            journal_type=JournalType.PURCHASE,
            description=f"Purchase #{purchase.invoice_number}",
            reference=purchase,
            created_by=user,
            lines=[
                {"account": accounts["inventory"], "debit": total},
                {"account": accounts["payable"], "credit": total},
            ],
        )

    @classmethod
    def reverse(cls, purchase, user):
        accounts = cls.get_accounts()
        total = cls.calculate_total(purchase)

        return JournalService.create_entry(
            date=purchase.purchase_date,
            journal_type=JournalType.PURCHASE,
            description=f"Reverse Purchase #{purchase.invoice_number}",
            reference=purchase,
            created_by=user,
            lines=[
                {"account": accounts["payable"], "debit": total},
                {"account": accounts["inventory"], "credit": total},
            ],
        )
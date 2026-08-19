from apps.accounting.services.journal_service import JournalService
from apps.common.enums import JournalType
from .base import BasePostingService, money


class SalePostingService(BasePostingService):

    @classmethod
    def calculate_cogs(cls, sale):
        return money(
            sum(
                item.quantity * item.cost_price
                for item in sale.items.all()
            )
        )

    @classmethod
    def post(cls, sale, user):
        accounts = cls.get_accounts()
        revenue = money(sale.total)
        cogs = cls.calculate_cogs(sale)
        payment_account = accounts["receivable"]

        lines = [
            {"account": payment_account, "debit": revenue},
            {"account": accounts["sales"], "credit": revenue},
        ]

        if cogs > 0:
            lines.extend([
                {"account": accounts["cogs"], "debit": cogs},
                {"account": accounts["inventory"], "credit": cogs},
            ])

        return JournalService.create_entry(
            date=sale.sale_date,
            journal_type=JournalType.SALES,
            description=f"Sale #{sale.id}",
            reference=sale,
            created_by=user,
            lines=lines,
        )

    @classmethod
    def reverse(cls, sale, user):
        accounts = cls.get_accounts()
        revenue = money(sale.total)
        cogs = cls.calculate_cogs(sale)
        payment_account = accounts["receivable"]

        lines = [
            {"account": accounts["sales"], "debit": revenue},
            {"account": payment_account, "credit": revenue},
        ]

        if cogs > 0:
            lines.extend([
                {"account": accounts["inventory"], "debit": cogs},
                {"account": accounts["cogs"], "credit": cogs},
            ])

        return JournalService.create_entry(
            date=sale.sale_date,
            journal_type=JournalType.SALES,
            description=f"Reverse Sale #{sale.id}",
            reference=sale,
            created_by=user,
            lines=lines,
        )
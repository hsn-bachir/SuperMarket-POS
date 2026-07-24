from decimal import Decimal, ROUND_HALF_UP

from apps.accounting.models import Account
from apps.accounting.services.journal_service import JournalService
from apps.common.enums import JournalType


def money(value):
    return Decimal(value).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP
    )


class AccountingPostingService:

    @staticmethod
    def get_accounts():
        return {
            "cash": Account.objects.get(code="1110"),
            "sales": Account.objects.get(code="4100"),
            "inventory": Account.objects.get(code="1141"),
            "cogs": Account.objects.get(code="5100"),
            "payable": Account.objects.get(code="2110"),
        }

    @staticmethod
    def calculate_sale_cogs(sale):
        return money(
            sum(
                item.quantity * item.cost_price
                for item in sale.items.all()
            )
        )

    @staticmethod
    def calculate_purchase_total(purchase):
        return money(
            sum(
                item.quantity * item.cost_price
                for item in purchase.items.all()
            )
        )

    @staticmethod
    def post_sale(sale, user):

        accounts = AccountingPostingService.get_accounts()

        revenue = money(sale.total)
        cogs = AccountingPostingService.calculate_sale_cogs(sale)

        lines = [
            {
                "account": accounts["cash"],
                "debit": revenue,
            },
            {
                "account": accounts["sales"],
                "credit": revenue,
            },
        ]

        # Inventory decrease + COGS recognition
        if cogs > 0:
            lines.extend([
                {
                    "account": accounts["cogs"],
                    "debit": cogs,
                },
                {
                    "account": accounts["inventory"],
                    "credit": cogs,
                },
            ])

        return JournalService.create_entry(
            date=sale.sale_date,
            journal_type=JournalType.SALES,
            description=f"Sale #{sale.id}",
            reference=sale,
            created_by=user,
            lines=lines,
        )


    @staticmethod
    def reverse_sale(sale, user):

        accounts = AccountingPostingService.get_accounts()

        revenue = money(sale.total)
        cogs = AccountingPostingService.calculate_sale_cogs(sale)

        lines = [
            {
                "account": accounts["sales"],
                "debit": revenue,
            },
            {
                "account": accounts["cash"],
                "credit": revenue,
            },
        ]

        # Restore inventory
        if cogs > 0:
            lines.extend([
                {
                    "account": accounts["inventory"],
                    "debit": cogs,
                },
                {
                    "account": accounts["cogs"],
                    "credit": cogs,
                },
            ])

        return JournalService.create_entry(
            date=sale.sale_date,
            journal_type=JournalType.SALES,
            description=f"Reverse Sale #{sale.id}",
            reference=sale,
            created_by=user,
            lines=lines,
        )


    @staticmethod
    def post_purchase(purchase, user):

        accounts = AccountingPostingService.get_accounts()

        total = AccountingPostingService.calculate_purchase_total(
            purchase
        )

        return JournalService.create_entry(
            date=purchase.purchase_date,
            journal_type=JournalType.PURCHASE,
            description=f"Purchase #{purchase.invoice_number}",
            reference=purchase,
            created_by=user,
            lines=[
                {
                    "account": accounts["inventory"],
                    "debit": total,
                },
                {
                    "account": accounts["payable"],
                    "credit": total,
                },
            ],
        )


    @staticmethod
    def reverse_purchase(purchase, user):

        accounts = AccountingPostingService.get_accounts()

        total = AccountingPostingService.calculate_purchase_total(
            purchase
        )

        return JournalService.create_entry(
            date=purchase.purchase_date,
            journal_type=JournalType.PURCHASE,
            description=f"Reverse Purchase #{purchase.invoice_number}",
            reference=purchase,
            created_by=user,
            lines=[
                {
                    "account": accounts["payable"],
                    "debit": total,
                },
                {
                    "account": accounts["inventory"],
                    "credit": total,
                },
            ],
        )
from apps.accounting.services.journal_service import JournalService
from apps.common.enums import JournalType

from .base import BasePostingService, money


class SalePostingService(BasePostingService):

    @classmethod
    def calculate_product_revenue(cls, sale):
        return money(
            sum(
                item.quantity * item.unit_price
                for item in sale.items.all()
                if item.product_id is not None
            )
        )

    @classmethod
    def calculate_service_revenue(cls, sale):
        return money(
            sum(
                item.quantity * item.unit_price
                for item in sale.items.all()
                if item.service_id is not None
            )
        )

    @classmethod
    def calculate_cogs(cls, sale):
        return money(
            sum(
                item.quantity * item.cost_price
                for item in sale.items.all()
                if item.product_id is not None
            )
        )

    @classmethod
    def post(cls, sale, user):
        accounts = cls.get_accounts()

        product_revenue = cls.calculate_product_revenue(sale)
        service_revenue = cls.calculate_service_revenue(sale)
        cogs = cls.calculate_cogs(sale)

        revenue = money(
            product_revenue + service_revenue
        )

        if revenue != money(sale.total):
            raise ValueError(
                "Sale total does not match sale item totals."
            )

        payment_account = accounts["receivable"]

        lines = [
            {
                "account": payment_account,
                "debit": revenue,
            },
        ]

        if product_revenue > 0:
            lines.append(
                {
                    "account": accounts["sales"],
                    "credit": product_revenue,
                }
            )

        if service_revenue > 0:
            lines.append(
                {
                    "account": accounts["service_revenue"],
                    "credit": service_revenue,
                }
            )

        if cogs > 0:
            lines.extend(
                [
                    {
                        "account": accounts["cogs"],
                        "debit": cogs,
                    },
                    {
                        "account": accounts["inventory"],
                        "credit": cogs,
                    },
                ]
            )

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

        product_revenue = cls.calculate_product_revenue(sale)
        service_revenue = cls.calculate_service_revenue(sale)
        cogs = cls.calculate_cogs(sale)

        revenue = money(
            product_revenue + service_revenue
        )

        if revenue != money(sale.total):
            raise ValueError(
                "Sale total does not match sale item totals."
            )

        payment_account = accounts["receivable"]

        lines = [
            {
                "account": accounts["sales"],
                "debit": product_revenue,
            },
            {
                "account": accounts["service_revenue"],
                "debit": service_revenue,
            },
            {
                "account": payment_account,
                "credit": revenue,
            },
        ]

        if cogs > 0:
            lines.extend(
                [
                    {
                        "account": accounts["inventory"],
                        "debit": cogs,
                    },
                    {
                        "account": accounts["cogs"],
                        "credit": cogs,
                    },
                ]
            )

        return JournalService.create_entry(
            date=sale.sale_date,
            journal_type=JournalType.SALES,
            description=f"Reverse Sale #{sale.id}",
            reference=sale,
            created_by=user,
            lines=lines,
        )
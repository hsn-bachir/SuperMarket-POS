from decimal import Decimal, ROUND_HALF_UP

from django.conf import settings

from apps.accounting.models import Account
from apps.accounting.services.journal_service import JournalService
from apps.common.enums import JournalType,PaymentMethod,PaymentType


def money(value):
    return Decimal(value).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP
    )


class AccountingPostingService:

    @staticmethod
    def get_payment_account(payment_method, accounts):

        if payment_method == PaymentMethod.CASH:
            return accounts["cash"]

        if payment_method in (
        PaymentMethod.CARD,
        PaymentMethod.TRANSFER,
    ):
            return accounts["bank"]

        return accounts["receivable"]

    @staticmethod
    def get_accounts():
        account_code_map = getattr(
            settings,
            "ACCOUNTING_ACCOUNT_CODES",
            {
                "cash": "1110",
                "bank": "1120",
                "receivable": "1130",
                "inventory": "1141",
                "payable": "2110",
                "sales": "4100",
                "cogs": "5100",
            },
        )

        return {
            key: Account.objects.get(code=code)
            for key, code in account_code_map.items()
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

        payment_account = AccountingPostingService.get_payment_account(
    sale.payment_method,
    accounts,
)

        lines = [
    {
        "account": payment_account,
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

        payment_account = AccountingPostingService.get_payment_account(
    sale.payment_method,
    accounts,
)

        lines = [
            {
                "account": accounts["sales"],
                "debit": revenue,
            },
            {
    "account": payment_account,
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

        if purchase.payment_method == PaymentMethod.CREDIT:
            payment_account = accounts["payable"]
        else:
            payment_account = AccountingPostingService.get_payment_account(
        purchase.payment_method,
        accounts,
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
                "account": payment_account,
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

        payment_account = accounts["payable"]

        if purchase.payment_method == PaymentMethod.CREDIT:
            payment_account = accounts["payable"]
        else:
            payment_account = AccountingPostingService.get_payment_account(
        purchase.payment_method,
        accounts,
    )


        return JournalService.create_entry(
        date=purchase.purchase_date,
        journal_type=JournalType.PURCHASE,
        description=f"Reverse Purchase #{purchase.invoice_number}",
        reference=purchase,
        created_by=user,
        lines=[
            {
                "account": payment_account,
                "debit": total,
            },
            {
                "account": accounts["inventory"],
                "credit": total,
            },
        ],
    )

    @staticmethod
    def post_expense(expense, user):

        accounts = AccountingPostingService.get_accounts()

        payment_account = accounts["payable"]

        if expense.payment_method == PaymentMethod.CASH:
            payment_account = accounts["cash"]

        elif expense.payment_method in (
        PaymentMethod.CARD,
        PaymentMethod.TRANSFER,
    ):
            payment_account = accounts["bank"]

        return JournalService.create_entry(
        date=expense.date,
        journal_type=JournalType.EXPENSE,
        description=f"Expense #{expense.number}",
        reference=expense,
        created_by=user,
        lines=[
            {
                "account": expense.category.account,
                "debit": money(expense.amount),
            },
            {
                "account": payment_account,
                "credit": money(expense.amount),
            },
        ],
    )


    @staticmethod
    def reverse_expense(expense, user):

        accounts = AccountingPostingService.get_accounts()

        payment_account = accounts["payable"]

        if expense.payment_method == PaymentMethod.CASH:
            payment_account = accounts["cash"]

        elif expense.payment_method in (
            PaymentMethod.CARD,
            PaymentMethod.TRANSFER,
    ):
            payment_account = accounts["bank"]

        return JournalService.create_entry(
        date=expense.date,
        journal_type=JournalType.EXPENSE,
        description=f"Reverse Expense #{expense.number}",
        reference=expense,
        created_by=user,
        lines=[
            {
                "account": payment_account,
                "debit": money(expense.amount),
            },
            {
                "account": expense.category.account,
                "credit": money(expense.amount),
            },
        ],
    )


    @staticmethod
    def post_payment(payment, user):

        accounts = AccountingPostingService.get_accounts()

        if payment.payment_method == PaymentMethod.CASH:
            payment_account = accounts["cash"]

        elif payment.payment_method in (
        PaymentMethod.CARD,
        PaymentMethod.TRANSFER,
    ):
            payment_account = accounts["bank"]

        else:
            raise ValueError(
            "Payments cannot be made using CREDIT."
        )

        if payment.payment_type == PaymentType.SUPPLIER:

            lines = [
            {
                "account": accounts["payable"],
                "debit": money(payment.amount),
            },
            {
                "account": payment_account,
                "credit": money(payment.amount),
            },
        ]

        elif payment.payment_type == PaymentType.CUSTOMER:

            lines = [
            {
                "account": payment_account,
                "debit": money(payment.amount),
            },
            {
                "account": accounts["receivable"],
                "credit": money(payment.amount),
            },
        ]

        elif payment.payment_type == PaymentType.EXPENSE:

            lines = [
            {
                "account": accounts["payable"],
                "debit": money(payment.amount),
            },
            {
                "account": payment_account,
                "credit": money(payment.amount),
            },
        ]

        else:
            raise ValueError("Invalid payment type.")

        return JournalService.create_entry(
        date=payment.date,
        journal_type=JournalType.PAYMENT,
        description=f"Payment #{payment.number}",
        reference=payment,
        created_by=user,
        lines=lines,
    )

    @staticmethod
    def reverse_payment(payment, user):

        accounts = AccountingPostingService.get_accounts()

        if payment.payment_method == PaymentMethod.CASH:
            payment_account = accounts["cash"]

        elif payment.payment_method in (
        PaymentMethod.CARD,
        PaymentMethod.TRANSFER,
    ):
            payment_account = accounts["bank"]

        else:
            raise ValueError(
            "Payments cannot be made using CREDIT."
        )

        if payment.payment_type in (
        PaymentType.SUPPLIER,
        PaymentType.EXPENSE,
    ):

            lines = [
            {
                "account": payment_account,
                "debit": money(payment.amount),
            },
            {
                "account": accounts["payable"],
                "credit": money(payment.amount),
            },
        ]

        elif payment.payment_type == PaymentType.CUSTOMER:

            lines = [
            {
                "account": accounts["receivable"],
                "debit": money(payment.amount),
            },
            {
                "account": payment_account,
                "credit": money(payment.amount),
            },
        ]

        else:
            raise ValueError("Invalid payment type.")

        return JournalService.create_entry(
        date=payment.date,
        journal_type=JournalType.PAYMENT,
        description=f"Reverse Payment #{payment.number}",
        reference=payment,
        created_by=user,
        lines=lines,
    )
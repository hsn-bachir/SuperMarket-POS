from apps.accounting.models import Account
from apps.accounting.services.journal_service import JournalService
from apps.common.enums import JournalType
from decimal import Decimal, ROUND_HALF_UP

def money(value):
    return Decimal(value).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP
    )



cash = Account.objects.get(code="1110")
sales = Account.objects.get(code="4100")
inventory = Account.objects.get(code="1141")
cogs_account = Account.objects.get(code="5100")
accounts_payable = Account.objects.get(code="2110")

class AccountingPostingService:

    @staticmethod
    def post_sale(sale,user):

        revenue = money(sale.total)

        cogs = money(
    sum(
        item.quantity * item.cost_price
        for item in sale.items.all()
    )
)

        lines = [
    {
        "account": cash,
        "debit": revenue,
    },
    {
        "account": sales,
        "credit": revenue,
    },
]

        if cogs > 0:
            lines.extend([
        {
            "account": cogs_account,
            "debit": cogs,
        },
        {
            "account": inventory,
            "credit": cogs,
        },
    ])

        return JournalService.create_entry(
            date=sale.sale_date,
            journal_type=JournalType.SALES,
            description=f"Sale #{sale.id}",
            reference=sale,
            created_by=user,
            lines=lines
        )
    
    @staticmethod
    def reverse_sale(sale, user):

        revenue = money(sale.total)

        cogs = money(
        sum(
            item.quantity * item.cost_price
            for item in sale.items.all()
        )
    )

        return JournalService.create_entry(
        date=sale.sale_date,
        journal_type=JournalType.SALES,
        description=f"Reverse Sale #{sale.id}",
        reference=sale,
        created_by=user,
        lines=[
            {
                "account": sales,
                "debit": revenue,
            },
            {
                "account": cash,
                "credit": revenue,
            },
            {
                "account": inventory,
                "debit": cogs,
            },
            {
                "account": cogs_account,
                "credit": cogs,
            },
        ],
    )

    @staticmethod
    def post_purchase(purchase, user):

        total = money(
        sum(
            item.quantity * item.cost_price
            for item in purchase.items.all()
        )
    )

        return JournalService.create_entry(
        date=purchase.purchase_date,
        journal_type=JournalType.PURCHASE,
        description=f"Purchase #{purchase.invoice_number}",
        reference=purchase,
        created_by=user,
        lines=[
            {
                "account": inventory,
                "debit": total,
            },
            {
                "account": accounts_payable,
                "credit": total,
            },
        ],
    )

    @staticmethod
    def reverse_purchase(purchase, user):

        total = money(
        sum(
            item.quantity * item.cost_price
            for item in purchase.items.all()
        )
    )

        return JournalService.create_entry(
        date=purchase.purchase_date,
        journal_type=JournalType.PURCHASE,
        description=f"Reverse Purchase #{purchase.invoice_number}",
        reference=purchase,
        created_by=user,
        lines=[
            {
                "account": accounts_payable,
                "debit": total,
            },
            {
                "account": inventory,
                "credit": total,
            },
        ],
    )
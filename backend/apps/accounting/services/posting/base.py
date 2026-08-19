from decimal import Decimal, ROUND_HALF_UP
from django.conf import settings
from apps.accounting.models.accountModel import Account
from apps.common.enums import PaymentMethod


def money(value):
    return Decimal(value).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP
    )


class BasePostingService:

    @staticmethod
    def get_payment_account(payment_method, accounts):
        if payment_method == PaymentMethod.CASH:
            return accounts["cash"]
        if payment_method in (PaymentMethod.CARD, PaymentMethod.TRANSFER):
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
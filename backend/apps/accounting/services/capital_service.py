from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import transaction

from apps.accounting.models.accountModel import Account
from apps.accounting.services.journal_service import JournalService
from apps.common.enums import AccountType, JournalType, NormalBalance


class CapitalService:
    CAPITAL_CODE = "3100"
    CASH_CODES = {"1110", "1120"}

    @staticmethod
    @transaction.atomic
    def invest(*, amount, account_code, date, user, description="Owner capital investment"):
        amount = Decimal(str(amount))
        if amount <= 0:
            raise ValidationError("Capital investment amount must be greater than zero.")

        target = Account.objects.get(code=account_code)
        if target.code not in CapitalService.CASH_CODES:
            raise ValidationError("Capital investment must target cash or bank.")
        if not target.is_active or not target.is_postable:
            raise ValidationError("Capital investment account must be active and postable.")

        capital = Account.objects.get(
            code=CapitalService.CAPITAL_CODE,
            account_type=AccountType.EQUITY,
            normal_balance=NormalBalance.CREDIT,
            is_active=True,
            is_postable=True,
        )

        return JournalService.create_entry(
            date=date,
            journal_type=JournalType.GENERAL,
            description=description,
            created_by=user,
            lines=[
                {"account": target, "debit": amount},
                {"account": capital, "credit": amount},
            ],
        )
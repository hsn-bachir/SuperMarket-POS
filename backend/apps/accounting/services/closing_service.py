from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import transaction

from apps.common.enums import (
    AccountType,
    JournalType,
    PeriodStatus,
)

from apps.accounting.models import Account

from apps.accounting.services.accounting_period_service import (
    AccountingPeriodService,
)

from apps.accounting.services.AccountBalanceService import (
    AccountBalanceService,
)

from apps.accounting.services.journal_service import (
    JournalService,
)


class ClosingService:
    """
    Handles accounting period closing.

    Process:

        Revenue Accounts
              |
              v
        Income Summary
              |
              v
        Expense Accounts
              |
              v
        Net Income
              |
              v
        Retained Earnings
              |
              v
        Close Period
    """

    INCOME_SUMMARY_CODE = "3900"
    RETAINED_EARNINGS_CODE = "3200"


    @staticmethod
    @transaction.atomic
    def close_period(
        *,
        period,
        user,
    ):

        ClosingService._validate_period(
            period
        )


        # Lock period
        AccountingPeriodService.start_closing(
            period
        )


        ClosingService._close_revenue_accounts(
            period,
            user,
        )


        ClosingService._close_expense_accounts(
            period,
            user,
        )


        ClosingService._transfer_net_income(
            period,
            user,
        )


        AccountingPeriodService.close_period(
            period,
            user,
        )


        return period



    @staticmethod
    def _validate_period(period):

        if period.status == PeriodStatus.CLOSED:
            raise ValidationError(
                "Period is already closed."
            )


        if period.status == PeriodStatus.CLOSING:
            raise ValidationError(
                "Period is already being closed."
            )


        # Ensure no draft journals
        draft_entries = (
            period
            .journal_entries
            .filter(
                status="DRAFT"
            )
            .exists()
        )


        if draft_entries:
            raise ValidationError(
                "Cannot close period with draft journal entries."
            )



    @staticmethod
    def _get_income_summary_account():

        try:
            return Account.objects.get(
                code=ClosingService.INCOME_SUMMARY_CODE
            )

        except Account.DoesNotExist:

            raise ValidationError(
                "Income Summary account missing."
            )



    @staticmethod
    def _get_retained_earnings_account():

        try:
            return Account.objects.get(
                code=ClosingService.RETAINED_EARNINGS_CODE
            )

        except Account.DoesNotExist:

            raise ValidationError(
                "Retained Earnings account missing."
            )



    @staticmethod
    def _close_revenue_accounts(
        period,
        user,
    ):

        revenues = (
            Account.objects
            .filter(
                account_type=AccountType.REVENUE,
                is_active=True,
            )
        )


        lines = []


        for account in revenues:

            balance = (
                AccountBalanceService
                .get_balance(
                    account,
                    start_date=period.start_date,
                    end_date=period.end_date,
                )
            )


            if balance == Decimal("0.00"):
                continue


            # Revenue normally has credit balance
            lines.append(
                {
                    "account": account,
                    "debit": balance,
                    "credit": Decimal("0.00"),
                    "description": (
                        "Close revenue account"
                    ),
                }
            )


        if not lines:
            return


        income_summary = (
            ClosingService
            ._get_income_summary_account()
        )


        total = sum(
            line["debit"]
            for line in lines
        )


        lines.append(
            {
                "account": income_summary,
                "debit": Decimal("0.00"),
                "credit": total,
                "description": "Revenue closing",
            }
        )


        JournalService.create_entry(
            date=period.end_date,
            journal_type=JournalType.CLOSING,
            description="Close revenue accounts",
            created_by=user,
            lines=lines,
        )



    @staticmethod
    def _close_expense_accounts(
        period,
        user,
    ):

        expenses = (
            Account.objects
            .filter(
                account_type=AccountType.EXPENSE,
                is_active=True,
            )
        )


        lines = []


        total = Decimal("0.00")


        for account in expenses:

            balance = (
                AccountBalanceService
                .get_balance(
                    account,
                    start_date=period.start_date,
                    end_date=period.end_date,
                )
            )


            if balance == Decimal("0.00"):
                continue


            total += balance


            lines.append(
                {
                    "account": (
                        ClosingService
                        ._get_income_summary_account()
                    ),

                    "debit": balance,

                    "credit": Decimal("0.00"),

                    "description":
                        "Expense closing",
                }
            )


            lines.append(
                {
                    "account": account,

                    "debit": Decimal("0.00"),

                    "credit": balance,

                    "description":
                        "Close expense account",
                }
            )


        if lines:

            JournalService.create_entry(
                date=period.end_date,
                journal_type=JournalType.CLOSING,
                description="Close expense accounts",
                created_by=user,
                lines=lines,
            )



    @staticmethod
    def _transfer_net_income(
        period,
        user,
    ):

        income_summary = (
            ClosingService
            ._get_income_summary_account()
        )

        retained = (
            ClosingService
            ._get_retained_earnings_account()
        )


        balance = (
            AccountBalanceService
            .get_balance(
                income_summary,
                start_date=period.start_date,
                end_date=period.end_date,
            )
        )


        if balance == Decimal("0.00"):
            return


        if balance > 0:

            lines = [
                {
                    "account": income_summary,
                    "debit": balance,
                    "credit": Decimal("0.00"),
                },

                {
                    "account": retained,
                    "debit": Decimal("0.00"),
                    "credit": balance,
                },
            ]

        else:

            amount = abs(balance)

            lines = [
                {
                    "account": retained,
                    "debit": amount,
                    "credit": Decimal("0.00"),
                },

                {
                    "account": income_summary,
                    "debit": Decimal("0.00"),
                    "credit": amount,
                },
            ]


        JournalService.create_entry(
            date=period.end_date,
            journal_type=JournalType.CLOSING,
            description="Transfer net income to retained earnings",
            created_by=user,
            lines=lines,
        )
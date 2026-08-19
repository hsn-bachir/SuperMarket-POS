from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import transaction

from apps.common.enums import (
    AccountType,
    JournalType,
    PeriodStatus,
)

from apps.accounting.models.accountModel import Account

from apps.accounting.services.accounting_period_service import (
    AccountingPeriodService,
)

from apps.accounting.services.report_services.AccountBalanceService import (
    AccountBalanceService,
)

from apps.accounting.services.journal_service import (
    JournalService,
)


class ClosingService:
    """
    Handles accounting period closing.

    Closing flow:

        Revenue Accounts
                |
                v
          Income Summary
                ^
                |
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

    # =====================================================
    # PUBLIC API
    # =====================================================

    @staticmethod
    @transaction.atomic
    def close_period(
        *,
        period,
        user,
    ):
        """
        Close an accounting period.

        Process:

        1. Validate period.
        2. Move OPEN -> CLOSING.
        3. Close revenue accounts.
        4. Close expense accounts.
        5. Transfer net income/loss to retained earnings.
        6. Move CLOSING -> CLOSED.
        """

        ClosingService._validate_period(
            period
        )

        # -------------------------------------------------
        # Lock period for closing
        # -------------------------------------------------

        AccountingPeriodService.start_closing(
            period
        )

        # -------------------------------------------------
        # Close revenue accounts
        # -------------------------------------------------

        ClosingService._close_revenue_accounts(
            period=period,
            user=user,
        )

        # -------------------------------------------------
        # Close expense accounts
        # -------------------------------------------------

        ClosingService._close_expense_accounts(
            period=period,
            user=user,
        )

        # -------------------------------------------------
        # Transfer net income/loss
        # -------------------------------------------------

        ClosingService._transfer_net_income(
            period=period,
            user=user,
        )

        # -------------------------------------------------
        # Mark period as CLOSED
        # -------------------------------------------------

        AccountingPeriodService.close_period(
            period=period,
            user=user,
        )

        return period

    # =====================================================
    # VALIDATION
    # =====================================================

    @staticmethod
    def _validate_period(period):
        """
        Validate that the period can be closed.
        """

        if period.status == PeriodStatus.CLOSED:
            raise ValidationError(
                "Period is already closed."
            )

        if period.status == PeriodStatus.CLOSING:
            raise ValidationError(
                "Period is already being closed."
            )

        # -------------------------------------------------
        # Draft journals are not allowed
        # -------------------------------------------------

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

    # =====================================================
    # SPECIAL ACCOUNTS
    # =====================================================

    @staticmethod
    def _get_income_summary_account():
        """
        Return the Income Summary account.

        Expected account code:
            3900
        """

        try:
            return Account.objects.get(
                code=ClosingService.INCOME_SUMMARY_CODE,
                is_active=True,
            )

        except Account.DoesNotExist:
            raise ValidationError(
                f'Income Summary account '
                f'"{ClosingService.INCOME_SUMMARY_CODE}" '
                f'is missing.'
            )

    @staticmethod
    def _get_retained_earnings_account():
        """
        Return the Retained Earnings account.

        Expected account code:
            3200
        """

        try:
            return Account.objects.get(
                code=ClosingService.RETAINED_EARNINGS_CODE,
                is_active=True,
            )

        except Account.DoesNotExist:
            raise ValidationError(
                f'Retained Earnings account '
                f'"{ClosingService.RETAINED_EARNINGS_CODE}" '
                f'is missing.'
            )

    # =====================================================
    # CLOSE REVENUE
    # =====================================================

    @staticmethod
    def _close_revenue_accounts(
        *,
        period,
        user,
    ):
        """
        Close all revenue accounts into Income Summary.

        Example:

            Dr Sales Revenue       10,000
                Cr Income Summary       10,000
        """

        revenues = (
            Account.objects
            .filter(
                account_type=AccountType.REVENUE,
                is_active=True,
                is_postable=True,
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

            # Revenue normally has a credit balance.
            # Debit it to bring the balance to zero.
            lines.append(
                {
                    "account": account,
                    "debit": balance,
                    "credit": Decimal("0.00"),
                    "description": "Close revenue account",
                }
            )

        if not lines:
            return

        income_summary = (
            ClosingService
            ._get_income_summary_account()
        )

        total_revenue = sum(
            line["debit"]
            for line in lines
        )

        lines.append(
            {
                "account": income_summary,
                "debit": Decimal("0.00"),
                "credit": total_revenue,
                "description": "Revenue closing",
            }
        )

        JournalService.create_entry(
            date=period.end_date,
            journal_type=JournalType.CLOSING,
            description="Close revenue accounts",
            created_by=user,
            lines=lines,
            allow_closing_period=True,
        )

    # =====================================================
    # CLOSE EXPENSES
    # =====================================================

    @staticmethod
    def _close_expense_accounts(
        *,
        period,
        user,
    ):
        """
        Close all expense accounts into Income Summary.

        Example:

            Dr Income Summary       7,000
                Cr Rent Expense          7,000

            Dr Income Summary       3,000
                Cr Utilities Expense     3,000
        """

        expenses = (
            Account.objects
            .filter(
                account_type=AccountType.EXPENSE,
                is_active=True,
                is_postable=True,
            )
        )

        income_summary = (
            ClosingService
            ._get_income_summary_account()
        )

        lines = []

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

            lines.append(
                {
                    "account": income_summary,
                    "debit": balance,
                    "credit": Decimal("0.00"),
                    "description": "Expense closing",
                }
            )

            lines.append(
                {
                    "account": account,
                    "debit": Decimal("0.00"),
                    "credit": balance,
                    "description": "Close expense account",
                }
            )

        if not lines:
            return

        JournalService.create_entry(
            date=period.end_date,
            journal_type=JournalType.CLOSING,
            description="Close expense accounts",
            created_by=user,
            lines=lines,
            allow_closing_period=True,
        )

    # =====================================================
    # TRANSFER NET INCOME
    # =====================================================

    @staticmethod
    def _transfer_net_income(
        *,
        period,
        user,
    ):
        """
        Transfer the Income Summary balance to Retained Earnings.

        Profit:

            Dr Income Summary
                Cr Retained Earnings

        Loss:

            Dr Retained Earnings
                Cr Income Summary
        """

        income_summary = (
            ClosingService
            ._get_income_summary_account()
        )

        retained_earnings = (
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

        # -------------------------------------------------
        # PROFIT
        # -------------------------------------------------

        if balance > Decimal("0.00"):
            lines = [
                {
                    "account": income_summary,
                    "debit": balance,
                    "credit": Decimal("0.00"),
                    "description": "Close Income Summary",
                },
                {
                    "account": retained_earnings,
                    "debit": Decimal("0.00"),
                    "credit": balance,
                    "description": "Transfer net income",
                },
            ]

        # -------------------------------------------------
        # LOSS
        # -------------------------------------------------

        else:
            amount = abs(balance)

            lines = [
                {
                    "account": retained_earnings,
                    "debit": amount,
                    "credit": Decimal("0.00"),
                    "description": "Transfer net loss",
                },
                {
                    "account": income_summary,
                    "debit": Decimal("0.00"),
                    "credit": amount,
                    "description": "Close Income Summary",
                },
            ]

        # IMPORTANT:
        #
        # The period is currently CLOSING.
        # Therefore the closing journal must explicitly
        # allow posting during a closing period.

        JournalService.create_entry(
            date=period.end_date,
            journal_type=JournalType.CLOSING,
            description="Transfer net income to retained earnings",
            created_by=user,
            lines=lines,
            allow_closing_period=True,
        )
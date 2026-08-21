from decimal import Decimal
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db import transaction

from apps.common.enums import (
    AccountType,
    EntryStatus,
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
from backend.apps.accounting.models.periodsModel import AccountingPeriod


class ClosingService:

    INCOME_SUMMARY_CODE = "3900"
    RETAINED_EARNINGS_CODE = "3200"

    ZERO = Decimal("0.00")

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

        Flow:

            OPEN
              |
              v
           CLOSING
              |
              +--> Close Revenue
              |
              +--> Close Expenses
              |
              +--> Transfer Net Income/Loss
              |
              v
           CLOSED

        Everything occurs inside one database transaction.

        If anything fails, the entire operation is rolled back.
        """

        # -------------------------------------------------
        # LOCK PERIOD
        # -------------------------------------------------

        period = (
        AccountingPeriod.objects
    .select_for_update()
    .get(pk=period.pk)
)

        # -------------------------------------------------
        # VALIDATE PERIOD
        # -------------------------------------------------

        ClosingService._validate_period(
            period
        )

        # -------------------------------------------------
        # GET SPECIAL ACCOUNTS
        # -------------------------------------------------

        income_summary = (
            ClosingService
            ._get_income_summary_account()
        )

        retained_earnings = (
            ClosingService
            ._get_retained_earnings_account()
        )

        ClosingService._validate_special_accounts(
            income_summary=income_summary,
            retained_earnings=retained_earnings,
        )

        # -------------------------------------------------
        # CALCULATE ORIGINAL PERIOD BALANCES
        # -------------------------------------------------

        revenue_balances = (
            ClosingService
            ._get_revenue_balances(
                period=period,
            )
        )

        expense_balances = (
            ClosingService
            ._get_expense_balances(
                period=period,
            )
        )

        # -------------------------------------------------
        # CALCULATE NET INCOME
        # -------------------------------------------------

        total_revenue = sum(
            (
                data["balance"]
                for data in revenue_balances.values()
            ),
            ClosingService.ZERO,
        )

        total_expenses = sum(
            (
                data["balance"]
                for data in expense_balances.values()
            ),
            ClosingService.ZERO,
        )

        net_income = (
            total_revenue
            - total_expenses
        )

        # -------------------------------------------------
        # OPEN -> CLOSING
        # -------------------------------------------------

        period = (
            AccountingPeriodService.close_period(
    period=period,
    user=user,
)
        )

        # -------------------------------------------------
        # CLOSE REVENUE
        # -------------------------------------------------

        ClosingService._close_revenue_accounts(
            period=period,
            user=user,
            revenue_balances=revenue_balances,
            income_summary=income_summary,
        )

        # -------------------------------------------------
        # CLOSE EXPENSES
        # -------------------------------------------------

        ClosingService._close_expense_accounts(
            period=period,
            user=user,
            expense_balances=expense_balances,
            income_summary=income_summary,
        )

        # -------------------------------------------------
        # TRANSFER NET INCOME / LOSS
        # -------------------------------------------------

        ClosingService._transfer_net_income(
            period=period,
            user=user,
            net_income=net_income,
            income_summary=income_summary,
            retained_earnings=retained_earnings,
        )

        # -------------------------------------------------
        # CLOSING -> CLOSED
        # -------------------------------------------------

        period = (
            AccountingPeriodService
            .close_period(
                period=period,
                user=user,
            )
        )

        return period

    # =====================================================
    # VALIDATION
    # =====================================================

    @staticmethod
    def _validate_period(
        period,
    ):
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

        if period.status != PeriodStatus.OPEN:
            raise ValidationError(
                "Only open periods can be closed."
            )

        # -------------------------------------------------
        # DRAFT JOURNALS
        # -------------------------------------------------

        draft_entries = (
            period
            .journal_entries
            .filter(
                status=EntryStatus.DRAFT,
            )
            .exists()
        )

        if draft_entries:
            raise ValidationError(
                "Cannot close period with draft journal entries."
            )

        # -------------------------------------------------
        # EXISTING CLOSING ENTRIES
        # -------------------------------------------------

        closing_entries = (
            period
            .journal_entries
            .filter(
                journal_type=JournalType.CLOSING,
                status=EntryStatus.POSTED,
            )
            .exists()
        )

        if closing_entries:
            raise ValidationError(
                "This period already contains posted "
                "closing journal entries."
            )

    # =====================================================
    # SPECIAL ACCOUNTS
    # =====================================================

    @staticmethod
    def _get_income_summary_account():
        try:
            return Account.objects.get(
                code=ClosingService.INCOME_SUMMARY_CODE,
                is_active=True,
            )

        except Account.DoesNotExist:
            raise ValidationError(
                f'Income Summary account '
                f'"{ClosingService.INCOME_SUMMARY_CODE}" '
                f'is missing or inactive.'
            )

    @staticmethod
    def _get_retained_earnings_account():
        try:
            return Account.objects.get(
                code=ClosingService.RETAINED_EARNINGS_CODE,
                is_active=True,
            )

        except Account.DoesNotExist:
            raise ValidationError(
                f'Retained Earnings account '
                f'"{ClosingService.RETAINED_EARNINGS_CODE}" '
                f'is missing or inactive.'
            )

    @staticmethod
    def _validate_special_accounts(
        *,
        income_summary,
        retained_earnings,
    ):
        """
        Validate accounts required by closing.
        """

        # -------------------------------------------------
        # ACCOUNT TYPE
        # -------------------------------------------------

        if income_summary.account_type != AccountType.EQUITY:
            raise ValidationError(
                f'Account "{income_summary.code}" must be '
                f'an EQUITY account.'
            )

        if retained_earnings.account_type != AccountType.EQUITY:
            raise ValidationError(
                f'Account "{retained_earnings.code}" must be '
                f'an EQUITY account.'
            )

        # -------------------------------------------------
        # POSTABLE
        # -------------------------------------------------

        if not income_summary.is_postable:
            raise ValidationError(
                f'Account "{income_summary.code}" '
                f'must be postable.'
            )

        if not retained_earnings.is_postable:
            raise ValidationError(
                f'Account "{retained_earnings.code}" '
                f'must be postable.'
            )

        # -------------------------------------------------
        # ACTIVE
        # -------------------------------------------------

        if not income_summary.is_active:
            raise ValidationError(
                f'Account "{income_summary.code}" '
                f'must be active.'
            )

        if not retained_earnings.is_active:
            raise ValidationError(
                f'Account "{retained_earnings.code}" '
                f'must be active.'
            )

        # -------------------------------------------------
        # DIFFERENT ACCOUNTS
        # -------------------------------------------------

        if income_summary.pk == retained_earnings.pk:
            raise ValidationError(
                "Income Summary and Retained Earnings "
                "must be different accounts."
            )

    # =====================================================
    # REVENUE BALANCES
    # =====================================================

    @staticmethod
    def _get_revenue_balances(
        *,
        period,
    ):
        revenues = (
            Account.objects
            .filter(
                account_type=AccountType.REVENUE,
                is_active=True,
                is_postable=True,
            )
            .order_by("code")
        )

        balances = {}

        for account in revenues:

            balance = (
                AccountBalanceService
                .get_balance(
                    account,
                    start_date=period.start_date,
                    end_date=period.end_date,
                )
            )

            if balance == ClosingService.ZERO:
                continue

            balances[account.pk] = {
                "account": account,
                "balance": balance,
            }

        return balances

    # =====================================================
    # EXPENSE BALANCES
    # =====================================================

    @staticmethod
    def _get_expense_balances(
        *,
        period,
    ):
        expenses = (
            Account.objects
            .filter(
                account_type=AccountType.EXPENSE,
                is_active=True,
                is_postable=True,
            )
            .order_by("code")
        )

        balances = {}

        for account in expenses:

            balance = (
                AccountBalanceService
                .get_balance(
                    account,
                    start_date=period.start_date,
                    end_date=period.end_date,
                )
            )

            if balance == ClosingService.ZERO:
                continue

            balances[account.pk] = {
                "account": account,
                "balance": balance,
            }

        return balances

    # =====================================================
    # CLOSE REVENUE
    # =====================================================

    @staticmethod
    def _close_revenue_accounts(
        *,
        period,
        user,
        revenue_balances,
        income_summary,
    ):
        """
        Close revenue accounts into Income Summary.

        Normal revenue:

            Dr Revenue
                Cr Income Summary

        Abnormal revenue:

            Dr Income Summary
                Cr Revenue

        A single Income Summary balancing line is created
        for the net revenue amount.
        """

        lines = []

        total_revenue = ClosingService.ZERO

        for data in revenue_balances.values():

            account = data["account"]
            balance = data["balance"]

            # -------------------------------------------------
            # NORMAL CREDIT BALANCE
            # -------------------------------------------------

            if balance > ClosingService.ZERO:

                amount = balance

                lines.append(
                    {
                        "account": account,
                        "debit": amount,
                        "credit": ClosingService.ZERO,
                        "description": "Close revenue account",
                    }
                )

                total_revenue += amount

            # -------------------------------------------------
            # ABNORMAL DEBIT BALANCE
            # -------------------------------------------------

            else:

                amount = abs(balance)

                lines.append(
                    {
                        "account": account,
                        "debit": ClosingService.ZERO,
                        "credit": amount,
                        "description": (
                            "Close abnormal revenue account"
                        ),
                    }
                )

                total_revenue -= amount

        if not lines:
            return ClosingService.ZERO

        # -------------------------------------------------
        # INCOME SUMMARY BALANCING LINE
        # -------------------------------------------------

        if total_revenue > ClosingService.ZERO:

            lines.append(
                {
                    "account": income_summary,
                    "debit": ClosingService.ZERO,
                    "credit": total_revenue,
                    "description": "Revenue closing",
                }
            )

        elif total_revenue < ClosingService.ZERO:

            lines.append(
                {
                    "account": income_summary,
                    "debit": abs(total_revenue),
                    "credit": ClosingService.ZERO,
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

        return total_revenue

    # =====================================================
    # CLOSE EXPENSES
    # =====================================================

    @staticmethod
    def _close_expense_accounts(
        *,
        period,
        user,
        expense_balances,
        income_summary,
    ):
        """
        Close expense accounts into Income Summary.

        Normal expense:

            Dr Income Summary
                Cr Expense

        Abnormal expense:

            Dr Expense
                Cr Income Summary
        """

        lines = []

        total_expenses = ClosingService.ZERO

        for data in expense_balances.values():

            account = data["account"]
            balance = data["balance"]

            # -------------------------------------------------
            # NORMAL DEBIT BALANCE
            # -------------------------------------------------

            if balance > ClosingService.ZERO:

                amount = balance

                lines.extend(
                    [
                        {
                            "account": income_summary,
                            "debit": amount,
                            "credit": ClosingService.ZERO,
                            "description": "Expense closing",
                        },
                        {
                            "account": account,
                            "debit": ClosingService.ZERO,
                            "credit": amount,
                            "description": "Close expense account",
                        },
                    ]
                )

                total_expenses += amount

            # -------------------------------------------------
            # ABNORMAL CREDIT BALANCE
            # -------------------------------------------------

            else:

                amount = abs(balance)

                lines.extend(
                    [
                        {
                            "account": account,
                            "debit": amount,
                            "credit": ClosingService.ZERO,
                            "description": (
                                "Close abnormal expense account"
                            ),
                        },
                        {
                            "account": income_summary,
                            "debit": ClosingService.ZERO,
                            "credit": amount,
                            "description": (
                                "Close abnormal expense balance"
                            ),
                        },
                    ]
                )

                total_expenses -= amount

        if not lines:
            return ClosingService.ZERO

        JournalService.create_entry(
            date=period.end_date,
            journal_type=JournalType.CLOSING,
            description="Close expense accounts",
            created_by=user,
            lines=lines,
            allow_closing_period=True,
        )

        return total_expenses

    # =====================================================
    # TRANSFER NET INCOME / LOSS
    # =====================================================

    @staticmethod
    def _transfer_net_income(
        *,
        period,
        user,
        net_income,
        income_summary,
        retained_earnings,
    ):
        """
        Transfer net income/loss to Retained Earnings.

        Profit:

            Dr Income Summary
                Cr Retained Earnings

        Loss:

            Dr Retained Earnings
                Cr Income Summary
        """

        if net_income == ClosingService.ZERO:
            return ClosingService.ZERO

        # -------------------------------------------------
        # PROFIT
        # -------------------------------------------------

        if net_income > ClosingService.ZERO:

            lines = [
                {
                    "account": income_summary,
                    "debit": net_income,
                    "credit": ClosingService.ZERO,
                    "description": "Close Income Summary",
                },
                {
                    "account": retained_earnings,
                    "debit": ClosingService.ZERO,
                    "credit": net_income,
                    "description": "Transfer net income",
                },
            ]

        # -------------------------------------------------
        # LOSS
        # -------------------------------------------------

        else:

            amount = abs(net_income)

            lines = [
                {
                    "account": retained_earnings,
                    "debit": amount,
                    "credit": ClosingService.ZERO,
                    "description": "Transfer net loss",
                },
                {
                    "account": income_summary,
                    "debit": ClosingService.ZERO,
                    "credit": amount,
                    "description": "Close Income Summary",
                },
            ]

        JournalService.create_entry(
            date=period.end_date,
            journal_type=JournalType.CLOSING,
            description="Transfer net income to retained earnings",
            created_by=user,
            lines=lines,
            allow_closing_period=True,
        )

        return net_income
from decimal import Decimal

from django.db.models import Sum
from django.db.models.functions import Coalesce

from apps.common.enums import (
    EntryStatus,
    NormalBalance,
    PeriodStatus,
)

from apps.accounting.models.accountModel import Account
from apps.accounting.models.journalModel import JournalLine


ZERO = Decimal("0.00")


class AccountBalanceService:
    """
    Calculates account balances from POSTED journal entries.

    Source of truth:
        JournalEntry
             |
             v
        JournalLine
             |
             v
          Account

    Used by:
        - Account balances
        - Trial Balance
        - Financial Statements
        - Closing Entries

    Accounting rules:
        - POSTED entries affect balances.
        - DRAFT entries are ignored.
        - CANCELLED entries are ignored.
        - Historical balances include OPEN, CLOSING, and CLOSED periods.
        - Normal reporting must never include unposted entries.
    """

    # =====================================================
    # BASE QUERYSET
    # =====================================================

    @staticmethod
    def _base_queryset(
        account=None,
        start_date=None,
        end_date=None,
        only_open=False,
    ):
        """
        Return the base queryset used by all balance calculations.

        By default, balances include posted entries from:
            OPEN
            CLOSING
            CLOSED

        This is important for historical accounting reports.

        When only_open=True, only entries belonging to OPEN
        accounting periods are included.
        """

        queryset = (
            JournalLine.objects
            .select_related(
                "account",
                "journal_entry",
                "journal_entry__period",
            )
            .filter(
                journal_entry__status=EntryStatus.POSTED,
            )
        )

        if account is not None:
            queryset = queryset.filter(
                account=account,
            )

        if start_date is not None:
            queryset = queryset.filter(
                journal_entry__date__gte=start_date,
            )

        if end_date is not None:
            queryset = queryset.filter(
                journal_entry__date__lte=end_date,
            )

        if only_open:
            queryset = queryset.filter(
                journal_entry__period__status=PeriodStatus.OPEN,
            )
        else:
            queryset = queryset.filter(
                journal_entry__period__status__in=[
                    PeriodStatus.OPEN,
                    PeriodStatus.CLOSING,
                    PeriodStatus.CLOSED,
                ],
            )

        return queryset

    # =====================================================
    # TOTALS
    # =====================================================

    @staticmethod
    def get_totals(
        account,
        start_date=None,
        end_date=None,
    ):
        """
        Return total debit and credit amounts for an account.

        Only POSTED journal entries are included.
        """

        totals = (
            AccountBalanceService
            ._base_queryset(
                account=account,
                start_date=start_date,
                end_date=end_date,
            )
            .aggregate(
                debit=Coalesce(
                    Sum("debit"),
                    ZERO,
                ),
                credit=Coalesce(
                    Sum("credit"),
                    ZERO,
                ),
            )
        )

        return {
            "debit": totals["debit"],
            "credit": totals["credit"],
        }

    # =====================================================
    # SINGLE ACCOUNT BALANCE
    # =====================================================

    @staticmethod
    def get_balance(
        account,
        start_date=None,
        end_date=None,
    ):
        """
        Return the signed balance of an account.

        Debit-normal:
            balance = debit - credit

        Credit-normal:
            balance = credit - debit

        Positive:
            Normal balance

        Negative:
            Abnormal balance
        """

        totals = AccountBalanceService.get_totals(
            account=account,
            start_date=start_date,
            end_date=end_date,
        )

        debit = totals["debit"]
        credit = totals["credit"]

        if account.normal_balance == NormalBalance.DEBIT:
            return debit - credit

        return credit - debit

    # =====================================================
    # ALL ACCOUNT BALANCES
    # =====================================================

    @staticmethod
    def get_accounts_balance(
        account_type=None,
        start_date=None,
        end_date=None,
        include_zero=False,
    ):
        """
        Return signed balances for active accounts.

        A negative balance means the account currently has
        an abnormal balance relative to its normal balance.
        """

        accounts = (
            Account.objects
            .filter(
                is_active=True,
            )
            .order_by("code")
        )

        if account_type is not None:
            accounts = accounts.filter(
                account_type=account_type,
            )

        result = []

        for account in accounts:
            balance = AccountBalanceService.get_balance(
                account=account,
                start_date=start_date,
                end_date=end_date,
            )

            if not include_zero and balance == ZERO:
                continue

            result.append(
                {
                    "account": account,
                    "balance": balance,
                }
            )

        return result

    # =====================================================
    # TRIAL BALANCE
    # =====================================================

    @staticmethod
    def get_trial_balance(
        start_date=None,
        end_date=None,
    ):
        """
        Return the trial balance.

        Each account is placed on the correct debit or credit
        side according to its normal balance.

        Normal debit account:
            +1000 -> Debit 1000
            -1000 -> Credit 1000

        Normal credit account:
            +1000 -> Credit 1000
            -1000 -> Debit 1000
        """

        accounts = (
            Account.objects
            .filter(
                is_active=True,
            )
            .order_by("code")
        )

        rows = []

        total_debit = ZERO
        total_credit = ZERO

        for account in accounts:
            balance = AccountBalanceService.get_balance(
                account=account,
                start_date=start_date,
                end_date=end_date,
            )

            if balance == ZERO:
                continue

            # -------------------------------------------------
            # NORMAL BALANCE
            # -------------------------------------------------

            if balance > ZERO:

                if account.normal_balance == NormalBalance.DEBIT:
                    debit = balance
                    credit = ZERO
                else:
                    debit = ZERO
                    credit = balance

            # -------------------------------------------------
            # ABNORMAL BALANCE
            # -------------------------------------------------

            else:
                amount = abs(balance)

                if account.normal_balance == NormalBalance.DEBIT:
                    debit = ZERO
                    credit = amount
                else:
                    debit = amount
                    credit = ZERO

            total_debit += debit
            total_credit += credit

            rows.append(
                {
                    "account": account,
                    "debit": debit,
                    "credit": credit,
                    "balance": balance,
                }
            )

        return {
            "accounts": rows,
            "total_debit": total_debit,
            "total_credit": total_credit,
            "balanced": total_debit == total_credit,
        }
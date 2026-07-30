from decimal import Decimal

from django.db.models import Sum
from django.db.models.functions import Coalesce

from apps.common.enums import (
    AccountType,
    NormalBalance,
    PeriodStatus,
)

from apps.accounting.models import (
    Account,
    JournalLine,
)


ZERO = Decimal("0.00")


class AccountBalanceService:
    """
    Calculates account balances from journal entries.

    Source of truth:
        JournalEntry
            |
            |
        JournalLine
            |
            |
        Account

    Used by:
        - Account balances
        - Trial Balance
        - Financial Statements
        - Closing Entries
    """


    @staticmethod
    def _base_queryset(
        account=None,
        start_date=None,
        end_date=None,
        include_closed=True,
    ):
        """
        Base journal line queryset used by all calculations.
        """

        queryset = (
            JournalLine.objects
            .select_related(
                "account",
                "journal_entry",
                "journal_entry__period",
            )
        )


        if account:
            queryset = queryset.filter(
                account=account
            )


        if start_date:
            queryset = queryset.filter(
                journal_entry__date__gte=start_date
            )


        if end_date:
            queryset = queryset.filter(
                journal_entry__date__lte=end_date
            )


        if include_closed:
            queryset = queryset.filter(
                journal_entry__period__status__in=[
                    PeriodStatus.OPEN,
                    PeriodStatus.CLOSED,
                ]
            )

        else:
            queryset = queryset.filter(
                journal_entry__period__status=
                PeriodStatus.OPEN
            )


        return queryset



    @staticmethod
    def get_totals(
        account,
        start_date=None,
        end_date=None,
    ):
        """
        Returns debit and credit totals.
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



    @staticmethod
    def get_balance(
        account,
        start_date=None,
        end_date=None,
    ):
        """
        Returns calculated account balance.

        Debit accounts:
            debit - credit

        Credit accounts:
            credit - debit
        """

        totals = (
            AccountBalanceService
            .get_totals(
                account,
                start_date,
                end_date,
            )
        )


        debit = totals["debit"]
        credit = totals["credit"]


        if account.normal_balance == NormalBalance.DEBIT:
            return debit - credit


        return credit - debit



    @staticmethod
    def get_accounts_balance(
        account_type=None,
        start_date=None,
        end_date=None,
        include_zero=False,
    ):
        """
        Returns balances for accounts.
        """


        accounts = (
            Account.objects
            .filter(
                is_active=True
            )
            .order_by("code")
        )


        if account_type:
            accounts = accounts.filter(
                account_type=account_type
            )


        result = []


        for account in accounts:

            balance = (
                AccountBalanceService
                .get_balance(
                    account,
                    start_date,
                    end_date,
                )
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



    @staticmethod
    def get_trial_balance(
        start_date=None,
        end_date=None,
    ):
        """
        Returns trial balance.

        Includes:
            - Account balances
            - Total debit balance
            - Total credit balance
        """


        accounts = (
            Account.objects
            .filter(
                is_active=True
            )
            .order_by("code")
        )


        rows = []

        total_debit = ZERO
        total_credit = ZERO


        for account in accounts:

            balance = (
                AccountBalanceService
                .get_balance(
                    account,
                    start_date,
                    end_date,
                )
            )


            if balance == ZERO:
                continue


            if account.normal_balance == NormalBalance.DEBIT:

                debit = balance
                credit = ZERO

            else:

                debit = ZERO
                credit = balance


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
            "balanced": (
                total_debit == total_credit
            ),
        }
from decimal import Decimal

from django.db.models import Sum

from apps.accounting.models import (
    Account,
    JournalLine,
)

from apps.common.enums import (
    AccountType,
    NormalBalance,
)


class BalanceSheetService:


    @staticmethod
    def get_balance_sheet(
        *,
        end_date=None,
    ):

        accounts = (
            Account.objects
            .filter(
                is_active=True,
                is_postable=True,
                account_type__in=[
                    AccountType.ASSET,
                    AccountType.LIABILITY,
                    AccountType.EQUITY,
                ],
            )
            .order_by("code")
        )


        journal_lines = JournalLine.objects.filter(journal_entry__status="POSTED")


        if end_date:

            journal_lines = journal_lines.filter(
                journal_entry__date__lte=end_date
            )


        balances = (
            journal_lines
            .order_by()
            .values(
                "account_id"
            )
            .annotate(
                total_debit=Sum("debit"),
                total_credit=Sum("credit"),
            )
        )


        balance_map = {
            row["account_id"]: row
            for row in balances
        }


        assets = []
        liabilities = []
        equity = []


        total_assets = Decimal("0.00")
        total_liabilities = Decimal("0.00")
        total_equity = Decimal("0.00")


        for account in accounts:


            values = balance_map.get(
                account.id,
                {}
            )


            debit = (
                values.get("total_debit")
                or Decimal("0.00")
            )


            credit = (
                values.get("total_credit")
                or Decimal("0.00")
            )


            if account.normal_balance == NormalBalance.DEBIT:

                balance = debit - credit

            else:

                balance = credit - debit



            amount = abs(balance)


            row = {

                "account_id": account.id,

                "code": account.code,

                "name": account.name,

                "amount": amount,

            }



            if account.account_type == AccountType.ASSET:

                assets.append(row)

                total_assets += amount



            elif account.account_type == AccountType.LIABILITY:

                liabilities.append(row)

                total_liabilities += amount



            elif account.account_type == AccountType.EQUITY:

                equity.append(row)

                total_equity += amount



        return {

            "assets": assets,

            "total_assets": total_assets,


            "liabilities": liabilities,

            "total_liabilities": total_liabilities,


            "equity": equity,

            "total_equity": total_equity,


            "balance_check": (

                total_assets ==
                (
                    total_liabilities
                    +
                    total_equity
                )
            ),

        }
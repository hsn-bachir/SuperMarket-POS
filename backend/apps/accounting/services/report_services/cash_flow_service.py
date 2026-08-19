from decimal import Decimal

from django.db.models import Sum
from django.db.models import Q

from apps.accounting.models.accountModel import Account
from apps.accounting.models.journalModel import JournalLine

from apps.common.enums import (
    AccountType,
    CashFlowCategory,
)


class CashFlowService:


    @staticmethod
    def get_cash_flow(
        *,
        start_date=None,
        end_date=None,
    ):


        accounts = (
            Account.objects
            .filter(
                Q(
                    cash_flow_category__in=[
                        CashFlowCategory.OPERATING,
                        CashFlowCategory.INVESTING,
                        CashFlowCategory.FINANCING,
                    ]
                )
                | Q(
                    account_type=AccountType.ASSET,
                    name__in=["Cash On Hand", "Bank"],
                ),
                is_active=True,
            )
        )


        lines = JournalLine.objects.filter(journal_entry__status="POSTED")


        if start_date:

            lines = lines.filter(
                journal_entry__date__gte=start_date
            )


        if end_date:

            lines = lines.filter(
                journal_entry__date__lte=end_date
            )


        operating = []

        investing = []

        financing = []


        totals = {

            "operating": Decimal("0.00"),

            "investing": Decimal("0.00"),

            "financing": Decimal("0.00"),

        }


        cash_lines = lines.filter(account__in=accounts).select_related(
            "account", "journal_entry"
        )

        for line in cash_lines:
            counterparts = line.journal_entry.lines.exclude(
                account_id=line.account_id
            ).select_related("account")
            category = CashFlowCategory.OPERATING
            if counterparts.filter(account__code="3100").exists():
                category = CashFlowCategory.FINANCING

            amount = line.debit - line.credit
            row = {
                "account_id": line.account_id,
                "code": line.account.code,
                "name": line.account.name,
                "amount": amount,
            }

            if category == CashFlowCategory.FINANCING:
                financing.append(row)
                totals["financing"] += amount
            else:
                operating.append(row)
                totals["operating"] += amount



        return {

            "operating": operating,

            "investing": investing,

            "financing": financing,


            "net_operating": totals["operating"],

            "net_investing": totals["investing"],

            "net_financing": totals["financing"],


            "net_cash_change": (
                totals["operating"]
                +
                totals["investing"]
                +
                totals["financing"]
            ),
        }
from decimal import Decimal

from django.db.models import Sum

from apps.accounting.models import (
    Account,
    JournalLine,
)

from apps.common.enums import (
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
                is_active=True,
                cash_flow_category__in=[
                    CashFlowCategory.OPERATING,
                    CashFlowCategory.INVESTING,
                    CashFlowCategory.FINANCING,
                ],
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


        movements = (
            lines
            .values(
                "account_id"
            )
            .annotate(
                debit=Sum("debit"),
                credit=Sum("credit"),
            )
        )


        movement_map = {
            x["account_id"]: x
            for x in movements
        }


        operating = []

        investing = []

        financing = []


        totals = {

            "operating": Decimal("0.00"),

            "investing": Decimal("0.00"),

            "financing": Decimal("0.00"),

        }


        for account in accounts:


            values = movement_map.get(
                account.id,
                {}
            )


            debit = (
                values.get("debit")
                or Decimal("0.00")
            )


            credit = (
                values.get("credit")
                or Decimal("0.00")
            )


            amount = debit - credit


            row = {

                "account_id": account.id,

                "code": account.code,

                "name": account.name,

                "amount": abs(amount),

            }


            if account.cash_flow_category == CashFlowCategory.OPERATING:

                operating.append(row)

                totals["operating"] += amount


            elif account.cash_flow_category == CashFlowCategory.INVESTING:

                investing.append(row)

                totals["investing"] += amount


            elif account.cash_flow_category == CashFlowCategory.FINANCING:

                financing.append(row)

                totals["financing"] += amount



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
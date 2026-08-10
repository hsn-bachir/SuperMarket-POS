from django.core.management.base import BaseCommand

from apps.accounting.models import Account
from apps.accounting.seeds import CHART_OF_ACCOUNTS
from apps.common.enums import NormalBalance


class Command(BaseCommand):
    help = "Seed or update the default chart of accounts."

    def handle(self, *args, **options):
        self.create_accounts(CHART_OF_ACCOUNTS)

        self.stdout.write(
            self.style.SUCCESS(
                "Chart of Accounts seeded successfully."
            )
        )

    def create_accounts(
        self,
        accounts,
        parent=None,
    ):
        for data in accounts:
            children = data.get("children", [])

            account_type = data["type"]

            # Accounts with children are group/header accounts.
            # Accounts without children are postable accounts.
            is_postable = not bool(children)

            normal_balance = self.get_normal_balance(
                account_type
            )

            account, created = Account.objects.update_or_create(
                code=data["code"],
                defaults={
                    "name": data["name"],
                    "account_type": account_type,
                    "normal_balance": normal_balance,
                    "parent": parent,
                    "is_postable": is_postable,
                    "allow_manual_entries": is_postable,
                    "is_active": True,
                },
            )

            action = "Created" if created else "Updated"

            self.stdout.write(
                f"{action}: {account.code} - {account.name}"
            )

            if children:
                self.create_accounts(
                    children,
                    parent=account,
                )

    @staticmethod
    def get_normal_balance(account_type):
        debit_accounts = {
            "ASSET",
            "EXPENSE",
        }

        if account_type in debit_accounts:
            return NormalBalance.DEBIT

        return NormalBalance.CREDIT
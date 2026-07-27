from django.core.management.base import BaseCommand

from apps.accounting.models import Account
from apps.accounting.models import ExpenseCategory


CATEGORIES = [
    ("Rent", "6100"),
    ("Salary", "6200"),
    ("Utilities", "6300"),
    ("Transportation", "6400"),
]


class Command(BaseCommand):
    help = "Seed expense categories"

    def handle(self, *args, **kwargs):

        for name, account_code in CATEGORIES:

            account = Account.objects.get(code=account_code)

            _, created = ExpenseCategory.objects.get_or_create(
                name=name,
                defaults={
                    "account": account,
                },
            )

            if created:
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Created {name}"
                    )
                )
            else:
                self.stdout.write(
                    self.style.WARNING(
                        f"{name} already exists"
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(
                "Expense categories seeded successfully."
            )
        )
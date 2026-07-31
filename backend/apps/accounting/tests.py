from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase

from apps.accounting.models import Account, AccountingPeriod, JournalEntry, JournalLine
from apps.accounting.services.AccountBalanceService import AccountBalanceService
from apps.accounting.services.journal_service import JournalService
from apps.common.enums import AccountType, EntryStatus, NormalBalance, PeriodStatus


class AccountingJournalTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="acct-user",
            email="acct@example.com",
            password="secret123",
        )
        self.user.is_superuser = True
        self.user.is_staff = True
        self.user.save()
        self.period = AccountingPeriod.objects.create(
            name="Test Period",
            start_date="2024-01-01",
            end_date="2024-12-31",
            status=PeriodStatus.OPEN,
        )
        self.account = Account.objects.create(
            code="1000",
            name="Bank",
            account_type=AccountType.ASSET,
            normal_balance=NormalBalance.DEBIT,
            is_postable=True,
        )

    def test_create_entry_marks_journal_as_posted(self):
        entry = JournalService.create_entry(
            date="2024-02-01",
            journal_type="GENERAL",
            description="Test entry",
            created_by=self.user,
            lines=[
                {"account": self.account, "debit": Decimal("10.00")},
                {"account": self.account, "credit": Decimal("10.00")},
            ],
        )

        self.assertEqual(entry.status, EntryStatus.POSTED)

    def test_balance_service_ignores_draft_journals(self):
        posted = JournalEntry.objects.create(
            period=self.period,
            date="2024-02-01",
            journal_type="GENERAL",
            description="Posted",
            created_by=self.user,
            status=EntryStatus.POSTED,
        )
        JournalLine.objects.create(
            journal_entry=posted,
            account=self.account,
            debit=Decimal("10.00"),
            credit=Decimal("0.00"),
        )

        draft = JournalEntry.objects.create(
            period=self.period,
            date="2024-02-01",
            journal_type="GENERAL",
            description="Draft",
            created_by=self.user,
            status=EntryStatus.DRAFT,
        )
        JournalLine.objects.create(
            journal_entry=draft,
            account=self.account,
            debit=Decimal("5.00"),
            credit=Decimal("0.00"),
        )

        balance = AccountBalanceService.get_balance(self.account, start_date="2024-01-01", end_date="2024-12-31")
        self.assertEqual(balance, Decimal("10.00"))

    def test_posted_journals_cannot_be_deleted(self):
        entry = JournalEntry.objects.create(
            period=self.period,
            date="2024-02-01",
            journal_type="GENERAL",
            description="Posted",
            created_by=self.user,
            status=EntryStatus.POSTED,
        )

        with self.assertRaises(ValidationError):
            entry.delete()

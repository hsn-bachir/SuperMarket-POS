from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from apps.common.enums import PeriodStatus
from apps.accounting.models import AccountingPeriod


class AccountingPeriodService:

    @staticmethod
    @transaction.atomic
    def create_period(
        *,
        name: str,
        start_date,
        end_date,
    ) -> AccountingPeriod:

        period = AccountingPeriod(
            name=name,
            start_date=start_date,
            end_date=end_date,
        )

        period.full_clean()
        period.save()

        return period


    @staticmethod
    def get_period(period_id) -> AccountingPeriod:

        try:
            return AccountingPeriod.objects.get(
                pk=period_id
            )

        except AccountingPeriod.DoesNotExist:
            raise ValidationError(
                "Accounting period does not exist."
            )


    @staticmethod
    def get_current_period(transaction_date) -> AccountingPeriod:

        try:
            return (
                AccountingPeriod.objects
                .get(
                    start_date__lte=transaction_date,
                    end_date__gte=transaction_date,
                )
            )

        except AccountingPeriod.DoesNotExist:
            raise ValidationError(
                f"No accounting period exists for {transaction_date}."
            )

        except AccountingPeriod.MultipleObjectsReturned:
            raise ValidationError(
                "Multiple accounting periods found for this date."
            )


    @staticmethod
    def validate_transaction_date(transaction_date) -> AccountingPeriod:

        period = (
            AccountingPeriodService
            .get_current_period(transaction_date)
        )

        if period.status == PeriodStatus.CLOSED:
            raise ValidationError(
                f'Accounting period "{period.name}" is closed.'
            )

        if period.status == PeriodStatus.CLOSING:
            raise ValidationError(
                f'Accounting period "{period.name}" is currently closing.'
            )

        return period


    @staticmethod
    def ensure_period_is_open(transaction_date):

        AccountingPeriodService.validate_transaction_date(
            transaction_date
        )

        return True


    @staticmethod
    def is_open(transaction_date):

        period = (
            AccountingPeriodService
            .get_current_period(transaction_date)
        )

        return period.status == PeriodStatus.OPEN


    @staticmethod
    @transaction.atomic
    def start_closing(period: AccountingPeriod):

        if period.status != PeriodStatus.OPEN:
            raise ValidationError(
                "Only open periods can start closing."
            )

        period.status = PeriodStatus.CLOSING

        period.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        return period


    @staticmethod
    @transaction.atomic
    def close_period(
        period: AccountingPeriod,
        user=None,
    ):

        if period.status == PeriodStatus.CLOSED:
            raise ValidationError(
                "Accounting period is already closed."
            )

        if period.status != PeriodStatus.CLOSING:
            raise ValidationError(
                "Period must be in closing state before closing."
            )

        period.status = PeriodStatus.CLOSED
        period.closed_at = timezone.now()
        period.closed_by = user

        period.save(
            update_fields=[
                "status",
                "closed_at",
                "closed_by",
                "updated_at",
            ]
        )

        return period


    @staticmethod
    @transaction.atomic
    def reopen_period(
        period: AccountingPeriod,
        user=None,
    ):

        if period.status != PeriodStatus.CLOSED:
            raise ValidationError(
                "Only closed periods can be reopened."
            )

        period.status = PeriodStatus.OPEN
        period.closed_at = None
        period.closed_by = None

        period.save(
            update_fields=[
                "status",
                "closed_at",
                "closed_by",
                "updated_at",
            ]
        )

        return period
from calendar import monthrange
from datetime import timedelta

from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from apps.common.enums import PeriodStatus
from apps.accounting.models.periodsModel import AccountingPeriod


class AccountingPeriodService:

    # =====================================================
    # CREATE
    # =====================================================

    @staticmethod
    @transaction.atomic
    def create_period(
        *,
        name: str,
        start_date,
        end_date,
    ) -> AccountingPeriod:
        """
        Create a new accounting period.

        Periods may not overlap.
        """

        if start_date > end_date:
            raise ValidationError(
                "Period start date cannot be after end date."
            )

        overlapping = (
            AccountingPeriod.objects
            .filter(
                start_date__lte=end_date,
                end_date__gte=start_date,
            )
            .exists()
        )

        if overlapping:
            raise ValidationError(
                "Accounting period overlaps with an existing period."
            )

        period = AccountingPeriod(
            name=name,
            start_date=start_date,
            end_date=end_date,
        )

        period.full_clean()
        period.save()

        return period

    # =====================================================
    # GET
    # =====================================================

    @staticmethod
    def get_period(
        period_id,
    ) -> AccountingPeriod:
        """
        Return an accounting period by primary key.
        """

        try:
            return AccountingPeriod.objects.get(
                pk=period_id,
            )

        except AccountingPeriod.DoesNotExist:
            raise ValidationError(
                "Accounting period does not exist."
            )

    # =====================================================
    # GET CURRENT PERIOD
    # =====================================================

    @staticmethod
    def get_current_period(
        transaction_date,
    ) -> AccountingPeriod:
        """
        Return the accounting period containing
        the given date.

        Exactly one period must contain the date.
        """

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
                f"No accounting period exists for "
                f"{transaction_date}."
            )

        except AccountingPeriod.MultipleObjectsReturned:
            raise ValidationError(
                "Multiple accounting periods found for this date."
            )

    # =====================================================
    # VALIDATE TRANSACTION DATE
    # =====================================================

    @staticmethod
    def validate_transaction_date(
        transaction_date,
        allow_closing_period=False,
    ) -> AccountingPeriod:
        """
        Validate whether a transaction may be posted
        on the given date.

        Normal transactions:

            OPEN       -> allowed
            CLOSING    -> rejected
            CLOSED     -> rejected

        Closing entries:

            OPEN       -> allowed
            CLOSING    -> allowed
            CLOSED     -> rejected
        """

        period = (
            AccountingPeriodService
            .get_current_period(transaction_date)
        )

        if period.status == PeriodStatus.CLOSED:
            raise ValidationError(
                f'Accounting period "{period.name}" is closed.'
            )

        if (
            period.status == PeriodStatus.CLOSING
            and not allow_closing_period
        ):
            raise ValidationError(
                f'Accounting period "{period.name}" '
                "is currently closing."
            )

        return period

    # =====================================================
    # ENSURE PERIOD IS OPEN
    # =====================================================

    @staticmethod
    def ensure_period_is_open(
        transaction_date,
    ) -> AccountingPeriod:
        """
        Ensure the transaction belongs to an OPEN period.
        """

        return (
            AccountingPeriodService
            .validate_transaction_date(
                transaction_date,
                allow_closing_period=False,
            )
        )

    # =====================================================
    # IS OPEN
    # =====================================================

    @staticmethod
    def is_open(transaction_date):
        try:
            period = (
            AccountingPeriod.objects
            .get(
                start_date__lte=transaction_date,
                end_date__gte=transaction_date,
            )
        )
        except AccountingPeriod.DoesNotExist:
            return False

        return period.status == PeriodStatus.OPEN

    # =====================================================
    # GENERATE NEXT PERIOD
    # =====================================================

    @staticmethod
    @transaction.atomic
    def generate_next_period() -> AccountingPeriod:
        """
        Generate the next monthly accounting period
        after the latest existing period.
        """

        last_period = (
            AccountingPeriod.objects
            .order_by("-end_date")
            .first()
        )

        if not last_period:
            raise ValidationError(
                "No accounting period exists. "
                "Create the first period manually."
            )

        start_date = (
            last_period.end_date
            + timedelta(days=1)
        )

        year = start_date.year
        month = start_date.month

        last_day = monthrange(
            year,
            month,
        )[1]

        end_date = start_date.replace(
            day=last_day,
        )

        period_name = start_date.strftime(
            "%B %Y"
        )

        overlapping = (
            AccountingPeriod.objects
            .filter(
                start_date__lte=end_date,
                end_date__gte=start_date,
            )
            .exists()
        )

        if overlapping:
            raise ValidationError(
                "The next accounting period overlaps "
                "with an existing period."
            )

        period = AccountingPeriod(
            name=period_name,
            start_date=start_date,
            end_date=end_date,
        )

        period.full_clean()
        period.save()

        return period

    # =====================================================
    # START CLOSING
    # =====================================================

    @staticmethod
    @transaction.atomic
    def start_closing(
        period: AccountingPeriod,
    ) -> AccountingPeriod:
        """
        Move OPEN -> CLOSING.

        The period row is locked to prevent
        concurrent close operations.
        """

        period = (
            AccountingPeriod.objects
            .select_for_update()
            .get(
                pk=period.pk,
            )
        )

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

    # =====================================================
    # FINALIZE CLOSE
    # =====================================================

    @staticmethod
    @transaction.atomic
    def close_period(
        period: AccountingPeriod,
        user=None,
    ) -> AccountingPeriod:
        """
        Move CLOSING -> CLOSED.

        This should only be called after all
        closing journal entries have been created.
        """

        period = (
            AccountingPeriod.objects
            .select_for_update()
            .get(
                pk=period.pk,
            )
        )

        if period.status == PeriodStatus.CLOSED:
            raise ValidationError(
                "Accounting period is already closed."
            )

        if period.status != PeriodStatus.CLOSING:
            raise ValidationError(
                "Period must be in closing state "
                "before closing."
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
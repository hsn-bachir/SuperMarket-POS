from django.core.exceptions import ValidationError
from apps.accounting.models import AccountingPeriod
from apps.common.enums import (
    PeriodStatus
)

class PeriodService:

    @staticmethod
    def validate_open_period(date):

        period = (
            AccountingPeriod.objects
            .filter(
                start_date__lte=date,
                end_date__gte=date,
            )
            .first()
        )


        if not period:

            raise ValidationError(
                "No accounting period exists."
            )


        if period.status == PeriodStatus.CLOSED:

            raise ValidationError(
                "Accounting period is closed."
            )


        return period
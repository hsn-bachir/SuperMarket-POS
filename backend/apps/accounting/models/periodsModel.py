from django.core.exceptions import ValidationError
from django.db import models
from django.conf import settings
from apps.common.enums import PeriodStatus

class AccountingPeriod(models.Model):
    name = models.CharField(
        max_length=50,
        unique=True,
    )

    start_date = models.DateField()

    end_date = models.DateField()

    status = models.CharField(
        max_length=10,
        choices=PeriodStatus.choices,
        default=PeriodStatus.OPEN,
    )

    closed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    closed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="closed_accounting_periods",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["start_date"]
        verbose_name = "Accounting Period"
        verbose_name_plural = "Accounting Periods"

    def __str__(self):
        return self.name

    def clean(self):
        super().clean()

        if self.start_date >= self.end_date:
            raise ValidationError(
                "End date must be after start date."
            )

        overlap = AccountingPeriod.objects.filter(
            start_date__lte=self.end_date,
            end_date__gte=self.start_date,
        ).exclude(pk=self.pk)

        if overlap.exists():
            raise ValidationError(
                "Accounting periods cannot overlap."
            )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def is_open(self):
        return self.status == PeriodStatus.OPEN


    @property
    def is_closed(self):
        return self.status == PeriodStatus.CLOSED


    @property
    def is_closing(self):
        return self.status == PeriodStatus.CLOSING

    @property
    def fiscal_year(self):
        return self.start_date.year
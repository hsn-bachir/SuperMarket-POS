from django.db import models

from apps.common.enums import Currency


class SystemSettings(models.Model):

    company_name = models.CharField(
        max_length=255,
        default="ERP POS"
    )

    address = models.TextField(
        blank=True
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
    )

    base_currency = models.CharField(
        max_length=3,
        choices=Currency.choices,
        default=Currency.USD,
    )

    exchange_rate = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=90000,
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def save(self, *args, **kwargs):
        # Force singleton record
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        """
        Always return the single settings object.
        Creates it if it doesn't exist.
        """
        obj, _ = cls.objects.get_or_create(
            pk=1,
            defaults={
                "company_name": "ERP POS",
                "base_currency": Currency.USD,
                "exchange_rate": 90000,
            }
        )
        return obj

    class Meta:
        verbose_name = "System Settings"
        verbose_name_plural = "System Settings"

    def __str__(self):
        return "System Settings"
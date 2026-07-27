from django.db import models


class DocumentSequence(models.Model):
    code = models.CharField(
        max_length=30,
        unique=True,
    )

    prefix = models.CharField(
        max_length=20,
    )

    last_number = models.PositiveIntegerField(
        default=0,
    )

    padding = models.PositiveSmallIntegerField(
        default=6,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["code"]
        verbose_name = "Document Sequence"
        verbose_name_plural = "Document Sequences"

    def __str__(self):
        return f"{self.code} ({self.prefix})"


class TimeStampedModel(models.Model):

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        abstract = True
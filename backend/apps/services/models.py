from django.db import models


class Service(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class ServicePriceHistory(models.Model):
    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name="price_history",
    )

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    effective_from = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-effective_from"]

    def __str__(self):
        return f"{self.service.name} - {self.price}"
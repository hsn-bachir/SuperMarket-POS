from django.db import models

class Report(models.Model):
    class Meta:
        managed = False
        default_permissions = ("view",)
        permissions = [
            ("view_reports", "Can view reports"),
        ]
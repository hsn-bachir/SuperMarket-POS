from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("purchases", "0004_purchase_total_amount"),
    ]

    operations = [
        migrations.AddField(
            model_name="purchase",
            name="status",
            field=models.CharField(
                choices=[("ACTIVE", "Active"), ("CANCELLED", "Cancelled")],
                default="ACTIVE",
                max_length=10,
            ),
        ),
    ]
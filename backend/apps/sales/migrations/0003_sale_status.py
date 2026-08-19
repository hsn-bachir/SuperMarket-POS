from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("sales", "0002_alter_sale_payment_method"),
    ]

    operations = [
        migrations.AddField(
            model_name="sale",
            name="status",
            field=models.CharField(
                choices=[("ACTIVE", "Active"), ("CANCELLED", "Cancelled")],
                default="ACTIVE",
                max_length=10,
            ),
        ),
    ]
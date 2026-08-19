from django.db import migrations, models
from django.db.models import Q


class Migration(migrations.Migration):

    dependencies = [
        ("accounting", "0005_alter_payment_status"),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name="journalline",
            name="valid_debit_credit",
        ),
        migrations.AddConstraint(
            model_name="journalline",
            constraint=models.CheckConstraint(
                check=(
                    Q(debit__gte=0)
                    & Q(credit__gte=0)
                    & (Q(debit__gt=0) | Q(credit__gt=0))
                ),
                name="valid_debit_credit",
            ),
        ),
    ]
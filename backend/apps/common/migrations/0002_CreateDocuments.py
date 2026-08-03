from django.db import migrations

def create_sequences(apps, schema_editor):
    DocumentSequence = apps.get_model(
        "common",
        "DocumentSequence",
    )

    sequences = [
        ("SALE", "SAL"),
        ("PURCHASE", "PUR"),
        ("PAYMENT", "PAY"),
    ]

    for code, prefix in sequences:
        DocumentSequence.objects.get_or_create(
            code=code,
            defaults={
                "prefix": prefix,
                "padding": 6,
                "last_number": 0,
            },
        )

class Migration(migrations.Migration):

    dependencies = [
        ("common", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_sequences),
    ]
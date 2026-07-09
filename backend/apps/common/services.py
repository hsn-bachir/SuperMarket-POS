from django.db import transaction

from .models import DocumentSequence


@transaction.atomic
def get_next_document_number(code):
    sequence = (
        DocumentSequence.objects
        .select_for_update()
        .get(code=code)
    )

    sequence.last_number += 1
    sequence.save(update_fields=[
        "last_number",
        "updated_at",
    ])

    return (
        f"{sequence.prefix}-"
        f"{sequence.last_number:0{sequence.padding}d}"
    )
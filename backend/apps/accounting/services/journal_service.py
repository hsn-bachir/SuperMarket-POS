from decimal import Decimal

from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.db import transaction

from apps.accounting.models import (
    JournalEntry,
    JournalLine,
)


class JournalService:

    @staticmethod
    @transaction.atomic
    def create_entry(
        *,
        date,
        journal_type,
        description,
        created_by,
        lines,
        reference=None,
    ):

        # Create journal header
        entry = JournalEntry.objects.create(
            date=date,
            journal_type=journal_type,
            description=description,
            created_by=created_by,
        )


        # Attach generic reference if exists
        if reference:

            entry.content_type = (
                ContentType.objects
                .get_for_model(reference)
            )

            entry.object_id = reference.pk

            entry.save()


        # Create journal lines
        for line in lines:

            JournalLine.objects.create(

                journal_entry=entry,

                account=line["account"],

                debit=line.get(
                    "debit",
                    Decimal("0.00")
                ),

                credit=line.get(
                    "credit",
                    Decimal("0.00")
                ),

                description=line.get(
                    "description",
                    ""
                ),
            )


        # Ensure accounting equation
        JournalService.validate_balance(entry)


        return entry



    @staticmethod
    def validate_balance(entry):

        debit = sum(
            (
                line.debit
                for line in entry.lines.all()
            ),
            Decimal("0.00")
        )


        credit = sum(
            (
                line.credit
                for line in entry.lines.all()
            ),
            Decimal("0.00")
        )


        if debit != credit:

            raise ValidationError(
                {
                    "journal": (
                        "Journal entry is not balanced."
                    ),
                    "debit": debit,
                    "credit": credit,
                }
            )


        return True
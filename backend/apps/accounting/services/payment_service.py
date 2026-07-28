from django.core.exceptions import ValidationError
from django.db import transaction

from apps.accounting.services.posting_service import AccountingPostingService
from apps.accounting.models import Payment
from apps.common.enums import PaymentStatus


class PaymentService:

    @staticmethod
    def generate_number():

        last_payment = (
            Payment.objects
            .order_by("-id")
            .first()
        )

        if not last_payment:
            return "PAY-000001"

        last_number = int(
            last_payment.number.split("-")[1]
        )

        return f"PAY-{last_number + 1:06d}"


    @staticmethod
    @transaction.atomic
    def create_payment(
        *,
        date,
        payment_type,
        payment_method,
        amount,
        reference,
        created_by,
        external_reference="",
        description="",
    ):

        if amount <= 0:
            raise ValidationError(
                {
                    "amount": (
                        "Payment amount must be greater than zero."
                    )
                }
            )

        payment = Payment.objects.create(
            number=PaymentService.generate_number(),
            date=date,
            payment_type=payment_type,
            payment_method=payment_method,
            amount=amount,
            reference=reference,
            external_reference=external_reference,
            description=description,
            status=PaymentStatus.DRAFT,
            created_by=created_by,
        )

        AccountingPostingService.post_payment(
            payment,
            created_by,
        )

        payment.status = PaymentStatus.POSTED

        payment.save(
            update_fields=[
                "status",
            ]
        )

        return payment


    @staticmethod
    @transaction.atomic
    def cancel_payment(
        payment,
        *,
        user,
    ):

        if payment.status == PaymentStatus.CANCELLED:
            raise ValidationError(
                {
                    "status": (
                        "Payment is already cancelled."
                    )
                }
            )

        AccountingPostingService.reverse_payment(
            payment,
            user,
        )

        payment.status = PaymentStatus.CANCELLED

        payment.save(
            update_fields=[
                "status",
            ]
        )

        return payment


    @staticmethod
    @transaction.atomic
    def delete_payment(payment):

        if payment.status != PaymentStatus.DRAFT:
            raise ValidationError(
                {
                    "status": (
                        "Only draft payments can be deleted."
                    )
                }
            )

        payment.delete()
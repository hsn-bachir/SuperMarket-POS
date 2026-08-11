from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import Sum

from apps.accounting.models import Expense, Payment
from apps.accounting.services.posting_service import (
    AccountingPostingService,
)

from apps.common.enums import (
    PaymentMethod,
    PaymentStatus,
)

from apps.purchases.models import Purchase
from apps.sales.models import Sale


class PaymentService:

    @staticmethod
    def get_outstanding_balance(reference):

        if isinstance(reference, Purchase):
            document_total = reference.total

        elif isinstance(reference, Sale):
            document_total = reference.total

        elif isinstance(reference, Expense):
            document_total = reference.amount

        else:
            raise ValidationError(
                {
                    "reference": (
                        "Unsupported payment reference type."
                    )
                }
            )

        content_type = ContentType.objects.get_for_model(
            reference
        )

        posted_payments = (
            Payment.objects
            .filter(
                content_type=content_type,
                object_id=reference.pk,
                status=PaymentStatus.POSTED,
            )
            .aggregate(
                total_paid=Sum("amount")
            )
        )

        total_paid = (
            posted_payments.get("total_paid")
            or 0
        )

        outstanding = (
            document_total
            - total_paid
        )

        return max(outstanding, 0)


    @staticmethod
    def generate_number():

        last_payment = (
            Payment.objects
            .order_by("-id")
            .first()
        )

        if not last_payment:
            return "PAY-000001"

        try:
            last_number = int(
                last_payment.number.split("-")[1]
            )

        except (IndexError, ValueError):
            last_number = last_payment.id

        return (
            f"PAY-{last_number + 1:06d}"
        )


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

        if not created_by or not created_by.has_perm(
            "accounting.add_payment"
        ):
            raise ValidationError(
                "User does not have permission "
                "to create payments."
            )

        if amount <= 0:
            raise ValidationError(
                {
                    "amount": (
                        "Payment amount must be "
                        "greater than zero."
                    )
                }
            )

        # Lock the referenced document
        locked_reference = (
            PaymentService._lock_reference(
                reference
            )
        )

        # Recalculate after locking
        outstanding_balance = (
            PaymentService.get_outstanding_balance(
                locked_reference
            )
        )

        if amount > outstanding_balance:
            raise ValidationError(
                {
                    "amount": (
                        "Payment exceeds the "
                        "outstanding balance."
                    )
                }
            )

        # CASH / CARD are actual payments.
        # CREDIT creates a pending obligation.
        if payment_method == PaymentMethod.CREDIT:

            status = PaymentStatus.PENDING

        else:

            status = PaymentStatus.DRAFT

        payment = Payment.objects.create(
            number=PaymentService.generate_number(),
            date=date,
            payment_type=payment_type,
            payment_method=payment_method,
            amount=amount,
            reference=locked_reference,
            external_reference=external_reference,
            description=description,
            status=status,
            created_by=created_by,
        )

        # Do NOT post a credit/pending payment.
        if status == PaymentStatus.DRAFT:

            AccountingPostingService.post_payment(
                payment,
                created_by,
            )

            payment.status = (
                PaymentStatus.POSTED
            )

            payment.save(
                update_fields=[
                    "status",
                ]
            )

        return payment


    @staticmethod
    @transaction.atomic
    def pay_pending_payment(
        *,
        payment,
        payment_method,
        user,
    ):

        if not user.has_perm(
            "accounting.change_payment"
        ):
            raise ValidationError(
                "User does not have permission "
                "to pay payments."
            )

        if payment.status != PaymentStatus.PENDING:
            raise ValidationError(
                {
                    "status": (
                        "Only pending payments "
                        "can be paid."
                    )
                }
            )

        if payment_method not in (
            PaymentMethod.CASH,
            PaymentMethod.CARD,
        ):
            raise ValidationError(
                {
                    "payment_method": (
                        "Payment must be made "
                        "using cash or card."
                    )
                }
            )

        # Lock the reference document.
        reference = payment.reference

        locked_reference = (
            PaymentService._lock_reference(
                reference
            )
        )

        # Check outstanding balance again.
        outstanding_balance = (
            PaymentService.get_outstanding_balance(
                locked_reference
            )
        )

        if payment.amount > outstanding_balance:
            raise ValidationError(
                {
                    "amount": (
                        "This payment exceeds "
                        "the remaining outstanding "
                        "balance."
                    )
                }
            )

        # Change CREDIT → actual payment method
        payment.payment_method = payment_method

        # Temporarily move to DRAFT before posting.
        payment.status = PaymentStatus.DRAFT

        payment.save(
            update_fields=[
                "payment_method",
                "status",
            ]
        )

        # Create accounting entry.
        AccountingPostingService.post_payment(
            payment,
            user,
        )

        # Mark as completed.
        payment.status = PaymentStatus.POSTED

        payment.save(
            update_fields=[
                "status",
            ]
        )

        return payment


    @staticmethod
    def _lock_reference(reference):

        if isinstance(reference, Purchase):

            return (
                Purchase.objects
                .select_for_update()
                .get(pk=reference.pk)
            )

        if isinstance(reference, Sale):

            return (
                Sale.objects
                .select_for_update()
                .get(pk=reference.pk)
            )

        if isinstance(reference, Expense):

            return (
                Expense.objects
                .select_for_update()
                .get(pk=reference.pk)
            )

        return reference


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
                        "Payment is already "
                        "cancelled."
                    )
                }
            )

        if payment.status != PaymentStatus.POSTED:
            raise ValidationError(
                {
                    "status": (
                        "Only posted payments "
                        "can be cancelled."
                    )
                }
            )

        AccountingPostingService.reverse_payment(
            payment,
            user,
        )

        payment.status = (
            PaymentStatus.CANCELLED
        )

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
                        "Only draft payments "
                        "can be deleted."
                    )
                }
            )

        payment.delete()
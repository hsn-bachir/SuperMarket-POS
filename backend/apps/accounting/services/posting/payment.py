from apps.accounting.services.journal_service import JournalService
from apps.common.enums import JournalType, PaymentMethod, PaymentStatus, PaymentType
from .base import BasePostingService, money


class PaymentPostingService(BasePostingService):

    @classmethod
    def _resolve_payment_account(cls, payment, accounts):
        if payment.payment_method == PaymentMethod.CASH:
            return accounts["cash"]
        if payment.payment_method in (PaymentMethod.CARD, PaymentMethod.TRANSFER):
            return accounts["bank"]

        raise ValueError("Payments cannot be made using CREDIT.")

    @classmethod
    def post(cls, payment, user):
        accounts = cls.get_accounts()
        payment_account = cls._resolve_payment_account(payment, accounts)
        amount = money(payment.amount)

        if payment.payment_type in (PaymentType.SUPPLIER, PaymentType.EXPENSE):
            lines = [
                {"account": accounts["payable"], "debit": amount},
                {"account": payment_account, "credit": amount},
            ]
        elif payment.payment_type == PaymentType.CUSTOMER:
            lines = [
                {"account": payment_account, "debit": amount},
                {"account": accounts["receivable"], "credit": amount},
            ]
        else:
            raise ValueError("Invalid payment type.")

        payment.status = PaymentStatus.POSTED
        payment.save()

        return JournalService.create_entry(
            date=payment.date,
            journal_type=JournalType.PAYMENT,
            description=f"Payment #{payment.number}",
            reference=payment,
            created_by=user,
            lines=lines,
        )

    @classmethod
    def reverse(cls, payment, user):
        accounts = cls.get_accounts()
        payment_account = cls._resolve_payment_account(payment, accounts)
        amount = money(payment.amount)

        if payment.payment_type in (PaymentType.SUPPLIER, PaymentType.EXPENSE):
            lines = [
                {"account": payment_account, "debit": amount},
                {"account": accounts["payable"], "credit": amount},
            ]
        elif payment.payment_type == PaymentType.CUSTOMER:
            lines = [
                {"account": accounts["receivable"], "debit": amount},
                {"account": payment_account, "credit": amount},
            ]
        else:
            raise ValueError("Invalid payment type.")

        return JournalService.create_entry(
            date=payment.date,
            journal_type=JournalType.PAYMENT,
            description=f"Reverse Payment #{payment.number}",
            reference=payment,
            created_by=user,
            lines=lines,
        )
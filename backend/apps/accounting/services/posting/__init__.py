from .sale import SalePostingService
from .purchase import PurchasePostingService
from .expense import ExpensePostingService
from .payment import PaymentPostingService


class AccountingPostingService:
    """Facade class to preserve backwards compatibility across your project."""

    # Sales
    post_sale = staticmethod(SalePostingService.post)
    reverse_sale = staticmethod(SalePostingService.reverse)

    # Purchases
    post_purchase = staticmethod(PurchasePostingService.post)
    reverse_purchase = staticmethod(PurchasePostingService.reverse)

    # Expenses
    post_expense = staticmethod(ExpensePostingService.post)
    reverse_expense = staticmethod(ExpensePostingService.reverse)

    # Payments
    post_payment = staticmethod(PaymentPostingService.post)
    reverse_payment = staticmethod(PaymentPostingService.reverse)


__all__ = [
    "AccountingPostingService",
    "SalePostingService",
    "PurchasePostingService",
    "ExpensePostingService",
    "PaymentPostingService",
]
from django.db import models

class Currency(models.TextChoices):
    USD = "USD", "USD"
    LBP = "LBP", "LBP"


class MovementType(models.TextChoices):
    PURCHASE = "PURCHASE", "Purchase"
    SALE = "SALE", "Sale"
    ADJUSTMENT = "ADJUSTMENT", "Adjustment"
    PURCHASE_RETURN = "PURCHASE_RETURN", "Purchase Return"
    SALE_RETURN = "SALE_RETURN", "Sale Return"

class PaymentMethod(models.TextChoices):
    CASH = "CASH", "Cash"
    CARD = "CARD", "Card"
    TRANSFER = "TRANSFER", "Bank Transfer"
    CREDIT = "CREDIT", "Credit"

class AccountType(models.TextChoices):
    ASSET = "ASSET", "Asset"
    LIABILITY = "LIABILITY", "Liability"
    EQUITY = "EQUITY", "Equity"
    REVENUE = "REVENUE", "Revenue"
    EXPENSE = "EXPENSE", "Expense"

class NormalBalance(models.TextChoices):
    DEBIT = "DEBIT", "Debit"
    CREDIT = "CREDIT", "Credit"

class JournalType(models.TextChoices):
    GENERAL = "GENERAL", "General"
    SALES = "SALES", "Sales"
    PURCHASE = "PURCHASE", "Purchase"
    CASH_RECEIPT = "CASH_RECEIPT", "Cash Receipt"
    CASH_PAYMENT = "CASH_PAYMENT", "Cash Payment"
    ADJUSTMENT = "ADJUSTMENT", "Adjustment"
    EXPENSE = "EXPENSE", "Expense"
    PAYMENT = "PAYMENT", "Payment"
    CLOSING = "CLOSING", "Closing"

class ReferenceType(models.TextChoices):
    SALE = "SALE", "Sale"
    PURCHASE = "PURCHASE", "Purchase"
    EXPENSE = "EXPENSE", "Expense"
    PAYMENT = "PAYMENT", "Payment"
    ADJUSTMENT = "ADJUSTMENT", "Adjustment"
    OPENING_BALANCE = "OPENING_BALANCE", "Opening Balance"

class EntryStatus(models.TextChoices):
    DRAFT = "DRAFT", "Draft"
    POSTED = "POSTED", "Posted"
    CANCELLED = "CANCELLED", "Cancelled"

class ExpenseStatus(models.TextChoices):
    DRAFT = "DRAFT", "Draft"
    POSTED = "POSTED", "Posted"
    CANCELLED = "CANCELLED", "Cancelled"

class PaymentStatus(models.TextChoices):
    DRAFT = "DRAFT", "Draft"
    POSTED = "POSTED", "Posted"
    CANCELLED = "CANCELLED", "Cancelled"

class PaymentType(models.TextChoices):
    CUSTOMER = "CUSTOMER", "Customer"
    SUPPLIER = "SUPPLIER", "Supplier"
    EXPENSE = "EXPENSE", "Expense"

class CashFlowCategory(models.TextChoices):

    OPERATING = (
        "OPERATING",
        "Operating Activities"
    )

    INVESTING = (
        "INVESTING",
        "Investing Activities"
    )

    FINANCING = (
        "FINANCING",
        "Financing Activities"
    )

    NONE = (
        "NONE",
        "None"
    )

class PeriodStatus(models.TextChoices):
    OPEN = "OPEN", "Open"
    CLOSING = "CLOSING", "Closing"
    CLOSED = "CLOSED", "Closed"
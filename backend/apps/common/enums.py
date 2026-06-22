from django.db import models


class Currency(models.TextChoices):
    USD = "USD", "USD"
    LBP = "LBP", "LBP"


class MovementType(models.TextChoices):
    PURCHASE = "PURCHASE", "Purchase"
    SALE = "SALE", "Sale"
    RETURN = "RETURN", "Return"
    ADJUSTMENT = "ADJUSTMENT", "Adjustment"


class PaymentMethod(models.TextChoices):
    CASH = "CASH", "Cash"
    CARD = "CARD", "Card"
    TRANSFER = "TRANSFER", "Transfer"
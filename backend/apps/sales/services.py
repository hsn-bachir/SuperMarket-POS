from decimal import Decimal
from django.db import transaction
from apps.sales.models import Sale
from apps.sales.models import SaleItem
from apps.inventory.services import (
    validate_stock,
    remove_sale_stock,
)


@transaction.atomic
def create_sale(*,invoice_number,currency,exchange_rate,payment_method,sale_date,items,user):
    if not user.has_perm("sales.add_sale"):
        raise PermissionError("User not allowed to create sales")
    if not items:
        raise ValueError("Purchase must contain at least one item")

    total = Decimal("0")
    for item in items:
        if item["product"] is None:
            raise ValueError("Product cannot be None")
        quantity = item["quantity"]
        if quantity <= 0:
            raise ValueError("Quantity must be greater than zero")
        if item["unit_price"] <= 0:
            raise ValueError("Unit price must be greater than zero")
        validate_stock(
            item["product"],
            quantity
        )
        total += Decimal(quantity) * item["unit_price"]

    sale = Sale.objects.create(
        invoice_number=invoice_number,
        currency=currency,
        exchange_rate=exchange_rate,
        payment_method=payment_method,
        sale_date=sale_date,
        total=total,
    )

    for item in items:
        quantity = item["quantity"]
        sale_item = SaleItem.objects.create(
            sale=sale,
            product=item["product"],
            quantity=quantity,
            unit_price=item["unit_price"],
            cost_price=item["product"].cost_price,
        )
        remove_sale_stock(
            product=item["product"],
            quantity=quantity,
            sale_item=sale_item,
        )
    return sale
from django.db import transaction
from apps.purchases.models import Purchase
from apps.purchases.models import PurchaseItem
from decimal import Decimal

from apps.inventory.services import (
    add_purchase_stock,
    remove_purchase_stock,
    get_stock,
    recalculate_average_cost,
)

from apps.common.services import get_next_document_number
from apps.configuration.services import get_exchange_rate
from apps.common.enums import Currency
from apps.accounting.services.posting_service import AccountingPostingService


@transaction.atomic
def create_purchase(*,supplier,currency,exchange_rate=None,payment_method,purchase_date,items,user):
    if not user.has_perm("purchases.add_purchase"):
        raise PermissionError("Not allowed")
    if supplier is None:
        raise ValueError("Supplier cannot be None")
    if not items:
        raise ValueError("Purchase must contain at least one item")
    if exchange_rate is None:
        exchange_rate = get_exchange_rate()
    exchange_rate = Decimal(exchange_rate)
    if exchange_rate <= 0:
        raise ValueError("Exchange rate must be greater than zero")
    
    purchase = Purchase.objects.create(
        supplier=supplier,
        invoice_number=get_next_document_number("PURCHASE"),
        currency=currency,
        exchange_rate=exchange_rate,
        payment_method=payment_method,
        purchase_date=purchase_date,
    )

    for item in items:
        if item["product"] is None:
            raise ValueError("Product cannot be None")
        
        cost_price = Decimal(item["cost_price"])
        if cost_price <= 0:
            raise ValueError("Cost price must be greater than zero")
        if currency == Currency.LBP:
            cost_price/=exchange_rate
        
        quantity = item["quantity"]
        if quantity <= 0:
            raise ValueError("Quantity must be greater than zero")
        
        product = item["product"]
        current_stock = get_stock(product)
        current_inventory_value = (
            Decimal(current_stock)
            * product.cost_price
        )
        purchase_value = (
            Decimal(quantity)
            * cost_price
        )

        new_stock = current_stock + quantity
        new_average_cost = (
            current_inventory_value +
            purchase_value
        ) / Decimal(new_stock)

        product.cost_price = new_average_cost
        product.save(
            update_fields=["cost_price"]
        )

        purchase_item = PurchaseItem.objects.create(
            purchase=purchase,
            product=item["product"],
            quantity=quantity,
            cost_price=cost_price,
        )
        add_purchase_stock(
            product=item["product"],
            quantity=quantity,
            purchase_item=purchase_item,
            user=user,
        )

        AccountingPostingService.post_purchase(
    purchase=purchase,
    user=user,
)
    return purchase

@transaction.atomic
def delete_purchase(*, purchase, user):

    if not user.has_perm("purchases.delete_purchase"):
        raise PermissionError("Not allowed")

    affected_products = set()

    # Validation
    for item in purchase.items.all():

        current_stock = get_stock(item.product)

        if current_stock < item.quantity:
            raise ValueError(
                f"Cannot cancel purchase of "
                f"{item.product.name}. "
                f"Some of the purchased stock has already been sold."
            )

        affected_products.add(item.product)

    # Reverse inventory movements
    for item in purchase.items.all():

        remove_purchase_stock(
            product=item.product,
            quantity=item.quantity,
            purchase_item=item,
            user=user,
        )

        AccountingPostingService.reverse_purchase(
    purchase=purchase,
    user=user,
)
    # Delete purchase (PurchaseItems are deleted by CASCADE)
    purchase.delete()

    # Recalculate once per product
    for product in affected_products:
        recalculate_average_cost(product)
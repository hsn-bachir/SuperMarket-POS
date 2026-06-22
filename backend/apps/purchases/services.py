from django.db import transaction
from apps.purchases.models import Purchase
from apps.purchases.models import PurchaseItem
from apps.inventory.services import add_purchase_stock


@transaction.atomic
def create_purchase(*,supplier,invoice_number,currency,exchange_rate,purchase_date,items,):
    if supplier is None:
        raise ValueError("Supplier cannot be None")

    if not items:
        raise ValueError("Purchase must contain at least one item")
    
    purchase = Purchase.objects.create(
        supplier=supplier,
        invoice_number=invoice_number,
        currency=currency,
        exchange_rate=exchange_rate,
        purchase_date=purchase_date,
    )

    for item in items:
        if item["product"] is None:
            raise ValueError("Product cannot be None")
        
        cost_price = item["cost_price"]
        if cost_price <= 0:
            raise ValueError("Cost price must be greater than zero")
        
        quantity = item["quantity"]
        if quantity <= 0:
            raise ValueError("Quantity must be greater than zero")

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
        )
    return purchase
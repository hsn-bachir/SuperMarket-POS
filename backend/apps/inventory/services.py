from django.db.models import Sum
from apps.inventory.models import InventoryMovement
from apps.common.enums import MovementType


def create_inventory_movement(
    *,
    product,
    movement_type,
    quantity,
    reference_type,
    reference_id,
    reason="",
    user,
):
    if not user.has_perm("inventory.add_inventorymovement"):
        raise PermissionError("Not allowed")

    if product is None:
        raise ValueError("Product cannot be None")

    return InventoryMovement.objects.create(
        product=product,
        movement_type=movement_type,
        quantity=quantity,
        reason=reason,
        reference_type=reference_type,
        reference_id=reference_id,
    )


def add_purchase_stock(*, product, quantity, purchase_item, user):
    if product is None:
        raise ValueError("Product cannot be None")

    return create_inventory_movement(
        product=product,
        movement_type=MovementType.PURCHASE,
        quantity=quantity,
        reference_type="PURCHASE",
        reference_id=purchase_item.id,
        reason="Stock added from purchase",
        user=user,
    )

def remove_purchase_stock(*, product, quantity, purchase_item, user):
    if product is None:
        raise ValueError("Product cannot be None")

    return create_inventory_movement(
        product=product,
        movement_type=MovementType.ADJUSTMENT,
        quantity=-quantity,
        reference_type="PURCHASE_DELETE",
        reference_id=purchase_item.id,
        reason="Stock removed due to purchase deletion",
        user=user,
    )

def remove_sale_stock(*, product, quantity, sale_item, user):
    if product is None:
        raise ValueError("Product cannot be None")

    return create_inventory_movement(
        product=product,
        movement_type=MovementType.SALE,
        quantity=-quantity,
        reference_type="SALE",
        reference_id=sale_item.id,
        reason="Stock decreased due to sale",
        user=user,
    )


def get_stock(product):
    if product is None:
        raise ValueError("Product cannot be None")
    result = (
        InventoryMovement.objects
        .filter(product=product)
        .aggregate(total=Sum("quantity"))
    )
    return result["total"] or 0


def get_stock_as_of(product, as_of_date):
    if product is None:
        raise ValueError("Product cannot be None")

    result = (
        InventoryMovement.objects
        .filter(product=product, created_at__date__lte=as_of_date)
        .aggregate(total=Sum("quantity"))
    )
    return result["total"] or 0


def validate_stock(product, quantity):
    if quantity <= 0:
        raise ValueError("Quantity must be greater than zero")
    stock = get_stock(product)
    if stock < quantity:
        raise ValueError(
            f"Not enough stock for {product.name}. "
            f"Available={stock}, Requested={quantity}"
        )
    return True

from .services import get_stock

def create_adjustment(product, quantity, reason, user):
    if not user.has_perm("inventory.add_inventorymovement"):
        raise PermissionError("Not allowed")

    if product is None:
        raise ValueError("Product cannot be None")

    if quantity == 0:
        raise ValueError("Adjustment cannot be zero")

    current_stock = get_stock(product)

    if current_stock + quantity < 0:
        raise ValueError(
            f"Cannot adjust stock below zero. "
            f"Current stock: {current_stock}"
        )

    return InventoryMovement.objects.create(
        product=product,
        movement_type=MovementType.ADJUSTMENT,
        quantity=quantity,
        reference_type="ADJUSTMENT",
        reason=reason,
    )

from decimal import Decimal

from apps.purchases.models import Purchase, PurchaseItem


def recalculate_average_cost(product):
    purchase_items = (
        PurchaseItem.objects
        .filter(product=product)
        .filter(purchase__status=Purchase.STATUS_ACTIVE)
        .select_related("purchase")
    )

    total_quantity = 0
    total_value = Decimal("0")

    for item in purchase_items:
        total_quantity += item.quantity
        total_value += (
            Decimal(item.quantity)
            * item.cost_price
        )

    if total_quantity == 0:
        product.cost_price = Decimal("0")
    else:
        product.cost_price = (
            total_value /
            Decimal(total_quantity)
        )

    product.save(update_fields=["cost_price"])


def get_average_cost_as_of(product, as_of_date):
    purchase_items = (
        PurchaseItem.objects
        .filter(
            product=product,
            purchase__status=Purchase.STATUS_ACTIVE,
            purchase__purchase_date__lte=as_of_date,
        )
    )

    total_quantity = 0
    total_value = Decimal("0")

    for item in purchase_items:
        total_quantity += item.quantity
        total_value += Decimal(item.quantity) * item.cost_price

    if total_quantity == 0:
        return Decimal("0")

    return total_value / Decimal(total_quantity)
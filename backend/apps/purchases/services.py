from decimal import Decimal
from django.db import transaction
from django.contrib.contenttypes.models import ContentType

from apps.purchases.models import Purchase, PurchaseItem

from apps.inventory.services import (
    add_purchase_stock,
    remove_purchase_stock,
    get_stock,
    recalculate_average_cost,
)

from apps.common.services import get_next_document_number
from apps.configuration.services import get_exchange_rate

from apps.common.enums import (
    Currency,
    PaymentMethod,
    PaymentStatus,
    PaymentType,
)

from apps.accounting.models import Payment
from apps.accounting.services.posting_service import (
    AccountingPostingService,
)


@transaction.atomic
def create_purchase(
    *,
    supplier,
    currency,
    exchange_rate=None,
    payment_method,
    purchase_date,
    items,
    user,
):
    if not user.has_perm("purchases.add_purchase"):
        raise PermissionError("Not allowed")

    if supplier is None:
        raise ValueError("Supplier cannot be None")

    if not items:
        raise ValueError(
            "Purchase must contain at least one item"
        )

    if exchange_rate is None:
        exchange_rate = get_exchange_rate()

    exchange_rate = Decimal(str(exchange_rate))

    if exchange_rate <= 0:
        raise ValueError(
            "Exchange rate must be greater than zero"
        )

    purchase = Purchase.objects.create(
        supplier=supplier,
        invoice_number=get_next_document_number(
            "PURCHASE"
        ),
        currency=currency,
        exchange_rate=exchange_rate,
        payment_method=payment_method,
        purchase_date=purchase_date,
        total_amount=Decimal("0"),
    )

    total_amount = Decimal("0")

    for item in items:

        product = item["product"]

        if product is None:
            raise ValueError(
                "Product cannot be None"
            )

        cost_price = Decimal(
            str(item["cost_price"])
        )

        if cost_price <= 0:
            raise ValueError(
                "Cost price must be greater than zero"
            )

        if currency == Currency.LBP:
            cost_price /= exchange_rate

        quantity = item["quantity"]

        if quantity <= 0:
            raise ValueError(
                "Quantity must be greater than zero"
            )

        current_stock = get_stock(product)

        current_inventory_value = (
            Decimal(current_stock)
            * product.cost_price
        )

        purchase_value = (
            Decimal(quantity)
            * cost_price
        )

        total_amount += purchase_value

        new_stock = (
            current_stock
            + quantity
        )

        if new_stock <= 0:
            raise ValueError(
                "Invalid stock calculation"
            )

        new_average_cost = (
            current_inventory_value
            + purchase_value
        ) / Decimal(new_stock)

        product.cost_price = (
            new_average_cost
        )

        product.save(
            update_fields=[
                "cost_price"
            ]
        )

        purchase_item = (
            PurchaseItem.objects.create(
                purchase=purchase,
                product=product,
                quantity=quantity,
                cost_price=cost_price,
            )
        )

        add_purchase_stock(
            product=product,
            quantity=quantity,
            purchase_item=purchase_item,
            user=user,
        )

    purchase.total_amount = total_amount
    purchase.save(
        update_fields=[
            "total_amount"
        ]
    )

    # Dr Inventory
    # Cr Accounts Payable

    AccountingPostingService.post_purchase(
        purchase=purchase,
        user=user,
    )

    # Immediate supplier payment
    # CASH / CARD only

    if purchase.payment_method in (
        PaymentMethod.CASH,
        PaymentMethod.CARD,
    ):
        payment = Payment.objects.create(
            number=get_next_document_number(
        "PAYMENT"
    ),
            payment_type=PaymentType.SUPPLIER,
            amount=purchase.total_amount,
            payment_method=(
                purchase.payment_method
            ),
            date=purchase.purchase_date,
            content_type=(
                ContentType.objects.get_for_model(
                    Purchase
                )
            ),
            object_id=purchase.id,
            description=(
                f"Payment for purchase "
                f"#{purchase.invoice_number}"
            ),
            created_by=user,
        )

        AccountingPostingService.post_payment(
            payment=payment,
            user=user,
        )

    elif purchase.payment_method == PaymentMethod.CREDIT:
        payment = Payment.objects.create(
        number=get_next_document_number("PAYMENT"),
        payment_type=PaymentType.SUPPLIER,
        amount=purchase.total_amount,
        payment_method=PaymentMethod.CREDIT,
        status=PaymentStatus.PENDING,
        date=purchase.purchase_date,
        content_type=ContentType.objects.get_for_model(
            Purchase
        ),
        object_id=purchase.id,
        description=(
            f"Pending payment for purchase "
            f"#{purchase.invoice_number}"
        ),
        created_by=user,
    )

    return purchase

@transaction.atomic
def delete_purchase(
    *,
    purchase,
    user,
):

    if not user.has_perm(
        "purchases.delete_purchase"
    ):
        raise PermissionError(
            "Not allowed"
        )


    affected_products = set()


    # Check stock before deleting

    for item in purchase.items.all():

        current_stock = get_stock(
            item.product
        )


        if current_stock < item.quantity:

            raise ValueError(
                f"Cannot cancel purchase of "
                f"{item.product.name}. "
                f"Some purchased stock was already sold."
            )


        affected_products.add(
            item.product
        )



    # Reverse inventory

    for item in purchase.items.all():

        remove_purchase_stock(
            product=item.product,
            quantity=item.quantity,
            purchase_item=item,
            user=user,
        )



    # Reverse purchase journal

    AccountingPostingService.reverse_purchase(
        purchase=purchase,
        user=user,
    )



    # Reverse all payments linked to this purchase

    purchase_content_type = (
        ContentType.objects.get_for_model(
            Purchase
        )
    )


    payments = Payment.objects.filter(
        content_type=purchase_content_type,
        object_id=purchase.id,
    )


    for payment in payments:

        AccountingPostingService.reverse_payment(
            payment=payment,
            user=user,
        )

        payment.status = PaymentStatus.CANCELLED
        payment.save(
            update_fields=["status"]
        )



    purchase.delete()



    # Recalculate average costs

    for product in affected_products:

        recalculate_average_cost(
            product
        )
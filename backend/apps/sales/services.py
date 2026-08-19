from decimal import Decimal

from django.db import transaction
from django.core.exceptions import ValidationError
from django.contrib.contenttypes.models import ContentType

from apps.sales.models import Sale, SaleItem

from apps.inventory.services import (
    validate_stock,
    remove_sale_stock,
    create_inventory_movement,
)

from apps.common.enums import (
    MovementType,
    PaymentMethod,
    PaymentType,
    PaymentStatus,
)

from apps.common.services import get_next_document_number
from apps.configuration.services import get_exchange_rate

from apps.accounting.models.paymentModel import Payment
from apps.accounting.services.posting.payment import PaymentPostingService
from apps.accounting.services.posting.sale import SalePostingService


@transaction.atomic
def create_sale(
    *,
    currency,
    exchange_rate=None,
    payment_method,
    sale_date,
    items,
    user,
):

    if not user.has_perm("sales.add_sale"):
        raise PermissionError(
            "User not allowed to create sales"
        )

    if not items:
        raise ValueError(
            "Sale must contain at least one item"
        )


    if exchange_rate is None:
        exchange_rate = get_exchange_rate()


    exchange_rate = Decimal(exchange_rate)

    if exchange_rate <= 0:
        raise ValueError(
            "Exchange rate must be greater than zero"
        )


    total = Decimal("0")


    for item in items:

        if item["product"] is None:
            raise ValueError(
                "Product cannot be None"
            )


        quantity = item["quantity"]

        if quantity <= 0:
            raise ValueError(
                "Quantity must be greater than zero"
            )


        unit_price = Decimal(
            item["unit_price"]
        )


        if unit_price <= 0:
            raise ValueError(
                "Unit price must be greater than zero"
            )


        validate_stock(
            item["product"],
            quantity
        )


        total += (
            Decimal(quantity)
            *
            unit_price
        )



    sale = Sale.objects.create(

        invoice_number=get_next_document_number(
            "SALE"
        ),

        currency=currency,

        exchange_rate=exchange_rate,

        payment_method=payment_method,

        sale_date=sale_date,

        total=total,
    )



    for item in items:

        sale_item = SaleItem.objects.create(

            sale=sale,

            product=item["product"],

            quantity=item["quantity"],

            unit_price=item["unit_price"],

            cost_price=item["product"].cost_price,
        )


        remove_sale_stock(

            product=item["product"],

            quantity=item["quantity"],

            sale_item=sale_item,

            user=user,
        )



    # Accounting:
    # Dr Cash/Receivable
    # Cr Sales
    # Dr COGS
    # Cr Inventory

    SalePostingService.post(
        sale=sale,
        user=user,
    )



    # Immediate payment
    # CASH / CARD only

    if payment_method in (
    PaymentMethod.CASH,
    PaymentMethod.CARD,
):
        payment = Payment.objects.create(
        number=get_next_document_number(
            "PAYMENT"
        ),
        payment_type=PaymentType.CUSTOMER,
        amount=sale.total,
        payment_method=payment_method,
        status=PaymentStatus.POSTED,
        date=sale.sale_date,
        content_type=ContentType.objects.get_for_model(
            Sale
        ),
        object_id=sale.id,
        description=(
            f"Payment for sale "
            f"#{sale.invoice_number}"
        ),
        created_by=user,
    )

        PaymentPostingService.post(
        payment=payment,
        user=user,
    )

    elif payment_method == PaymentMethod.CREDIT:
        payment = Payment.objects.create(
        number=get_next_document_number(
            "PAYMENT"
        ),
        payment_type=PaymentType.CUSTOMER,
        amount=sale.total,
        payment_method=PaymentMethod.CREDIT,
        status=PaymentStatus.PENDING,
        date=sale.sale_date,
        content_type=ContentType.objects.get_for_model(
            Sale
        ),
        object_id=sale.id,
        description=(
            f"Pending payment for sale "
            f"#{sale.invoice_number}"
        ),
        created_by=user,
    )

    return sale


@transaction.atomic
def delete_sale(
    *,
    sale,
    user,
):

    if not user.has_perm(
        "sales.delete_sale"
    ):
        raise PermissionError()

    if sale.status == Sale.STATUS_CANCELLED:
        raise ValidationError("Sale is already cancelled.")


    # Restore inventory

    for item in sale.items.all():

        create_inventory_movement(

            product=item.product,

            movement_type=MovementType.SALE_RETURN,

            quantity=item.quantity,

            reference_type="SALE_DELETE",

            reference_id=sale.id,

            user=user,
        )



    # Reverse accounting

    SalePostingService.reverse(
        sale=sale,
        user=user,
    )



    # Cancel payments linked to this sale

    sale_content_type = ContentType.objects.get_for_model(
        Sale
    )


    payments = Payment.objects.filter(

        content_type=sale_content_type,

        object_id=sale.id,
    )



    for payment in payments:
        if payment.status == PaymentStatus.PENDING:
            payment.status = PaymentStatus.CANCELLED
            payment.save(update_fields=["status"])
        elif payment.status == PaymentStatus.POSTED:
            PaymentPostingService.reverse(
                payment=payment,
                user=user,
            )
            payment.status = PaymentStatus.CANCELLED
            payment.save(update_fields=["status"])

    sale.status = Sale.STATUS_CANCELLED
    sale.save(update_fields=["status"])
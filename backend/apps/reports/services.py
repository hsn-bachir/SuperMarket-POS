from datetime import date
from decimal import Decimal

from django.db.models import (
    F,
    Sum,
    Max,
    Value,
    DecimalField,
    ExpressionWrapper,
)
from django.db.models.functions import Coalesce

from apps.products.models import Product
from apps.sales.models import Sale, SaleItem
from apps.inventory.services import get_stock


# ----------------------------------------------------
# Helpers
# ----------------------------------------------------

def apply_sale_filters(queryset, start_date=None, end_date=None):
    if start_date:
        queryset = queryset.filter(
            sale__sale_date__gte=start_date
        )

    if end_date:
        queryset = queryset.filter(
            sale__sale_date__lte=end_date
        )

    return queryset


def apply_sales_filters(queryset, start_date=None, end_date=None):
    if start_date:
        queryset = queryset.filter(
            sale_date__gte=start_date
        )

    if end_date:
        queryset = queryset.filter(
            sale_date__lte=end_date
        )

    return queryset


# ----------------------------------------------------
# Sales Aggregation
# ----------------------------------------------------

def get_sales_aggregation(
    *,
    start_date=None,
    end_date=None,
):

    qs = SaleItem.objects.all()

    qs = apply_sale_filters(
        qs,
        start_date,
        end_date,
    )

    return (
        qs.values(
            "product_id",
            "product__name",
            "product__minimum_stock",
        )
        .annotate(
            quantity_sold=Coalesce(
                Sum("quantity"),
                Value(0),
            )
        )
    )


# ----------------------------------------------------
# Stock
# ----------------------------------------------------

def get_stock_map():

    return {
        product.id: get_stock(product)
        for product in Product.objects.all()
    }


# ----------------------------------------------------
# Inventory Valuation
# ----------------------------------------------------

def get_inventory_valuation():

    results = []

    for product in Product.objects.filter(
        is_active=True
    ):

        stock = get_stock(product)

        inventory_value = (
            Decimal(stock)
            * product.cost_price
        )

        results.append({
            "product_id": product.id,
            "barcode": product.barcode,
            "category":
                product.category.name
                if product.category
                else None,
            "product_name": product.name,
            "stock": stock,
            "cost_price": product.cost_price,
            "inventory_value": inventory_value,
        })

    return results


# ----------------------------------------------------
# Inventory Summary
# ----------------------------------------------------

def get_inventory_summary():

    total_products = 0
    total_units = 0
    inventory_value = Decimal("0")

    for product in Product.objects.filter(
        is_active=True
    ):

        stock = get_stock(product)

        total_products += 1
        total_units += stock

        inventory_value += (
            Decimal(stock)
            * product.cost_price
        )

    return {
        "total_products": total_products,
        "total_units": total_units,
        "inventory_value": inventory_value,
    }


# ----------------------------------------------------
# COGS
# ----------------------------------------------------

def get_cogs_report(
    start_date=None,
    end_date=None,
):

    sales = apply_sales_filters(
        Sale.objects.all(),
        start_date,
        end_date,
    )

    sale_items = apply_sale_filters(
        SaleItem.objects.all(),
        start_date,
        end_date,
    )

    revenue = (
        sales.aggregate(
            total=Sum("total")
        )["total"]
        or Decimal("0")
    )

    cogs_expression = ExpressionWrapper(
        F("quantity") * F("cost_price"),
        output_field=DecimalField(
            max_digits=14,
            decimal_places=2,
        ),
    )

    cogs = (
        sale_items.aggregate(
            total=Sum(cogs_expression)
        )["total"]
        or Decimal("0")
    )

    gross_profit = revenue - cogs

    gross_margin = Decimal("0")

    if revenue > 0:
        gross_margin = (
            gross_profit
            / revenue
        ) * Decimal("100")

    return {
        "revenue": revenue,
        "cogs": cogs,
        "gross_profit": gross_profit,
        "gross_margin": gross_margin,
    }


# ----------------------------------------------------
# Profit & Loss
# ----------------------------------------------------

def get_profit_loss_report(
    start_date=None,
    end_date=None,
):

    cogs = get_cogs_report(
        start_date,
        end_date,
    )

    operating_expenses = Decimal("0")

    net_profit = (
        cogs["gross_profit"]
        - operating_expenses
    )

    net_margin = Decimal("0")

    if cogs["revenue"] > 0:

        net_margin = (
            net_profit
            / cogs["revenue"]
        ) * Decimal("100")

    return {
        "revenue": cogs["revenue"],
        "cogs": cogs["cogs"],
        "gross_profit": cogs["gross_profit"],
        "operating_expenses": operating_expenses,
        "net_profit": net_profit,
        "gross_margin": cogs["gross_margin"],
        "net_margin": net_margin,
    }


# ----------------------------------------------------
# Last Sale Map
# ----------------------------------------------------

def get_last_sale_map():

    rows = (
        SaleItem.objects
        .values("product_id")
        .annotate(
            last_sale_date=Max(
                "sale__sale_date"
            )
        )
    )

    return {
        row["product_id"]:
        row["last_sale_date"]
        for row in rows
    }


# ----------------------------------------------------
# Stock Aging
# ----------------------------------------------------

def get_stock_aging_report():

    stock_map = get_stock_map()

    last_sale_map = get_last_sale_map()

    today = date.today()

    results = []

    for product in Product.objects.filter(
        is_active=True
    ):

        stock = stock_map.get(
            product.id,
            0,
        )

        if stock <= 0:
            continue

        last_sale = last_sale_map.get(
            product.id
        )

        days = None

        if last_sale:
            days = (
                today
                - last_sale
            ).days

        inventory_value = (
            stock
            * product.cost_price
        )

        results.append({
            "product_id": product.id,
            "product_name": product.name,
            "minimum_stock": product.minimum_stock,
            "stock": stock,
            "inventory_value": inventory_value,
            "last_sale_date": last_sale,
            "days_since_last_sale": days,
        })

    return sorted(
        results,
        key=lambda x:
            x["days_since_last_sale"]
            if x["days_since_last_sale"] is not None
            else 999999,
        reverse=True,
    )
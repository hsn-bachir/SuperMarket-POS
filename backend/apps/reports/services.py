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
from apps.inventory.services import (
    get_average_cost_as_of,
    get_stock,
    get_stock_as_of,
)
from apps.accounting.services.report_services.income_statement_service import (
    IncomeStatementService,
)
from django.conf import settings


# ----------------------------------------------------
# Helpers
# ----------------------------------------------------

def apply_sale_filters(queryset, start_date=None, end_date=None):
    queryset = queryset.filter(sale__status=Sale.STATUS_ACTIVE)

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
    queryset = queryset.filter(status=Sale.STATUS_ACTIVE)

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
                Value(Decimal("0")),
                output_field=DecimalField(
                    max_digits=14,
                    decimal_places=2,
                ),
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

def get_inventory_valuation(start_date=None,
    end_date=None):

    results = []

    for product in Product.objects.filter(
        is_active=True
    ):
        as_of_date = end_date or start_date

        if as_of_date:
            stock = get_stock_as_of(product, as_of_date)
            cost_price = get_average_cost_as_of(product, as_of_date)
        else:
            stock = get_stock(product)
            cost_price = product.cost_price

        inventory_value = Decimal(stock) * cost_price

        results.append({
            "product_id": product.id,
            "barcode": product.barcode,
            "category":
                product.category.name
                if product.category
                else None,
            "product_name": product.name,
            "stock": stock,
            "cost_price": cost_price,
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

    income_statement = IncomeStatementService.get_income_statement(
        start_date=start_date,
        end_date=end_date,
    )
    account_code_map = getattr(
        settings,
        "ACCOUNTING_ACCOUNT_CODES",
        {"cogs": "5100"},
    )
    cogs_account_code = account_code_map.get("cogs", "5100")
    operating_expenses = sum(
        row["amount"]
        for row in income_statement["expenses"]
        if row["code"] != cogs_account_code
    )

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

def get_last_sale_map(
    start_date=None,
    end_date=None,
):

    qs = SaleItem.objects.all()


    qs = apply_sale_filters(
        qs,
        start_date,
        end_date,
    )


    rows = (
        qs
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

def get_stock_aging_report(
    start_date=None,
    end_date=None,
):

    stock_map = get_stock_map()

    last_sale_map = get_last_sale_map(
        start_date,
        end_date,
    )

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
                today - last_sale
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

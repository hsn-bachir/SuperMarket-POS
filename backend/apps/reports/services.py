from django.db.models import F, Sum, Value, DecimalField, ExpressionWrapper, Max
from django.db.models.functions import Coalesce
from apps.sales.models import SaleItem
from apps.inventory.services import get_stock
from django.db.models import Sum, Value
from django.db.models.functions import Coalesce
from apps.sales.models import SaleItem
from apps.sales.models import Sale
from decimal import Decimal
from apps.products.models import Product
from datetime import date

def get_sales_aggregation(*, since_date=None):

    qs = SaleItem.objects.all()

    if since_date:
        qs = qs.filter(sale__sale_date__gte=since_date)

    return (
        qs.values(
            "product_id",
            "product__name",
            "product__minimum_stock",
        )
        .annotate(
            quantity_sold=Coalesce(Sum("quantity"), Value(0))
        )
    )

def get_stock_map():
    from apps.products.models import Product

    return {
        p.id: get_stock(p)
        for p in Product.objects.all()
    }

def get_inventory_valuation():
    results = []

    products = Product.objects.filter(
        is_active=True
    )

    for product in products:

        stock = get_stock(product)

        inventory_value = (
            Decimal(stock)
            * product.cost_price
        )

        results.append(
            {
                "product_id": product.id,
                "product_name": product.name,
                "stock": stock,
                "cost_price": product.cost_price,
                "inventory_value": inventory_value,
            }
        )

    return results

def get_inventory_summary():
    products = Product.objects.filter(
        is_active=True
    )

    total_products = 0
    total_units = 0

    inventory_value = Decimal("0")

    for product in products:
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

def get_cogs_report(
    start_date=None,
    end_date=None,
):
    sales = Sale.objects.all()

    sale_items = SaleItem.objects.all()

    if start_date:
        sales = sales.filter(
            sale_date__gte=start_date
        )

        sale_items = sale_items.filter(
            sale__sale_date__gte=start_date
        )

    if end_date:
        sales = sales.filter(
            sale_date__lte=end_date
        )

        sale_items = sale_items.filter(
            sale__sale_date__lte=end_date
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
            gross_profit / revenue
        ) * Decimal("100")

    return {
        "revenue": revenue,
        "cogs": cogs,
        "gross_profit": gross_profit,
        "gross_margin": gross_margin,
    }

def get_profit_loss_report(
    start_date=None,
    end_date=None,
):
    cogs_data = get_cogs_report(
        start_date=start_date,
        end_date=end_date,
    )

    operating_expenses = Decimal("0")

    net_profit = (
        cogs_data["gross_profit"]
        - operating_expenses
    )

    net_margin = Decimal("0")

    if cogs_data["revenue"] > 0:
        net_margin = (
            net_profit
            / cogs_data["revenue"]
        ) * Decimal("100")

    return {
        "revenue":
            cogs_data["revenue"],

        "cogs":
            cogs_data["cogs"],

        "gross_profit":
            cogs_data["gross_profit"],

        "operating_expenses":
            operating_expenses,

        "net_profit":
            net_profit,

        "gross_margin":
            cogs_data["gross_margin"],

        "net_margin":
            net_margin,
    }

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

def get_stock_aging_report():

    stock_map = get_stock_map()

    last_sale_map = get_last_sale_map()

    results = []

    products = Product.objects.filter(
        is_active=True
    )

    today = date.today()

    for product in products:

        stock = stock_map.get(
            product.id,
            0
        )

        if stock <= 0:
            continue

        last_sale_date = (
            last_sale_map.get(
                product.id
            )
        )

        if last_sale_date:

            days_since_last_sale = (
                today -
                last_sale_date
            ).days

        else:

            days_since_last_sale = None

        inventory_value = (
            stock *
            product.cost_price
        )

        results.append(
            {
                "product_id": product.id,
                "product_name": product.name,

                "stock": stock,

                "inventory_value":
                    inventory_value,

                "last_sale_date":
                    last_sale_date,

                "days_since_last_sale":
                    days_since_last_sale,
            }
        )

    return sorted(
        results,
        key=lambda x:
            x["days_since_last_sale"]
            if x["days_since_last_sale"]
            is not None
            else 999999,
        reverse=True,
    )
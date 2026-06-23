from django.db.models import F, Sum, Value
from django.db.models.functions import Coalesce

from apps.sales.models import SaleItem
from apps.inventory.services import get_stock


from django.db.models import Sum, Value
from django.db.models.functions import Coalesce

from apps.sales.models import SaleItem


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
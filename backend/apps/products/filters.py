from django_filters import rest_framework as filters

from .models import Product


class ProductFilter(filters.FilterSet):

    category = filters.NumberFilter(
        field_name="category_id"
    )

    is_active = filters.BooleanFilter()

    class Meta:
        model = Product

        fields = [
            "category",
            "is_active",
        ]
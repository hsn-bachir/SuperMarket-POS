from django.shortcuts import render

from rest_framework import generics
from rest_framework.filters import SearchFilter

from .models import Product
from .serializers import ProductSerializer


class ProductListView(
    generics.ListAPIView
):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    filter_backends = [SearchFilter]

    search_fields = [
        "name",
        "barcode",
    ]


class ProductDetailView(
    generics.RetrieveAPIView
):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
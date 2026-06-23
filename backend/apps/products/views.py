from django.shortcuts import render
from rest_framework import generics
from rest_framework.filters import SearchFilter
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer,LowStockProductSerializer
from apps.inventory.services import get_stock

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [SearchFilter]
    search_fields = [
        "name",
        "barcode",
    ]

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class LowStockProductsView(APIView):
    def get(self, request):
        products = Product.objects.filter(
            is_active=True
        )
        low_stock_products = [
            product
            for product in products
            if get_stock(product)
            <= product.minimum_stock
        ]
        serializer = (
            LowStockProductSerializer(
                low_stock_products,
                many=True
            )
        )

        return Response(serializer.data)
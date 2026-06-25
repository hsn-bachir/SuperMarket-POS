from django.shortcuts import render
from rest_framework import generics
from rest_framework.filters import SearchFilter
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer,LowStockProductSerializer
from apps.inventory.services import get_stock
from rest_framework.permissions import (
    IsAuthenticated,
    DjangoModelPermissions,
)

class ProductListView(generics.ListAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [SearchFilter]
    search_fields = [
        "name",
        "barcode",
    ]

class ProductDetailView(generics.RetrieveAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class LowStockProductsView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
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
    
class ProductCreateView(generics.CreateAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductUpdateView(generics.UpdateAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductDeleteView(generics.DestroyAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
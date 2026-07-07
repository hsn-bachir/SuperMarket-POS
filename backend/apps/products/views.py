from django.shortcuts import render
from rest_framework import generics
from rest_framework.filters import SearchFilter
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product,Category
from .serializers import ProductSerializer,LowStockProductSerializer,CategorySerializer
from apps.inventory.services import get_stock
from rest_framework.permissions import (
    IsAuthenticated,
    DjangoModelPermissions,
)

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import (
    SearchFilter,
    OrderingFilter,
)

from .filters import ProductFilter

class ProductListView(generics.ListAPIView):

    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = (
        Product.objects
        .select_related("category")
        .all()
    )

    serializer_class = ProductSerializer

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_class = ProductFilter

    search_fields = [
        "name",
        "barcode",
    ]

    ordering_fields = [
        "name",
        "selling_price",
        "created_at",
    ]

    ordering = [
        "name",
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


class CategoryListView(generics.ListAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer

    filter_backends = [SearchFilter]
    search_fields = ["name"]
   
class CategoryCreateView(generics.ListCreateAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CategoryUpdateView(generics.UpdateAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryDeleteView(generics.DestroyAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CategoryDetailView(generics.RetrieveAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
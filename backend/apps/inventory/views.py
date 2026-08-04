from django.shortcuts import render
from rest_framework import generics
from rest_framework.filters import SearchFilter
from .models import InventoryMovement
from .serializers import (
    InventoryMovementSerializer,InventoryAdjustmentSerializer
)
from rest_framework.permissions import (
    IsAuthenticated,
    DjangoModelPermissions,
)
from apps.products.models import Product
from .services import create_adjustment

from rest_framework.views import APIView
from rest_framework.response import Response

from datetime import timedelta
from django.utils import timezone
from rest_framework import generics
from rest_framework.filters import SearchFilter

class InventoryMovementListView(generics.ListAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    serializer_class = InventoryMovementSerializer

    filter_backends = [SearchFilter]

    search_fields = [
        "product__name",
        "product__barcode",
        "movement_type",
    ]

    def get_queryset(self):
        one_month_ago = timezone.now() - timedelta(days=30)

        return (
            InventoryMovement.objects
            .select_related("product")
            .filter(created_at__gte=one_month_ago)
            .order_by("-created_at")
        )

class InventoryAdjustmentView(APIView):

    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = InventoryMovement.objects.all()

    def post(self, request):
        serializer = InventoryAdjustmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = Product.objects.get(
            id=serializer.validated_data["product_id"]
        )

        movement = create_adjustment(
            product=product,
            quantity=serializer.validated_data["quantity"],
            reason=serializer.validated_data["reason"],
            user=request.user,
        )

        return Response({
            "message": "Inventory adjusted",
            "movement_id": movement.id,
        })

    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    def post(self, request):

        serializer = InventoryAdjustmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = Product.objects.get(
            id=serializer.validated_data["product_id"]
        )

        movement = create_adjustment(
            product=product,
            quantity=serializer.validated_data["quantity"],
            reason=serializer.validated_data["reason"],
            user=request.user,
        )

        return Response({
            "message": "Inventory adjusted",
            "movement_id": movement.id
        })
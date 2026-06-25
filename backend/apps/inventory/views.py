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

class InventoryMovementListView(generics.ListAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]
    queryset = (
        InventoryMovement.objects
        .select_related("product")
        .order_by("-created_at")
    )

    serializer_class = (
        InventoryMovementSerializer
    )

    filter_backends = [
        SearchFilter
    ]

    search_fields = [
        "product__name",
        "product__barcode",
        "movement_type",
    ]

class InventoryAdjustmentView(APIView):

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
        )

        return Response({
            "message": "Inventory adjusted",
            "movement_id": movement.id
        })
from django.shortcuts import render
from rest_framework import generics
from rest_framework.filters import SearchFilter
from .models import InventoryMovement
from .serializers import (
    InventoryMovementSerializer,
)

class InventoryMovementListView(
    generics.ListAPIView
):
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
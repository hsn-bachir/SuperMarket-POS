from rest_framework import generics, filters
from rest_framework.permissions import (
    IsAuthenticated,
    DjangoModelPermissions,
)

from .models import Supplier
from .serializers import SupplierSerializer


class SupplierPermissionMixin:
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]


class SupplierListView(
    SupplierPermissionMixin,
    generics.ListAPIView
):
    queryset = (
        Supplier.objects
        .all()
        .order_by("-id")
    )

    serializer_class = SupplierSerializer

    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = [
        "name",
    ]

    ordering_fields = [
        "name",
        "created_at",
    ]

    ordering = [
        "-id",
    ]


class SupplierCreateView(
    SupplierPermissionMixin,
    generics.CreateAPIView
):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer


class SupplierDetailView(
    SupplierPermissionMixin,
    generics.RetrieveAPIView
):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer


class SupplierUpdateView(
    SupplierPermissionMixin,
    generics.UpdateAPIView
):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer


class SupplierDeleteView(
    SupplierPermissionMixin,
    generics.DestroyAPIView
):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
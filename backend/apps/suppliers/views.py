from rest_framework import generics
from rest_framework.permissions import (
    IsAuthenticated,
    DjangoModelPermissions,
)

from .models import Supplier
from .serializers import SupplierSerializer


class SupplierListView(generics.ListAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = Supplier.objects.all().order_by("-id")
    serializer_class = SupplierSerializer


class SupplierCreateView(generics.CreateAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer


class SupplierDetailView(generics.RetrieveAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer


class SupplierUpdateView(generics.UpdateAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer


class SupplierDeleteView(generics.DestroyAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
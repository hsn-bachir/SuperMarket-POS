from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions

from .models import Supplier
from .serializers import SupplierSerializer


class SupplierListCreateView(generics.ListCreateAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = Supplier.objects.all().order_by("-id")
    serializer_class = SupplierSerializer


class SupplierDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
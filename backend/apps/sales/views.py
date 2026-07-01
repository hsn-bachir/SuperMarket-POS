from urllib import request

from django.shortcuts import render
from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response

from apps.sales.services import delete_sale

from .models import Sale

from .serializers import (
    SaleSerializer,
    SaleCreateSerializer,
    SaleUpdateSerializer,
)

from rest_framework.permissions import (
    IsAuthenticated,
    DjangoModelPermissions,
)


class SaleListCreateView(generics.ListCreateAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]
    queryset = Sale.objects.all().order_by(
        "-sale_date"
    )

    def get_serializer_class(self):
        if self.request.method == "POST":
            return SaleCreateSerializer

        return SaleSerializer

    def create(self, request, *args, **kwargs):
        serializer = SaleCreateSerializer(
            data=request.data,
            context={
                "request": request,
            },
        )

        serializer.is_valid(
            raise_exception=True
        )

        sale = serializer.save()

        output = SaleSerializer(sale)

        return Response(
            output.data,
            status=status.HTTP_201_CREATED
        )


class SaleDetailUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]
    queryset = Sale.objects.all()
    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return SaleUpdateSerializer
        return SaleSerializer

    def update(self, request, *args, **kwargs):
        sale = self.get_object()
        serializer = SaleUpdateSerializer(
            sale,
            data=request.data,
            partial=False,
        )
        serializer.is_valid(
            raise_exception=True
        )
        serializer.save()
        output = SaleSerializer(sale)
        return Response(output.data)
    
    def destroy(self, request, *args, **kwargs):
        sale = self.get_object()
        delete_sale(
            sale=sale,
            user=request.user,
        )

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )
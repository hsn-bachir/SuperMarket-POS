from urllib import request

from django.shortcuts import render
from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.filters import SearchFilter
from apps.sales.services import delete_sale

from .models import Sale

from .serializers import (
    SaleSerializer,
    SaleCreateSerializer,
    SaleUpdateSerializer,
    InvoiceSerializer,
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

    def get_queryset(self):
        queryset = (
        Sale.objects
        .all()
        .filter(status=Sale.STATUS_ACTIVE)
        .order_by("-sale_date", "-id")
    )

        payment = self.request.query_params.get("payment")

        if payment:
            queryset = queryset.filter(
            payment_method=payment
        )

        return queryset

    filter_backends = [SearchFilter]

    search_fields = [
        "invoice_number",
    ]

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

        serializer.is_valid(raise_exception=True)

        sale = serializer.save()

        output = SaleSerializer(sale)

        return Response(
            output.data,
            status=status.HTTP_201_CREATED,
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
        if sale.status == Sale.STATUS_ACTIVE:
            raise ValidationError(
                "Posted sales cannot be edited. Cancel the sale and create a correction."
            )
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
    
class SaleInvoiceView(
    generics.RetrieveAPIView
):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = (
        Sale.objects
        .prefetch_related(
            "items",
            "items__product",
        )
    )

    serializer_class = InvoiceSerializer
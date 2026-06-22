from django.shortcuts import render

from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response

from .models import Purchase

from .serializers import (
    PurchaseSerializer,
    PurchaseCreateSerializer,
)


class PurchaseListCreateView(
    generics.ListCreateAPIView
):
    queryset = Purchase.objects.all().order_by(
        "-purchase_date"
    )

    def get_serializer_class(self):
        if self.request.method == "POST":
            return PurchaseCreateSerializer

        return PurchaseSerializer

    def create(self, request, *args, **kwargs):
        serializer = PurchaseCreateSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        purchase = serializer.save()

        output = PurchaseSerializer(
            purchase
        )

        return Response(
            output.data,
            status=status.HTTP_201_CREATED
        )


class PurchaseDetailView(
    generics.RetrieveAPIView
):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
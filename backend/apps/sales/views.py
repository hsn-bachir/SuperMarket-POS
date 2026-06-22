from django.shortcuts import render

from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response

from .models import Sale

from .serializers import (
    SaleSerializer,
    SaleCreateSerializer,
)


class SaleListCreateView(
    generics.ListCreateAPIView
):
    queryset = Sale.objects.all().order_by(
        "-sale_date"
    )

    def get_serializer_class(self):
        if self.request.method == "POST":
            return SaleCreateSerializer

        return SaleSerializer

    def create(self, request, *args, **kwargs):
        serializer = SaleCreateSerializer(
            data=request.data
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


class SaleDetailView(
    generics.RetrieveAPIView
):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
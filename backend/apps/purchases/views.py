from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response

from rest_framework.permissions import (
    IsAuthenticated,
    DjangoModelPermissions,
)

from .models import Purchase

from .serializers import (
    PurchaseSerializer,
    PurchaseCreateSerializer,
)
from rest_framework.filters import SearchFilter
from .services import delete_purchase


class PurchaseListView(generics.ListAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = (
        Purchase.objects
        .select_related("supplier")
        .prefetch_related(
            "items",
            "items__product",
        )
        .order_by(
            "-purchase_date",
            "-id",
        )
    )

    serializer_class = PurchaseSerializer

    filter_backends = [SearchFilter]

    search_fields = [
        "invoice_number",
        "supplier__name",
    ]


class PurchaseCreateView(generics.CreateAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = Purchase.objects.all()

    serializer_class = PurchaseCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
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
            status=status.HTTP_201_CREATED,
        )


class PurchaseDetailView(generics.RetrieveAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = (
        Purchase.objects
        .select_related("supplier")
        .prefetch_related(
            "items",
            "items__product",
        )
    )

    serializer_class = PurchaseSerializer


class PurchaseUpdateView(generics.UpdateAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = Purchase.objects.all()

    serializer_class = PurchaseCreateSerializer

    def update(self, request, *args, **kwargs):
        purchase = self.get_object()

        serializer = self.get_serializer(
            purchase,
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True
        )

        purchase = serializer.save()

        output = PurchaseSerializer(
            purchase
        )

        return Response(output.data)


class PurchaseDeleteView(generics.DestroyAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = Purchase.objects.all()

    serializer_class = PurchaseSerializer

    def destroy(self, request, *args, **kwargs):
        purchase = self.get_object()

        delete_purchase(
            purchase=purchase,
            user=request.user,
        )

        return Response(
            {
                "detail": "Purchase cancelled successfully."
            },
            status=status.HTTP_200_OK,
        )
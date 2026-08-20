from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import DjangoModelPermissions, IsAuthenticated
from rest_framework.response import Response

from .models import Service, ServicePriceHistory
from .serializers import (
    ServicePriceHistorySerializer,
    ServiceSerializer,
)


class ServiceViewSet(viewsets.ModelViewSet):
  permission_classes = [
      IsAuthenticated,
      DjangoModelPermissions,
  ]

  queryset = (
      Service.objects.prefetch_related("price_history").all().order_by("-id")
  )
  serializer_class = ServiceSerializer
  pagination_class = PageNumberPagination
  filter_backends = [SearchFilter]
  search_fields = ["name", "description"]

  @action(
      detail=True,
      methods=["post"],
      url_path="set-price",
  )
  def set_price(self, request, pk=None):
    service = self.get_object()

    serializer = ServicePriceHistorySerializer(
        data={
            "service": service.id,
            "price": request.data.get("price"),
        }
    )

    serializer.is_valid(raise_exception=True)

    price_history = serializer.save()

    return Response(
        ServicePriceHistorySerializer(price_history).data,
        status=status.HTTP_201_CREATED,
    )

  @action(
      detail=True,
      methods=["get"],
      url_path="price-history",
  )
  def price_history(self, request, pk=None):
    service = self.get_object()

    history = service.price_history.all().order_by("-id")

    page = self.paginate_queryset(history)
    if page is not None:
      serializer = ServicePriceHistorySerializer(page, many=True)
      return self.get_paginated_response(serializer.data)

    serializer = ServicePriceHistorySerializer(
        history,
        many=True,
    )

    return Response(serializer.data)


class ServicePriceHistoryViewSet(viewsets.ReadOnlyModelViewSet):
  permission_classes = [
      IsAuthenticated,
      DjangoModelPermissions,
  ]

  queryset = (
      ServicePriceHistory.objects.select_related("service")
      .all()
      .order_by("-id")
  )
  serializer_class = ServicePriceHistorySerializer
  pagination_class = PageNumberPagination
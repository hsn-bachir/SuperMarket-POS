from rest_framework import viewsets
from rest_framework.filters import SearchFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import (
    DjangoModelPermissions,
    IsAuthenticated,
)

from .models import Service
from .serializers import ServiceSerializer


class ServiceViewSet(viewsets.ModelViewSet):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = Service.objects.all().order_by("-id")

    serializer_class = ServiceSerializer

    pagination_class = PageNumberPagination

    filter_backends = [SearchFilter]

    search_fields = [
        "name",
        "description",
    ]
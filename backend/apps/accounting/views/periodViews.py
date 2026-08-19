from datetime import date
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import (
    ListModelMixin,
    RetrieveModelMixin,
    CreateModelMixin,
)

from apps.accounts.permissions import IsAdminOrManager
from apps.accounting.models.periodsModel import AccountingPeriod
from apps.accounting.serializers.periodSerializer import AccountingPeriodSerializer
from apps.accounting.services.accounting_period_service import AccountingPeriodService
from apps.accounting.services.closing_service import ClosingService


class AccountingPeriodViewSet(
    ListModelMixin,
    RetrieveModelMixin,
    CreateModelMixin,
    GenericViewSet,
):
    permission_classes = [IsAdminOrManager]
    queryset = AccountingPeriod.objects.order_by("-start_date")
    serializer_class = AccountingPeriodSerializer

    @action(detail=False, methods=["get"])
    def current(self, request):
        period = AccountingPeriodService.get_current_period(
            transaction_date=date.today()
        )
        serializer = self.get_serializer(period)
        return Response(serializer.data)

    @action(detail=False, methods=["post"], url_path="generate-next")
    def generate_next(self, request):
        period = AccountingPeriodService.generate_next_period()
        serializer = self.get_serializer(period)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def close(self, request, pk=None):
        period = self.get_object()
        ClosingService.close_period(period=period, user=request.user)
        serializer = self.get_serializer(period)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def reopen(self, request, pk=None):
        period = self.get_object()
        AccountingPeriodService.reopen_period(period=period, user=request.user)
        serializer = self.get_serializer(period)
        return Response(serializer.data, status=status.HTTP_200_OK)
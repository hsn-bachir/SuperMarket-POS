from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsAdminOrManager
from apps.accounting.serializers.capitalSerializer import CapitalInvestmentSerializer
from apps.accounting.services.capital_service import CapitalService


class CapitalInvestmentView(APIView):
    permission_classes = [IsAdminOrManager]

    def post(self, request):
        serializer = CapitalInvestmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        entry = CapitalService.invest(
            user=request.user,
            **serializer.validated_data,
        )
        return Response(
            {"journal_entry": entry.number, "status": entry.status},
            status=status.HTTP_201_CREATED,
        )
from rest_framework.decorators import api_view
from rest_framework.response import Response

from apps.configuration.services import (
    get_exchange_rate,
    get_base_currency,
)


@api_view(["GET"])
def get_default(request):
    return Response({
        "exchange_rate": get_exchange_rate(),
        "base_currency": get_base_currency(),
    })
from django.db.models import ProtectedError
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    # Call DRF's default exception handler first to get the standard response
    response = exception_handler(exc, context)

    # If DRF couldn't handle it, check for Django ProtectedError
    if response is None and isinstance(exc, ProtectedError):
        protected_objects = [str(obj) for obj in exc.protected_objects]
        return Response(
            {
                "detail": "Cannot delete this item because it is referenced by other records.",
                "protected_objects": protected_objects,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    return response
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from apps.accounts.permissions import CanViewReports
from apps.common.pagination import (
    StandardResultsPagination,
)

from .exporters import export_response


class BaseReportView(GenericAPIView):

    permission_classes = [
        CanViewReports,
    ]

    pagination_class = (
        StandardResultsPagination
    )

    serializer_class = None

    filename = "report"

    def render(self, request, rows):

        export = export_response(
            request=request,
            filename=self.filename,
            rows=rows,
        )

        if export:
            return export

        page = self.paginate_queryset(rows)

        if page is not None:

            serializer = self.serializer_class(
                page,
                many=True,
            )

            return self.get_paginated_response(
                serializer.data
            )

        serializer = self.serializer_class(
            rows,
            many=True,
        )

        return Response(serializer.data)
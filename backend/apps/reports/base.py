from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from apps.accounts.permissions import CanViewReports
from apps.common.pagination import StandardResultsPagination

from .exporters import export_response


class BaseReportView(GenericAPIView):

    permission_classes = [CanViewReports]

    pagination_class = StandardResultsPagination

    serializer_class = None

    filename = "report"

    paginate = True

    search_fields = []

    ordering_fields = []

    default_ordering = None

    def apply_search(self, request, rows):

        search = request.query_params.get("search")

        if not search or not self.search_fields:
            return rows

        search = search.lower()

        filtered = []

        for row in rows:

            for field in self.search_fields:

                value = str(
                    row.get(field, "")
                ).lower()

                if search in value:
                    filtered.append(row)
                    break

        return filtered

    def apply_ordering(self, request, rows):

        ordering = request.query_params.get(
            "ordering",
            self.default_ordering,
        )

        if not ordering:
            return rows

        reverse = ordering.startswith("-")

        field = ordering.lstrip("-")

        if field not in self.ordering_fields:
            return rows

        return sorted(
            rows,
            key=lambda x: x.get(field) or 0,
            reverse=reverse,
        )

    def get_summary(self, rows):
        """
        Override in reports that need summary cards.
        """
        return None

    def render(self, request, rows):

        export = export_response(
            request=request,
            filename=self.filename,
            rows=rows,
        )

        if export:
            return export

        rows = self.apply_search(
            request,
            rows,
        )

        rows = self.apply_ordering(
            request,
            rows,
        )

        summary = self.get_summary(rows)

        if self.paginate:

            page = self.paginate_queryset(rows)

            if page is not None:

                serializer = self.serializer_class(
                    page,
                    many=True,
                )

                response = self.get_paginated_response(
                    serializer.data
                )

                if summary:
                    response.data["summary"] = summary

                return response

        serializer = self.serializer_class(
            rows,
            many=True,
        )

        return Response({
            "summary": summary,
            "results": serializer.data,
        })
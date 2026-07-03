from rest_framework.response import Response


def paginate_api_view(view, queryset_or_list, serializer):

    page = view.paginate_queryset(
        queryset_or_list
    )

    if page is not None:

        return view.get_paginated_response(
            serializer(
                page,
                many=True,
            ).data
        )

    return Response(
        serializer(
            queryset_or_list,
            many=True,
        ).data
    )
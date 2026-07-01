from django.urls import path

from .views import (
    SaleListCreateView,
    SaleDetailUpdateDestroyView,
)

urlpatterns = [
    path(
        "",
        SaleListCreateView.as_view(),
        name="sale-list-create"
    ),

    path(
        "<int:pk>/",
        SaleDetailUpdateDestroyView.as_view(),
        name="sale-detail"
    ),
]
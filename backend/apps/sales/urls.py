from django.urls import path

from .views import (
    SaleListCreateView,
    SaleDetailUpdateDestroyView,
    SaleInvoiceView,
    ServiceHistoryView,
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
    
    path(
        "<int:pk>/invoice",
        SaleInvoiceView.as_view(),
        name="sale-invoice "
    ),

    path(
        "service-history/",
        ServiceHistoryView.as_view(),
    )
]
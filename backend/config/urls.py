from django.contrib import admin
from django.urls import path
from django.urls import include

urlpatterns = [
    path("admin/", admin.site.urls),

    path(
        "api/purchases/",
        include("apps.purchases.urls")
    ),

    path(
        "api/sales/",
        include("apps.sales.urls")
    ),

    path(
        "api/products/",
        include("apps.products.urls"),
    ),

    path(
        "api/suppliers/",
        include("apps.suppliers.urls"),
    ),

    path(
        "api/inventory/",
        include("apps.inventory.urls"),
    ),

    path(
        "api/reports/",
        include("apps.reports.urls"),
    ),

    path(
        "api/accounts/",
        include("apps.accounts.urls"),
    ),

    path(
            "api/accounting/",
            include("apps.accounting.urls"),
        ),

    path(
        "api/config/",
        include("apps.configuration.urls"),
    ),

    path(
            "api/services/",
            include("apps.services.urls"),
        ),
]
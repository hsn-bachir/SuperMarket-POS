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
]
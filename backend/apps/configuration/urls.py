from django.urls import path

from .views import get_default

urlpatterns = [
    path(
        "default/",
        get_default,
        name="configuration-default",
    ),
]
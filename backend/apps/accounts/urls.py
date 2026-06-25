from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

from .views import CurrentUserView,UserDetailView,UserListCreateView

urlpatterns = [
    path(
        "login/",
        TokenObtainPairView.as_view(),
        name="login",
    ),

    path(
        "token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    path(
        "me/",
        CurrentUserView.as_view(),
        name="current_user",
    ),
    path("users/", UserListCreateView.as_view()),
    path("users/<int:pk>/", UserDetailView.as_view()),
]
from django.urls import path
from .views import (
    ProductListView,
    ProductDetailView,
    ProductCreateView,
    ProductUpdateView,
    ProductDeleteView,
    LowStockProductsView,
    CategoryListView,
    CategoryCreateView,
    CategoryUpdateView,
    CategoryDeleteView,
    CategoryDetailView,
)

urlpatterns = [
    path("", ProductListView.as_view()),
    path("<int:pk>/", ProductDetailView.as_view()),
    path("create/", ProductCreateView.as_view()),
    path("<int:pk>/update/", ProductUpdateView.as_view()),
    path("<int:pk>/delete/", ProductDeleteView.as_view()),

    path("category/", CategoryListView.as_view()),
    path("<int:pk>/category/", CategoryDetailView.as_view()),
    path("create/category/", CategoryCreateView.as_view()),
    path("<int:pk>/update/category/", CategoryUpdateView.as_view()),
    path("<int:pk>/delete/category/", CategoryDeleteView.as_view()),

    path("low-stock/", LowStockProductsView.as_view()),
]
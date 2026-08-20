from rest_framework.routers import DefaultRouter

from .views import (
    ServicePriceHistoryViewSet,
    ServiceViewSet,
)

router = DefaultRouter()

# Register specific routes FIRST
router.register(
    r"price-history",
    ServicePriceHistoryViewSet,
    basename="service-price-history",
)

# Register empty route LAST
router.register(
    r"",
    ServiceViewSet,
    basename="service",
)

urlpatterns = router.urls
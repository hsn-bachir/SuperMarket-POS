from rest_framework.routers import DefaultRouter

from .views import (
    ServiceViewSet,
)

router = DefaultRouter()

# Register empty route LAST
router.register(
    r"",
    ServiceViewSet,
    basename="service",
)

urlpatterns = router.urls
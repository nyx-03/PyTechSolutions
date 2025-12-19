from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    RealisationViewSet,
    TestimonialViewSet,
    ContactMessageCreateView,
    AdminRealisationViewSet,
)
from api.auth.login import LoginView
from api.auth.logout import LogoutView
from api.auth.me import MeView

router = DefaultRouter()
router.register(r"realisations", RealisationViewSet, basename="realisations")
router.register(r"testimonials", TestimonialViewSet, basename="testimonials")

admin_router = DefaultRouter()
admin_router.register(r"realisations", AdminRealisationViewSet, basename="admin-realisations")

urlpatterns = [
    # Public API
    path("", include(router.urls)),
    path("contact/", ContactMessageCreateView.as_view(), name="contact"),

    # Auth (JWT)
    path("auth/login/", LoginView.as_view(), name="auth_login"),
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/me/", MeView.as_view(), name="auth_me"),
    path("auth/logout/", LogoutView.as_view(), name="auth_logout"),

    # Admin API (JWT protected)
    path("admin/", include(admin_router.urls)),
]

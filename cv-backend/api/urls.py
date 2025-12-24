from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    RealisationViewSet,
    TestimonialViewSet,
    ContactMessageCreateView,
    AdminRealisationViewSet,
    AdminUserViewSet,
)
from api.auth.login import LoginView
from api.auth.logout import LogoutView
from api.auth.me import MeView
from api.auth.refresh import RefreshView

router = DefaultRouter()
router.register(r"realisations", RealisationViewSet, basename="realisations")
router.register(r"testimonials", TestimonialViewSet, basename="testimonials")

admin_router = DefaultRouter()
admin_router.register(r"realisations", AdminRealisationViewSet, basename="admin-realisations")
admin_router.register(r"users", AdminUserViewSet, basename="admin-users")

urlpatterns = [
    # Public API
    path("", include(router.urls)),
    path("contact/", ContactMessageCreateView.as_view(), name="contact"),

    # Auth (JWT)
    path("auth/login/", LoginView.as_view(), name="auth_login"),
    path("auth/refresh/", RefreshView.as_view(), name="auth_refresh"),
    path("auth/me/", MeView.as_view(), name="auth_me"),
    path("auth/logout/", LogoutView.as_view(), name="auth_logout"),

    # Admin API (JWT protected)
    path("admin/", include(admin_router.urls)),
]

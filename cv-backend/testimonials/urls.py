from django.urls import path

from .views import (
    PublicTestimonialListView,
    AdminTestimonialListCreateView,
    AdminTestimonialDetailView,
)

urlpatterns = [
    # Public API
    path("", PublicTestimonialListView.as_view(), name="public-testimonials"),

    # Admin API
    path("admin/", AdminTestimonialListCreateView.as_view(), name="admin-testimonials"),
    path(
        "admin/<int:pk>/",
        AdminTestimonialDetailView.as_view(),
        name="admin-testimonial-detail",
    ),
]
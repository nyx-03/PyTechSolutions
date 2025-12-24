from rest_framework import generics, permissions
from rest_framework.response import Response

from .models import Testimonial
from .serializers import PublicTestimonialSerializer, AdminTestimonialSerializer


class PublicTestimonialListView(generics.ListAPIView):
    """Public API endpoint returning published testimonials only."""

    serializer_class = PublicTestimonialSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Testimonial.objects.filter(is_published=True)


class IsAdminUser(permissions.BasePermission):
    """Allow access only to staff or superusers."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.is_staff or request.user.is_superuser)
        )


class AdminTestimonialListCreateView(generics.ListCreateAPIView):
    """Admin endpoint to list and create testimonials."""

    serializer_class = AdminTestimonialSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Testimonial.objects.all()


class AdminTestimonialDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin endpoint to retrieve, update or delete a testimonial."""

    serializer_class = AdminTestimonialSerializer
    permission_classes = [IsAdminUser]
    queryset = Testimonial.objects.all()

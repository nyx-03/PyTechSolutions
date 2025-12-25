from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import DjangoModelPermissionsStrict
from django.contrib.auth import get_user_model
from .permissions import IsAdminRole
from .serializers import AdminUserSerializer

from .models import Realisation, Testimonial, ContactMessage
from .serializers import (
    RealisationListSerializer,
    RealisationDetailSerializer,
    TestimonialSerializer,
    ContactMessageSerializer,
    RealisationAdminSerializer,
)

from api.auth.authentication import CookieJWTAuthentication


class RealisationViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only API for published realisations."""

    queryset = Realisation.objects.filter(status="published")
    lookup_field = "slug"

    def get_serializer_class(self):
        if self.action == "retrieve":
            return RealisationDetailSerializer
        return RealisationListSerializer


class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only API for testimonials."""

    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer


class ContactMessageCreateView(APIView):
    """API endpoint to submit the contact form."""

    def post(self, request, *args, **kwargs):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            ContactMessage.objects.create(
                name=serializer.validated_data["name"],
                email=serializer.validated_data["email"],
                message=serializer.validated_data["message"],
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get("HTTP_USER_AGENT", ""),
            )
            return Response(
                {"detail": "Message envoyé avec succès."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0]
        return request.META.get("REMOTE_ADDR")


class AdminRealisationViewSet(viewsets.ModelViewSet):
    """Admin CRUD API for Realisation."""

    queryset = Realisation.objects.all()
    serializer_class = RealisationAdminSerializer
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated, DjangoModelPermissionsStrict]


class AdminUserViewSet(viewsets.ModelViewSet):
    """
    Admin API to manage users and their roles.

    Accessible only to Admin role or superuser.
    """

    queryset = get_user_model().objects.all().order_by("username")
    serializer_class = AdminUserSerializer
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminRole]

    http_method_names = ["get", "patch", "head", "options"]

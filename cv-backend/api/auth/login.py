from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings
from rest_framework.response import Response


User = get_user_model()


class LoginSerializer(TokenObtainPairSerializer):
    """JWT login serializer that also returns user roles and permissions."""

    @classmethod
    def get_token(cls, user):
        return super().get_token(user)

    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user
        data["user"] = {
            "id": user.id,
            "username": user.get_username(),
            "email": getattr(user, "email", ""),
            "is_staff": bool(getattr(user, "is_staff", False)),
            "is_superuser": bool(getattr(user, "is_superuser", False)),
            "roles": list(user.groups.values_list("name", flat=True)),
            "permissions": sorted(list(user.get_all_permissions())),
        }

        return data


class LoginView(TokenObtainPairView):
    """POST: username/password -> sets HttpOnly JWT cookies and returns user payload."""

    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated = serializer.validated_data
        access = validated.pop("access")
        refresh = validated.pop("refresh")

        response = Response(validated, status=200)

        # Set access token cookie
        response.set_cookie(
            settings.SIMPLE_JWT.get("AUTH_COOKIE", "access"),
            access,
            httponly=settings.SIMPLE_JWT.get("AUTH_COOKIE_HTTP_ONLY", True),
            secure=settings.SIMPLE_JWT.get("AUTH_COOKIE_SECURE", False),
            samesite=settings.SIMPLE_JWT.get("AUTH_COOKIE_SAMESITE", "Lax"),
            max_age=int(settings.SIMPLE_JWT.get("ACCESS_TOKEN_LIFETIME").total_seconds()),
            path="/api/",
        )

        # Set refresh token cookie
        response.set_cookie(
            settings.SIMPLE_JWT.get("AUTH_COOKIE_REFRESH", "refresh"),
            refresh,
            httponly=settings.SIMPLE_JWT.get("AUTH_COOKIE_HTTP_ONLY", True),
            secure=settings.SIMPLE_JWT.get("AUTH_COOKIE_SECURE", False),
            samesite=settings.SIMPLE_JWT.get("AUTH_COOKIE_SAMESITE", "Lax"),
            max_age=int(settings.SIMPLE_JWT.get("REFRESH_TOKEN_LIFETIME").total_seconds()),
            path="/api/",
        )

        return response

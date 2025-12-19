from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


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
    """POST: username/password -> {access, refresh, user{...}}"""

    serializer_class = LoginSerializer

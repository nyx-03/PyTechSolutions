from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

from api.serializers import MeSerializer


class MeView(APIView):
    """GET /api/auth/me/

    Cookie-based authentication endpoint.
    Reads the access token from HttpOnly cookie and returns the current user.
    """

    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        cookie_name = settings.SIMPLE_JWT.get("AUTH_COOKIE", "pt_access")
        access_token = request.COOKIES.get(cookie_name)

        if not access_token:
            return Response({"detail": "Not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)

        jwt_authenticator = JWTAuthentication()

        try:
            validated_token = jwt_authenticator.get_validated_token(access_token)
            user = jwt_authenticator.get_user(validated_token)
        except (InvalidToken, TokenError):
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = MeSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

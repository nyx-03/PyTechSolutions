from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

from api.serializers import MeSerializer
from api.auth.authentication import CookieJWTAuthentication


class MeView(APIView):
    """GET /api/auth/me/

    Cookie-based authentication endpoint.
    Reads the access token from HttpOnly cookie and returns the current user.
    """

    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "Not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = MeSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

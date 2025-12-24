from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken


class LogoutView(APIView):
    """POST /api/auth/logout/

    Cookie-based logout:
    - Reads refresh token from HttpOnly cookie
    - Blacklists refresh token (if blacklist app is enabled)
    - Clears access + refresh cookies

    Response never exposes tokens.
    """

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        access_cookie_name = settings.SIMPLE_JWT.get("AUTH_COOKIE", "pt_access")
        refresh_cookie_name = settings.SIMPLE_JWT.get("AUTH_COOKIE_REFRESH", "pt_refresh")

        refresh_token_str = request.COOKIES.get(refresh_cookie_name)

        # Try to blacklist the refresh token if present.
        if refresh_token_str:
            try:
                token = RefreshToken(refresh_token_str)
                try:
                    token.blacklist()
                except Exception:
                    # If blacklist app isn't enabled, ignore silently.
                    pass
            except TokenError:
                # Invalid/expired refresh -> still clear cookies.
                pass

        resp = Response({"detail": "Logged out successfully."}, status=status.HTTP_200_OK)
        resp.delete_cookie(access_cookie_name, path="/api/")
        resp.delete_cookie(refresh_cookie_name, path="/api/")
        return resp

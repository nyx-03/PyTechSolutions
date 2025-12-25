"""Authentication helpers for PyTechSolutions backend.

This module centralizes the cookie-based JWT authentication used by the Next.js admin.

It is compatible with DRF + djangorestframework-simplejwt.

Usage on a view:

    from rest_framework.permissions import IsAdminUser
    from api.auth.authentication import CookieJWTAuthentication

    class MyAdminView(APIView):
        authentication_classes = [CookieJWTAuthentication]
        permission_classes = [IsAdminUser]

Cookie name:
- Defaults to `pt_access`
- Can be overridden via settings.SIMPLE_JWT['AUTH_COOKIE']
"""

from __future__ import annotations

from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


class CookieJWTAuthentication(JWTAuthentication):
    """JWT auth that first reads the access token from an HttpOnly cookie.

    Order:
    1) Cookie token (settings.SIMPLE_JWT['AUTH_COOKIE'] or 'pt_access')
    2) Authorization header ("Bearer <token>")

    DRF contract:
    - Return None when no credentials are provided.
    - Raise AuthenticationFailed when credentials are provided but invalid.
    """

    def _get_cookie_name(self) -> str:
        cfg = getattr(settings, "SIMPLE_JWT", {}) or {}
        return cfg.get("AUTH_COOKIE", "pt_access")

    def _get_token_from_cookie(self, request):
        cookie_name = self._get_cookie_name()
        return request.COOKIES.get(cookie_name)

    def authenticate(self, request):
        # 1) Try cookie
        raw_token = self._get_token_from_cookie(request)

        # 2) Fallback to Authorization header
        if not raw_token:
            header = self.get_header(request)
            if header is None:
                return None
            raw_token = self.get_raw_token(header)
            if raw_token is None:
                return None

        try:
            validated_token = self.get_validated_token(raw_token)
            user = self.get_user(validated_token)
        except (InvalidToken, TokenError) as exc:
            raise AuthenticationFailed("Invalid or expired token.") from exc

        return (user, validated_token)
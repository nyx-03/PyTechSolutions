from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken


class RefreshView(APIView):
    """POST: refresh cookie -> sets a new access cookie (and optionally rotates refresh)."""

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        access_cookie_name = settings.SIMPLE_JWT.get("AUTH_COOKIE", "pt_access")
        refresh_cookie_name = settings.SIMPLE_JWT.get("AUTH_COOKIE_REFRESH", "pt_refresh")

        refresh_token_str = request.COOKIES.get(refresh_cookie_name)
        if not refresh_token_str:
            return Response({"detail": "Refresh cookie missing."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token_str)
        except Exception:
            # Invalid refresh -> clear cookies to be safe
            resp = Response({"detail": "Invalid refresh token."}, status=status.HTTP_401_UNAUTHORIZED)
            resp.delete_cookie(access_cookie_name, path="/api/")
            resp.delete_cookie(refresh_cookie_name, path="/api/")
            return resp

        # Always mint a new access token
        access_token_str = str(refresh.access_token)

        resp = Response({"detail": "Token refreshed."}, status=status.HTTP_200_OK)

        # Update access cookie
        resp.set_cookie(
            access_cookie_name,
            access_token_str,
            httponly=settings.SIMPLE_JWT.get("AUTH_COOKIE_HTTP_ONLY", True),
            secure=settings.SIMPLE_JWT.get("AUTH_COOKIE_SECURE", False),
            samesite=settings.SIMPLE_JWT.get("AUTH_COOKIE_SAMESITE", "Lax"),
            max_age=int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds()),
            path="/api/",
        )

        # Optional refresh rotation (recommended in prod)
        if settings.SIMPLE_JWT.get("ROTATE_REFRESH_TOKENS", False):
            try:
                user_id = refresh.get("user_id")
                if user_id is None:
                    raise ValueError("Missing user_id in refresh token")

                User = get_user_model()
                user = User.objects.get(id=user_id)

                # Blacklist the used refresh token if configured and supported
                if settings.SIMPLE_JWT.get("BLACKLIST_AFTER_ROTATION", False):
                    try:
                        refresh.blacklist()
                    except Exception:
                        # If blacklist app isn't enabled, ignore silently
                        pass

                new_refresh = RefreshToken.for_user(user)
                new_refresh_str = str(new_refresh)

                resp.set_cookie(
                    refresh_cookie_name,
                    new_refresh_str,
                    httponly=settings.SIMPLE_JWT.get("AUTH_COOKIE_HTTP_ONLY", True),
                    secure=settings.SIMPLE_JWT.get("AUTH_COOKIE_SECURE", False),
                    samesite=settings.SIMPLE_JWT.get("AUTH_COOKIE_SAMESITE", "Lax"),
                    max_age=int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
                    path="/api/",
                )
            except Exception:
                # If rotation fails for any reason, fail closed and clear cookies
                resp = Response({"detail": "Invalid refresh token."}, status=status.HTTP_401_UNAUTHORIZED)
                resp.delete_cookie(access_cookie_name, path="/api/")
                resp.delete_cookie(refresh_cookie_name, path="/api/")
                return resp

        return resp
"""JWT configuration shared across environments.

This module centralizes SIMPLE_JWT settings, especially cookie-based auth.
Import it in base.py:

    from .jwt import SIMPLE_JWT
"""

from __future__ import annotations

import os
from datetime import timedelta


def _env(name: str, default: str | None = None) -> str | None:
    value = os.getenv(name)
    return value if value not in (None, "") else default


def _env_bool(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "y", "on"}


SIMPLE_JWT = {
    # ------------------------------------------------------------------
    # Token lifetime
    # ------------------------------------------------------------------
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=int(_env("JWT_ACCESS_MINUTES", "5"))),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=int(_env("JWT_REFRESH_DAYS", "7"))),

    # ------------------------------------------------------------------
    # Rotation & blacklist
    # ------------------------------------------------------------------
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,

    # ------------------------------------------------------------------
    # Cookie-based auth (HttpOnly)
    # ------------------------------------------------------------------
    "AUTH_COOKIE": _env("JWT_AUTH_COOKIE", "pt_access"),
    "AUTH_COOKIE_REFRESH": _env("JWT_AUTH_COOKIE_REFRESH", "pt_refresh"),

    "AUTH_COOKIE_HTTP_ONLY": True,
    "AUTH_COOKIE_SECURE": _env_bool("JWT_COOKIE_SECURE", False),
    "AUTH_COOKIE_SAMESITE": _env("JWT_COOKIE_SAMESITE", "Lax"),

    # Cookies are explicitly scoped to /api in views (login / refresh / logout)

    # ------------------------------------------------------------------
    # Header auth (kept for tests / tooling)
    # ------------------------------------------------------------------
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",

    # ------------------------------------------------------------------
    # User
    # ------------------------------------------------------------------
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
}

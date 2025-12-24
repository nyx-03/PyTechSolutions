"""Development settings.

These settings extend `base.py` and are intended for local development only.
Never use this configuration in production.
"""

from .base import *  # noqa


# --------------------------------------------------------------------------------------
# Core
# --------------------------------------------------------------------------------------

DEBUG = True

# Local + LAN hosts for development
ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "192.168.1.140",
]


# --------------------------------------------------------------------------------------
# CORS / CSRF (Next.js local dev)
# --------------------------------------------------------------------------------------

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.1.140:3000",
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.1.140:3000",
]

# Cookies should NOT be secure in local dev (HTTP)
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False

# JWT cookies must not be secure in local HTTP dev
SIMPLE_JWT["AUTH_COOKIE_SECURE"] = False


# --------------------------------------------------------------------------------------
# Database (dev convenience)
# --------------------------------------------------------------------------------------

# Keep sqlite by default for dev unless overridden by env
DATABASES["default"]["ENGINE"] = "django.db.backends.sqlite3"
DATABASES["default"]["NAME"] = BASE_DIR / "db.sqlite3"


# --------------------------------------------------------------------------------------
# Email
# --------------------------------------------------------------------------------------

# Print emails to console in dev
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"


# --------------------------------------------------------------------------------------
# Security (relaxed for dev)
# --------------------------------------------------------------------------------------

SECURE_SSL_REDIRECT = False
SECURE_HSTS_SECONDS = 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = False
SECURE_HSTS_PRELOAD = False
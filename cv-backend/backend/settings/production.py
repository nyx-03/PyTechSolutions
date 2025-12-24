"""Production settings.

These settings extend `base.py` and are intended for real deployment environments.
All security-related options are enabled by default.
"""

from .base import *  # noqa


# --------------------------------------------------------------------------------------
# Core
# --------------------------------------------------------------------------------------

DEBUG = False

# Hosts must be explicitly provided via env in production
ALLOWED_HOSTS = _env_list("DJANGO_ALLOWED_HOSTS", default=[])

if not ALLOWED_HOSTS:
    raise RuntimeError("DJANGO_ALLOWED_HOSTS must be set in production")


# --------------------------------------------------------------------------------------
# CORS / CSRF
# --------------------------------------------------------------------------------------

# These must be explicitly defined via environment variables
CORS_ALLOWED_ORIGINS = _env_list("CORS_ALLOWED_ORIGINS", default=[])
CSRF_TRUSTED_ORIGINS = _env_list("CSRF_TRUSTED_ORIGINS", default=[])

if not CORS_ALLOWED_ORIGINS:
    raise RuntimeError("CORS_ALLOWED_ORIGINS must be set in production")

if not CSRF_TRUSTED_ORIGINS:
    raise RuntimeError("CSRF_TRUSTED_ORIGINS must be set in production")


# --------------------------------------------------------------------------------------
# Cookies & HTTPS security
# --------------------------------------------------------------------------------------

CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True

# JWT cookies
SIMPLE_JWT["AUTH_COOKIE_SECURE"] = True

# If behind a reverse proxy (nginx / traefik)
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

SECURE_SSL_REDIRECT = True

SECURE_HSTS_SECONDS = 60 * 60 * 24 * 30  # 30 days
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True


# --------------------------------------------------------------------------------------
# Email (real SMTP)
# --------------------------------------------------------------------------------------

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = _env("EMAIL_HOST")
if not EMAIL_HOST:
    raise RuntimeError("EMAIL_HOST must be set in production")
EMAIL_PORT = int(_env("EMAIL_PORT", "587"))
EMAIL_HOST_USER = _env("EMAIL_HOST_USER")
if not EMAIL_HOST_USER:
    raise RuntimeError("EMAIL_HOST_USER must be set in production")
EMAIL_HOST_PASSWORD = _env("EMAIL_HOST_PASSWORD")
if not EMAIL_HOST_PASSWORD:
    raise RuntimeError("EMAIL_HOST_PASSWORD must be set in production")
EMAIL_USE_TLS = _env_bool("EMAIL_USE_TLS", True)
DEFAULT_FROM_EMAIL = _env("DEFAULT_FROM_EMAIL", "no-reply@pytechsolutions.fr")


# --------------------------------------------------------------------------------------
# Logging
# --------------------------------------------------------------------------------------

LOGGING["root"]["level"] = _env("DJANGO_LOG_LEVEL", "WARNING")

"""Base Django settings shared by all environments.

This project uses a split settings layout:
- backend.settings.base (this file)
- backend.settings.dev
- backend.settings.production

Only put *shared* settings here. Environment-specific overrides belong in
`dev.py` or `production.py`.
"""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

from .jwt import SIMPLE_JWT
from .logging import LOGGING


# --------------------------------------------------------------------------------------
# Paths & environment helpers
# --------------------------------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Load environment variables from project root (.env)
load_dotenv(BASE_DIR / ".env")


def _env(name: str, default: str | None = None) -> str | None:
    value = os.getenv(name)
    return value if value not in (None, "") else default


def _env_bool(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "y", "on"}


def _env_list(name: str, default: list[str] | None = None, sep: str = ",") -> list[str]:
    value = os.getenv(name)
    if value is None or value.strip() == "":
        return default or []
    return [v.strip() for v in value.split(sep) if v.strip()]


# --------------------------------------------------------------------------------------
# Core
# --------------------------------------------------------------------------------------

SECRET_KEY = _env("DJANGO_SECRET_KEY", "django-insecure-dev-only-change-me")

# DEBUG must be defined in dev.py / production.py
DEBUG = _env_bool("DJANGO_DEBUG", default=False)

ALLOWED_HOSTS = _env_list("DJANGO_ALLOWED_HOSTS", default=["localhost", "127.0.0.1"])


# --------------------------------------------------------------------------------------
# Applications
# --------------------------------------------------------------------------------------

INSTALLED_APPS = [
    # Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party
    "corsheaders",
    "rest_framework",
    "rest_framework.authtoken",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",

    # Local
    "api",
    "cv",
    "contact", 
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",

    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    }
]

WSGI_APPLICATION = "backend.wsgi.application"


# --------------------------------------------------------------------------------------
# Database
# --------------------------------------------------------------------------------------

# Prefer DATABASE_URL in all envs; dev.py can override to sqlite if desired.
DATABASES = {
    "default": {
        "ENGINE": _env("DB_ENGINE", "django.db.backends.sqlite3"),
        "NAME": _env("DB_NAME", str(BASE_DIR / "db.sqlite3")),
        "USER": _env("DB_USER", ""),
        "PASSWORD": _env("DB_PASSWORD", ""),
        "HOST": _env("DB_HOST", ""),
        "PORT": _env("DB_PORT", ""),
    }
}


# --------------------------------------------------------------------------------------
# Password validation
# --------------------------------------------------------------------------------------

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# --------------------------------------------------------------------------------------
# Internationalization
# --------------------------------------------------------------------------------------

LANGUAGE_CODE = "fr-fr"
TIME_ZONE = "Europe/Paris"
USE_I18N = True
USE_TZ = True


# --------------------------------------------------------------------------------------
# Static files
# --------------------------------------------------------------------------------------

STATIC_URL = "/static/"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# --------------------------------------------------------------------------------------
# DRF & JWT
# --------------------------------------------------------------------------------------

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.AllowAny",
    ),
}


# --------------------------------------------------------------------------------------
# CORS / CSRF (cookie auth)
# --------------------------------------------------------------------------------------

CORS_ALLOW_CREDENTIALS = True

# Allow headers needed for CSRF cookie auth
from corsheaders.defaults import default_headers  # noqa: E402

CORS_ALLOW_HEADERS = list(default_headers) + [
    "x-csrftoken",
]

# Default origins should be overridden in dev.py/production.py
CORS_ALLOWED_ORIGINS = _env_list("CORS_ALLOWED_ORIGINS", default=[])

CSRF_COOKIE_NAME = "csrftoken"
CSRF_TRUSTED_ORIGINS = _env_list("CSRF_TRUSTED_ORIGINS", default=[])

# Cookie security flags (override in production.py)
CSRF_COOKIE_SECURE = _env_bool("CSRF_COOKIE_SECURE", default=False)
SESSION_COOKIE_SECURE = _env_bool("SESSION_COOKIE_SECURE", default=False)
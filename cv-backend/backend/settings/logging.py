"""Central logging configuration.

Import and use `LOGGING` from this module in your settings.

Example in base.py:

    from .logging import LOGGING

You can still override levels/handlers in dev.py or production.py by mutating
`LOGGING` after import.
"""

from __future__ import annotations

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
LOG_DIR = BASE_DIR / "logs"
LOG_DIR.mkdir(exist_ok=True)
LOG_FILE = LOG_DIR / "django.log"


def _env(name: str, default: str | None = None) -> str | None:
    value = os.getenv(name)
    return value if value not in (None, "") else default


def build_logging(level: str | None = None) -> dict:
    """Return a sane default logging dict.

    - Console output only (works well in Docker and local dev)
    - Request errors are visible
    - Django/DRF logs are not too noisy by default
    """

    lvl = (level or _env("DJANGO_LOG_LEVEL", "INFO") or "INFO").upper()

    return {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "simple": {
                "format": "%(levelname)s %(name)s: %(message)s",
            },
            "verbose": {
                "format": "%(asctime)s %(levelname)s %(name)s: %(message)s",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "verbose",
            },
            "file": {
                "class": "logging.handlers.RotatingFileHandler",
                "filename": str(LOG_FILE),
                "maxBytes": 5 * 1024 * 1024,  # 5 MB
                "backupCount": 5,
                "formatter": "verbose",
            },
        },
        "root": {
            "handlers": ["console", "file"],
            "level": lvl,
        },
        "loggers": {
            "django.request": {
                "handlers": ["console", "file"],
                "level": "WARNING",
                "propagate": False,
            },
            "django.server": {
                "handlers": ["console", "file"],
                "level": "INFO",
                "propagate": False,
            },
            "django.db.backends": {
                "handlers": ["console", "file"],
                "level": _env("DJANGO_DB_LOG_LEVEL", "WARNING"),
                "propagate": False,
            },
        },
    }


# Default export used by settings modules
LOGGING = build_logging()
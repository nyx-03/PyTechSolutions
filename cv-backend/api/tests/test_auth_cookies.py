import pytest
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from rest_framework.test import APIClient

pytestmark = pytest.mark.django_db
User = get_user_model()


def create_staff_user():
    user = User.objects.create_user(
        username="admin",
        password="pass123",
        email="admin@test.com",
        is_staff=True,
    )
    g = Group.objects.create(name="Admin")
    perms = Permission.objects.filter(
        codename__in=[
            "add_realisation",
            "change_realisation",
            "delete_realisation",
            "view_realisation",
        ]
    )
    g.permissions.set(perms)
    user.groups.add(g)
    return user


# ---------- LOGIN ----------

def test_login_sets_http_only_cookies_and_returns_user_payload():
    create_staff_user()
    client = APIClient()

    resp = client.post(
        "/api/auth/login/",
        {"username": "admin", "password": "pass123"},
        format="json",
    )

    assert resp.status_code == 200

    # Cookies must be set
    cookies = resp.cookies
    assert "pt_access" in cookies
    assert "pt_refresh" in cookies

    # Tokens must NOT be exposed in JSON
    data = resp.json()
    assert "access" not in data
    assert "refresh" not in data
    # Roles and permissions are nested under the `user` payload
    assert "user" in data and isinstance(data["user"], dict)
    assert "roles" in data["user"]
    assert "permissions" in data["user"]


# ---------- ME ----------

def test_me_requires_cookie_and_returns_user():
    create_staff_user()
    client = APIClient()

    # No cookies
    no = client.get("/api/auth/me/")
    assert no.status_code == 401

    # Login sets cookies
    login = client.post(
        "/api/auth/login/",
        {"username": "admin", "password": "pass123"},
        format="json",
    )

    # client now has cookies
    me = client.get("/api/auth/me/")
    assert me.status_code == 200
    body = me.json()
    assert body["username"] == "admin"
    assert "roles" in body


# ---------- REFRESH ----------

def test_refresh_uses_cookie_and_sets_new_access():
    create_staff_user()
    client = APIClient()

    login = client.post(
        "/api/auth/login/",
        {"username": "admin", "password": "pass123"},
        format="json",
    )

    # Refresh without JSON body
    resp = client.post("/api/auth/refresh/")
    assert resp.status_code == 200

    # New access cookie must be set
    assert "pt_access" in resp.cookies


# ---------- LOGOUT ----------

def test_logout_clears_cookies():
    create_staff_user()
    client = APIClient()

    login = client.post(
        "/api/auth/login/",
        {"username": "admin", "password": "pass123"},
        format="json",
    )

    resp = client.post("/api/auth/logout/")
    assert resp.status_code == 200

    # Cookies should be deleted
    assert resp.cookies.get("pt_access").value == ""
    assert resp.cookies.get("pt_refresh").value == ""


# ---------- NEGATIVE CASES ----------

def test_refresh_fails_without_cookie():
    client = APIClient()
    resp = client.post("/api/auth/refresh/")
    assert resp.status_code == 401


def test_me_fails_with_invalid_cookie():
    client = APIClient()
    client.cookies.load({"pt_access": "invalid"})
    resp = client.get("/api/auth/me/")
    assert resp.status_code == 401
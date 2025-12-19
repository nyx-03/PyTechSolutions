import pytest
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from rest_framework.test import APIClient

pytestmark = pytest.mark.django_db
User = get_user_model()

def create_staff_user():
    user = User.objects.create_user(username="admin", password="pass123", email="admin@test.com", is_staff=True)
    g = Group.objects.create(name="Admin")
    # optionnel : lui donner des perms
    perms = Permission.objects.filter(codename__in=["add_realisation","change_realisation","delete_realisation","view_realisation"])
    g.permissions.set(perms)
    user.groups.add(g)
    return user

def test_login_returns_tokens_and_user_payload():
    create_staff_user()
    client = APIClient()

    resp = client.post("/api/auth/login/", {"username":"admin","password":"pass123"}, format="json")
    assert resp.status_code == 200
    data = resp.json()
    assert "access" in data and "refresh" in data
    assert "user" in data
    assert "roles" in data["user"]
    assert "permissions" in data["user"]

def test_me_requires_auth_and_returns_roles():
    create_staff_user()
    client = APIClient()

    no = client.get("/api/auth/me/")
    assert no.status_code in (401, 403)

    login = client.post("/api/auth/login/", {"username":"admin","password":"pass123"}, format="json").json()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {login['access']}")
    me = client.get("/api/auth/me/")
    assert me.status_code == 200
    assert "roles" in me.json()

def test_refresh_returns_new_access():
    create_staff_user()
    client = APIClient()
    login = client.post("/api/auth/login/", {"username":"admin","password":"pass123"}, format="json").json()

    resp = client.post("/api/auth/token/refresh/", {"refresh": login["refresh"]}, format="json")
    assert resp.status_code == 200
    assert "access" in resp.json()

def test_logout_ok_when_authenticated():
    create_staff_user()
    client = APIClient()
    login = client.post("/api/auth/login/", {"username":"admin","password":"pass123"}, format="json").json()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {login['access']}")

    out = client.post("/api/auth/logout/", {}, format="json")
    assert out.status_code == 200
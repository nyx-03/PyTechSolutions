import pytest
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework.test import APIClient

pytestmark = pytest.mark.django_db
User = get_user_model()


def login_access_cookie(client, username, password):
    resp = client.post(
        "/api/auth/login/",
        {"username": username, "password": password},
        format="json",
    )
    assert resp.status_code == 200
    assert "pt_access" in resp.cookies, "Expected pt_access cookie to be set on login"
    return resp.cookies["pt_access"].value


def auth_client(access_token):
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
    return client


def ensure_group(name):
    return Group.objects.get_or_create(name=name)[0]


def test_admin_users_requires_auth():
    client = APIClient()
    resp = client.get("/api/admin/users/")
    assert resp.status_code in (401, 403)


def test_admin_users_forbidden_for_non_admin_role():
    editor_group = ensure_group("Editor")

    user = User.objects.create_user(
        username="editor",
        password="pass123",
        email="editor@test.com",
        is_staff=True,
    )
    user.groups.add(editor_group)

    client = APIClient()
    access = login_access_cookie(client, "editor", "pass123")

    c = auth_client(access)
    resp = c.get("/api/admin/users/")
    assert resp.status_code == 403


def test_admin_users_list_ok_for_admin_group():
    admin_group = ensure_group("Admin")

    admin = User.objects.create_user(
        username="admin",
        password="pass123",
        email="admin@test.com",
        is_staff=True,
    )
    admin.groups.add(admin_group)

    User.objects.create_user(
        username="u2",
        password="pass123",
        email="u2@test.com",
        is_staff=True,
    )

    client = APIClient()
    access = login_access_cookie(client, "admin", "pass123")

    c = auth_client(access)
    resp = c.get("/api/admin/users/")
    assert resp.status_code == 200

    data = resp.json()
    assert isinstance(data, list)
    usernames = [u["username"] for u in data]
    assert "admin" in usernames
    assert "u2" in usernames


def test_admin_users_can_update_roles_via_patch():
    admin_group = ensure_group("Admin")
    viewer_group = ensure_group("Viewer")
    ensure_group("Editor")

    admin = User.objects.create_user(
        username="admin",
        password="pass123",
        is_staff=True,
    )
    admin.groups.add(admin_group)

    target = User.objects.create_user(
        username="target",
        password="pass123",
        is_staff=True,
    )
    target.groups.add(viewer_group)

    client = APIClient()
    access = login_access_cookie(client, "admin", "pass123")

    c = auth_client(access)

    resp = c.patch(
        f"/api/admin/users/{target.id}/",
        {"roles": ["Editor"]},
        format="json",
    )
    assert resp.status_code == 200

    target.refresh_from_db()
    assert list(target.groups.values_list("name", flat=True)) == ["Editor"]

import pytest
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from rest_framework.test import APIClient
from api.models import Realisation

pytestmark = pytest.mark.django_db
User = get_user_model()


def ensure_admin_group_with_realisations_perms():
    """Create/update the 'Admin' group with full Realisation model permissions."""
    group, _ = Group.objects.get_or_create(name="Admin")
    ct = ContentType.objects.get_for_model(Realisation)
    perms = Permission.objects.filter(
        content_type=ct,
        codename__in=[
            "view_realisation",
            "add_realisation",
            "change_realisation",
            "delete_realisation",
        ],
    )
    group.permissions.set(perms)

    # Ensure permissions exist (if this fails, migrations/contenttypes/permissions aren't ready)
    assert perms.count() == 4, f"Expected 4 Realisation perms, got {perms.count()}"

    return group

def login_access_cookie(username, password):
    """Login and return the access token value from the HttpOnly cookie."""
    client = APIClient()
    resp = client.post(
        "/api/auth/login/",
        {"username": username, "password": password},
        format="json",
    )
    assert resp.status_code == 200
    assert "pt_access" in resp.cookies, "Expected pt_access cookie to be set on login"
    return resp.cookies["pt_access"].value

def test_admin_realisations_requires_staff():
    User.objects.create_user(username="u", password="pass123", is_staff=False)
    client = APIClient()
    access = login_access_cookie("u", "pass123")
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

    resp = client.get("/api/admin/realisations/")
    assert resp.status_code in (401, 403)

def test_admin_realisations_crud_staff_ok():
    admin = User.objects.create_user(username="admin", password="pass123", is_staff=True)
    admin_group = ensure_admin_group_with_realisations_perms()
    admin.groups.add(admin_group)
    admin.refresh_from_db()

    # Sanity check: the user must be in Admin group for RBAC to allow CRUD
    assert admin.groups.filter(name="Admin").exists(), "Admin user is not in 'Admin' group"

    client = APIClient()
    access = login_access_cookie("admin", "pass123")
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

    # CREATE
    payload = {"title":"R1","content":"Contenu","type":"web","status":"draft"}
    create = client.post("/api/admin/realisations/", payload, format="json")
    assert create.status_code == 201
    rid = create.json()["id"]

    # LIST sees drafts too
    lst = client.get("/api/admin/realisations/")
    assert lst.status_code == 200
    assert len(lst.json()) >= 1

    # PATCH
    patch = client.patch(f"/api/admin/realisations/{rid}/", {"status":"published"}, format="json")
    assert patch.status_code == 200

    # DELETE
    delete = client.delete(f"/api/admin/realisations/{rid}/")
    assert delete.status_code == 204
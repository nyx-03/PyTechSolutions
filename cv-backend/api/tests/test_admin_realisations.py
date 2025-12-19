import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from api.models import Realisation

pytestmark = pytest.mark.django_db
User = get_user_model()

def login_token(username, password):
    client = APIClient()
    data = client.post("/api/auth/login/", {"username": username, "password": password}, format="json").json()
    return data["access"]

def test_admin_realisations_requires_staff():
    User.objects.create_user(username="u", password="pass123", is_staff=False)
    client = APIClient()
    access = login_token("u", "pass123")
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

    resp = client.get("/api/admin/realisations/")
    assert resp.status_code in (401, 403)

def test_admin_realisations_crud_staff_ok():
    User.objects.create_user(username="admin", password="pass123", is_staff=True)
    client = APIClient()
    access = login_token("admin", "pass123")
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
import pytest
from rest_framework.test import APIClient

from api.models import Realisation, Testimonial as TestimonialModel
from contact.models import ContactMessage

pytestmark = pytest.mark.django_db


def test_public_realisations_list_only_published():
    Realisation.objects.create(title="Draft", content="x", type="web", status="draft")
    Realisation.objects.create(title="Pub", content="x", type="web", status="published")

    client = APIClient()
    resp = client.get("/api/realisations/")
    assert resp.status_code == 200

    titles = [r["title"] for r in resp.json()]
    assert "Pub" in titles
    assert "Draft" not in titles


def test_public_realisations_detail_published_ok_draft_404():
    pub = Realisation.objects.create(title="Pub", content="x", type="web", status="published")
    draft = Realisation.objects.create(title="Draft", content="x", type="web", status="draft")

    client = APIClient()

    resp_pub = client.get(f"/api/realisations/{pub.slug}/")
    assert resp_pub.status_code == 200

    resp_draft = client.get(f"/api/realisations/{draft.slug}/")
    assert resp_draft.status_code in (404, 403)


def test_public_testimonials_list():
    kwargs = {"name": "Alice", "quote": "Top", "order": 1}
    # If the model uses a publication flag, ensure the item is visible on public endpoints.
    if hasattr(TestimonialModel, "is_published"):
        kwargs["is_published"] = True
    TestimonialModel.objects.create(**kwargs)

    client = APIClient()
    resp = client.get("/api/testimonials/")
    assert resp.status_code == 200
    assert len(resp.json()) == 1


def test_contact_post_creates_message_and_validates_length():
    client = APIClient()

    bad = client.post(
        "/api/contact/",
        {"name": "Ludo", "email": "a@b.com", "message": "Salut"},
        format="json",
    )
    assert bad.status_code == 400

    ok = client.post(
        "/api/contact/",
        {"name": "Ludo", "email": "a@b.com", "message": "Bonjour, ceci est un message."},
        format="json",
    )
    assert ok.status_code == 201
    assert ContactMessage.objects.count() == 1
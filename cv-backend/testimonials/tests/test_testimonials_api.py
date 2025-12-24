from api.models import Realisation
from testimonials.models import Testimonial as TestimonialModel
import pytest
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_public_testimonials_list():
    from django.utils import timezone

    TestimonialModel.objects.create(
        author_name="Alice",
        quote="This is a published testimonial with enough length.",
        sort_order=1,
        is_published=True,
        published_at=timezone.now(),
    )

    client = APIClient()
    response = client.get("/api/testimonials/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["author_name"] == "Alice"
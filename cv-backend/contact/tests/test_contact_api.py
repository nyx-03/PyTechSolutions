import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from api.models import Realisation, Testimonial as TestimonialModel
from contact.models import ContactMessage


@pytest.mark.django_db
class TestContactAPI:
    def setup_method(self):
        self.client = APIClient()
        self.url = "/api/contact/"

    def test_create_contact_message_success(self):
        payload = {
            "name": "John Doe",
            "email": "john@example.com",
            "subject": "Hello",
            "message": "This is a valid contact message.",
        }

        resp = self.client.post(self.url, payload, format="json")

        assert resp.status_code == 201
        assert ContactMessage.objects.count() == 1

        msg = ContactMessage.objects.first()
        assert msg.name == payload["name"]
        assert msg.email == payload["email"]
        assert msg.subject == payload["subject"]
        assert msg.status == ContactMessage.STATUS_NEW

    def test_create_contact_message_missing_field(self):
        payload = {
            "name": "John Doe",
            "email": "john@example.com",
        }

        resp = self.client.post(self.url, payload, format="json")

        assert resp.status_code == 400
        assert ContactMessage.objects.count() == 0

    def test_create_contact_message_message_too_short(self):
        payload = {
            "name": "John Doe",
            "email": "john@example.com",
            "message": "Hi",
        }

        resp = self.client.post(self.url, payload, format="json")

        assert resp.status_code == 400
        assert "message" in resp.json()
        assert ContactMessage.objects.count() == 0

    def test_honeypot_rejects_submission(self):
        payload = {
            "name": "Spammer",
            "email": "spam@example.com",
            "message": "This is a spam message that looks valid.",
            "website": "https://spam.example.com",
        }

        resp = self.client.post(self.url, payload, format="json")

        assert resp.status_code == 400
        assert ContactMessage.objects.count() == 0

    def test_email_failure_does_not_break_request(self, settings, monkeypatch):
        def fail_send_mail(*args, **kwargs):
            raise Exception("SMTP down")

        monkeypatch.setattr("contact.views.send_mail", fail_send_mail)

        payload = {
            "name": "John Doe",
            "email": "john@example.com",
            "message": "This is a valid contact message with email failure.",
        }

        resp = self.client.post(self.url, payload, format="json")

        assert resp.status_code == 201
        assert ContactMessage.objects.count() == 1
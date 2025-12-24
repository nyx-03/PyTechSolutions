
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from django.core.mail import send_mail
from django.conf import settings

from .serializers import ContactMessageCreateSerializer


class ContactMessageCreateView(APIView):
    """Public endpoint to submit a contact message.

    - Saves the message in database
    - Sends an email notification (best effort)
    - Always returns 201 if data is valid, even if email fails
    """

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = ContactMessageCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Save message
        contact = serializer.save(
            ip_address=self._get_ip(request),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
        )

        # Send notification email (do not fail request if email errors)
        try:
            send_mail(
                subject=f"[Contact] {contact.subject or 'Nouveau message'}",
                message=contact.message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[getattr(settings, "CONTACT_TO_EMAIL", settings.DEFAULT_FROM_EMAIL)],
                fail_silently=False,
            )
        except Exception:
            # Email errors should not block contact creation
            pass

        return Response(
            {"detail": "Message received"},
            status=status.HTTP_201_CREATED,
        )

    @staticmethod
    def _get_ip(request):
        xff = request.META.get("HTTP_X_FORWARDED_FOR")
        if xff:
            return xff.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR")

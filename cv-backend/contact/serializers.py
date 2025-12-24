

from rest_framework import serializers

from .models import ContactMessage


class ContactMessageCreateSerializer(serializers.ModelSerializer):
    """Serializer used for public contact form submission."""

    # Honeypot field (must stay empty)
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = ContactMessage
        fields = [
            "name",
            "email",
            "subject",
            "message",
            "website",  # honeypot
        ]

    def validate_website(self, value):
        """Basic honeypot anti-spam.

        If this field is filled, we silently reject the submission.
        """
        if value:
            raise serializers.ValidationError("Invalid submission.")
        return value

    def validate_message(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Message is too short.")
        return value

    def create(self, validated_data):
        # Remove honeypot field before saving
        validated_data.pop("website", None)

        return ContactMessage.objects.create(**validated_data)
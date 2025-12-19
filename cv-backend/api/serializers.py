from rest_framework import serializers
from .models import Realisation, Testimonial, ContactMessage
from django.contrib.auth import get_user_model


class RealisationListSerializer(serializers.ModelSerializer):
    """Serializer used for listing realisations."""

    class Meta:
        model = Realisation
        fields = (
            "id",
            "title",
            "slug",
            "excerpt",
            "type",
            "stack",
            "featured",
            "created_at",
        )


class RealisationDetailSerializer(serializers.ModelSerializer):
    """Serializer used for realisation detail view."""

    class Meta:
        model = Realisation
        fields = (
            "id",
            "title",
            "slug",
            "excerpt",
            "content",
            "type",
            "stack",
            "featured",
            "created_at",
            "updated_at",
        )


class TestimonialSerializer(serializers.ModelSerializer):
    """Serializer for client testimonials."""

    class Meta:
        model = Testimonial
        fields = (
            "id",
            "name",
            "company",
            "role",
            "project",
            "quote",
            "stack",
        )


class ContactMessageSerializer(serializers.ModelSerializer):
    """Serializer for contact form submission."""

    class Meta:
        model = ContactMessage
        fields = (
            "name",
            "email",
            "message",
        )

    def validate_message(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError(
                "Le message doit contenir au moins 10 caractères."
            )
        return value


User = get_user_model()


class MeSerializer(serializers.ModelSerializer):
    """Serializer for the currently authenticated user (admin panel)."""

    roles = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "is_staff",
            "is_superuser",
            "roles",
            "permissions",
        )

    def get_roles(self, obj):
        return list(obj.groups.values_list("name", flat=True))

    def get_permissions(self, obj):
        return sorted(list(obj.get_all_permissions()))


class RealisationAdminSerializer(serializers.ModelSerializer):
    """Full serializer for admin CRUD on Realisation."""

    class Meta:
        model = Realisation
        fields = "__all__"
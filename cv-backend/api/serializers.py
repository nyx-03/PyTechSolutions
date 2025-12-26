from rest_framework import serializers
from .models import Realisation, Testimonial, ContactMessage
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group


class RealisationListSerializer(serializers.ModelSerializer):
    """Serializer used for listing realisations."""

    # Backward/forward compatibility: frontend expects `description`
    description = serializers.CharField(source="excerpt", read_only=True)

    class Meta:
        model = Realisation
        fields = (
            "id",
            "title",
            "slug",
            "excerpt",
            "description",
            "type",
            "stack",
            "featured",
            "created_at",
        )


class RealisationDetailSerializer(serializers.ModelSerializer):
    """Serializer used for realisation detail view."""

    # Backward/forward compatibility: frontend expects `description`
    description = serializers.CharField(source="excerpt", read_only=True)

    class Meta:
        model = Realisation
        fields = (
            "id",
            "title",
            "slug",
            "excerpt",
            "description",
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


# Admin-only serializer for managing users and their roles (groups)
class AdminUserSerializer(serializers.ModelSerializer):
    """
    Admin serializer for managing users and their roles (groups).

    - roles is exposed as a list of group names
    - roles can be updated via PATCH
    """

    roles = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False,
    )
    roles_display = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "is_active",
            "is_staff",
            "is_superuser",
            "roles",
            "roles_display",
        )
        read_only_fields = ("is_superuser",)

    def get_roles_display(self, obj):
        return list(obj.groups.values_list("name", flat=True))

    def update(self, instance, validated_data):
        roles = validated_data.pop("roles", None)

        # Update basic user fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update roles (groups) if provided
        if roles is not None:
            groups = Group.objects.filter(name__in=roles)
            instance.groups.set(groups)

        return instance
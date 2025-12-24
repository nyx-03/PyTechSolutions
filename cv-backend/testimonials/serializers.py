from rest_framework import serializers
from .models import Testimonial


class PublicTestimonialSerializer(serializers.ModelSerializer):
    """Serializer used for the public testimonials API.

    Only published testimonials should be exposed.
    """

    class Meta:
        model = Testimonial
        fields = [
            "id",
            "author_name",
            "author_role",
            "company",
            "quote",
            "rating",
            "published_at",
        ]


class AdminTestimonialSerializer(serializers.ModelSerializer):
    """Serializer used by admins to create / edit testimonials."""

    class Meta:
        model = Testimonial
        fields = [
            "id",
            "author_name",
            "author_role",
            "company",
            "quote",
            "rating",
            "is_published",
            "published_at",
            "sort_order",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at", "published_at"]

    def validate_quote(self, value: str) -> str:
        if len(value.strip()) < 20:
            raise serializers.ValidationError(
                "Testimonial text must contain at least 20 characters."
            )
        return value

    def validate_rating(self, value):
        if value is None:
            return value
        if not 1 <= value <= 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def create(self, validated_data):
        testimonial = super().create(validated_data)

        # Auto-set published_at when created as published
        if testimonial.is_published and testimonial.published_at is None:
            from django.utils import timezone

            testimonial.published_at = timezone.now()
            testimonial.save(update_fields=["published_at"])

        return testimonial

    def update(self, instance, validated_data):
        was_published = instance.is_published
        testimonial = super().update(instance, validated_data)

        # Handle publish / unpublish transitions
        if testimonial.is_published and not was_published:
            from django.utils import timezone

            testimonial.published_at = timezone.now()
            testimonial.save(update_fields=["published_at"])

        if not testimonial.is_published and was_published:
            testimonial.published_at = None
            testimonial.save(update_fields=["published_at"])

        return testimonial
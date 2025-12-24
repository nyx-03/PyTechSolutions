from django.contrib import admin
from .models import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = (
        "author_name",
        "company",
        "rating",
        "is_published",
        "published_at",
        "sort_order",
        "created_at",
    )

    list_filter = (
        "is_published",
        "rating",
        "company",
    )

    search_fields = (
        "author_name",
        "company",
        "quote",
    )

    ordering = ("sort_order", "-published_at", "-created_at")

    actions = ["publish_selected", "unpublish_selected"]

    def publish_selected(self, request, queryset):
        for testimonial in queryset:
            testimonial.publish()
        self.message_user(request, "Selected testimonials have been published.")

    publish_selected.short_description = "Publish selected testimonials"

    def unpublish_selected(self, request, queryset):
        queryset.update(is_published=False, published_at=None)
        self.message_user(request, "Selected testimonials have been unpublished.")

    unpublish_selected.short_description = "Unpublish selected testimonials"

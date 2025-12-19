from django.contrib import admin

from .models import Realisation, Testimonial, ContactMessage


@admin.register(Realisation)
class RealisationAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "type",
        "status",
        "featured",
        "created_at",
    )
    list_filter = ("status", "type", "featured")
    search_fields = ("title", "excerpt", "content", "stack")
    prepopulated_fields = {"slug": ("title",)}
    ordering = ("-created_at",)


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "company",
        "project",
        "order",
    )
    list_filter = ("company",)
    search_fields = ("name", "company", "quote")
    ordering = ("order",)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "email",
        "created_at",
    )
    search_fields = ("name", "email", "message")
    ordering = ("-created_at",)
    readonly_fields = (
        "name",
        "email",
        "message",
        "ip_address",
        "user_agent",
        "created_at",
        "updated_at",
    )

    def has_add_permission(self, request):
        return False

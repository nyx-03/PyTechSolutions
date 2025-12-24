from django.db import models


class Testimonial(models.Model):
    """Client testimonial displayed publicly on the website.

    Testimonials are created and managed by admins only.
    Only published testimonials are exposed via the public API.
    """

    __test__ = False

    author_name = models.CharField(max_length=150)
    author_role = models.CharField(max_length=150, blank=True)
    company = models.CharField(max_length=150, blank=True)

    quote = models.TextField()

    rating = models.PositiveSmallIntegerField(
        blank=True,
        null=True,
        help_text="Optional rating from 1 to 5",
    )

    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(blank=True, null=True)

    sort_order = models.PositiveIntegerField(
        default=0,
        help_text="Lower values appear first",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "-published_at", "-created_at"]
        verbose_name = "Testimonial"
        verbose_name_plural = "Testimonials"

    def __str__(self) -> str:
        return f"{self.author_name} ({self.company or 'N/A'})"

    def publish(self):
        """Mark testimonial as published."""
        from django.utils import timezone

        if not self.is_published:
            self.is_published = True
            self.published_at = timezone.now()
            self.save(update_fields=["is_published", "published_at"])

    def unpublish(self):
        """Unpublish testimonial."""
        if self.is_published:
            self.is_published = False
            self.published_at = None
            self.save(update_fields=["is_published", "published_at"])

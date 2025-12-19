from django.db import models
from django.utils.text import slugify


class TimeStampedModel(models.Model):
    """Abstract base model with created/updated timestamps."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Realisation(TimeStampedModel):
    """Business realisation / project showcased on the website."""

    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("published", "Published"),
    )

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    excerpt = models.TextField(blank=True)
    content = models.TextField()

    type = models.CharField(
        max_length=100,
        help_text="Type of project (web, api, desktop, etc.)",
    )

    stack = models.CharField(
        max_length=255,
        blank=True,
        help_text="Technologies used (comma separated)",
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="draft",
    )

    featured = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Testimonial(TimeStampedModel):
    """Client testimonial displayed on the website."""
    # Prevent pytest from collecting this model as a test class
    __test__ = False

    name = models.CharField(max_length=255)
    company = models.CharField(max_length=255, blank=True)
    role = models.CharField(max_length=255, blank=True)
    project = models.CharField(max_length=255, blank=True)

    quote = models.TextField()

    stack = models.CharField(
        max_length=255,
        blank=True,
        help_text="Technologies related to the project",
    )

    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return f"{self.name} – {self.company}" if self.company else self.name


class ContactMessage(TimeStampedModel):
    """Message sent from the contact form."""

    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()

    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Message from {self.name}"

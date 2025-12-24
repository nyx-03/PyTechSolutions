from django.db import models


class ContactMessage(models.Model):
    """A message submitted via the public contact form."""

    STATUS_NEW = "new"
    STATUS_PROCESSED = "processed"
    STATUS_SPAM = "spam"

    STATUS_CHOICES = (
        (STATUS_NEW, "New"),
        (STATUS_PROCESSED, "Processed"),
        (STATUS_SPAM, "Spam"),
    )

    name = models.CharField(max_length=150)
    email = models.EmailField()
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_NEW,
    )

    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Contact message"
        verbose_name_plural = "Contact messages"

    def __str__(self) -> str:
        return f"{self.name} <{self.email}> ({self.created_at:%Y-%m-%d})"

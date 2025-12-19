

from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType

from api.models import Realisation


class Command(BaseCommand):
    help = "Seed default roles (Admin, Editor, Viewer) with permissions"

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("Seeding roles and permissions"))

        content_type = ContentType.objects.get_for_model(Realisation)

        perms = {
            "view": Permission.objects.get(codename="view_realisation", content_type=content_type),
            "add": Permission.objects.get(codename="add_realisation", content_type=content_type),
            "change": Permission.objects.get(codename="change_realisation", content_type=content_type),
            "delete": Permission.objects.get(codename="delete_realisation", content_type=content_type),
        }

        roles = {
            "Viewer": [perms["view"]],
            "Editor": [perms["view"], perms["add"], perms["change"]],
            "Admin": [perms["view"], perms["add"], perms["change"], perms["delete"]],
        }

        for role_name, role_perms in roles.items():
            group, created = Group.objects.get_or_create(name=role_name)
            group.permissions.set(role_perms)
            group.save()

            if created:
                self.stdout.write(self.style.SUCCESS(f"Created group: {role_name}"))
            else:
                self.stdout.write(self.style.WARNING(f"Updated group: {role_name}"))

        self.stdout.write(self.style.SUCCESS("Role seeding completed successfully"))
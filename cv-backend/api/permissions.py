from rest_framework.permissions import DjangoModelPermissions, BasePermission


class DjangoModelPermissionsStrict(DjangoModelPermissions):
    """
    A stricter version of DjangoModelPermissions.

    - Requires authentication for any request.
    - Uses Django model permissions for each HTTP method.

    Typical mapping:
      GET/HEAD/OPTIONS -> view
      POST            -> add
      PUT/PATCH       -> change
      DELETE          -> delete

    This is ideal for a Next.js admin panel with multiple roles (Groups).
    """

    authenticated_users_only = True

    # Ensure PATCH is treated like change
    perms_map = {
        "GET": ["%(app_label)s.view_%(model_name)s"],
        "OPTIONS": [],
        "HEAD": [],
        "POST": ["%(app_label)s.add_%(model_name)s"],
        "PUT": ["%(app_label)s.change_%(model_name)s"],
        "PATCH": ["%(app_label)s.change_%(model_name)s"],
        "DELETE": ["%(app_label)s.delete_%(model_name)s"],
    }


class IsAdminRole(BasePermission):
    """
    Allows access only to users who are superusers
    or belong to the 'Admin' group.

    Used to protect admin-only endpoints (users, roles, etc.).
    """

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        if user.is_superuser:
            return True

        return user.groups.filter(name="Admin").exists()

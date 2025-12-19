from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from api.serializers import MeSerializer


class MeView(APIView):
    """
    Return the currently authenticated user with roles and permissions.

    Used by the Next.js admin panel to hydrate auth state and RBAC.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = MeSerializer(request.user)
        return Response(serializer.data)

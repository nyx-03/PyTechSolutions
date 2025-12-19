from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


class LogoutView(APIView):
    """
    Logout endpoint for JWT-based authentication.

    Since we are not using token blacklisting yet, logout is handled
    client-side by deleting stored access/refresh tokens.
    This endpoint exists for API consistency and future blacklist support.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        return Response(
            {"detail": "Logged out successfully."},
            status=status.HTTP_200_OK,
        )

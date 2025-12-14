from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Profile
from .serializers import ProfileSerializer


@api_view(["GET"])
def cv_detail(request):
    """
    Renvoie le CV (Profile + Skills + Experiences + Education + Languages + Extras) en JSON.
    """
    profile = Profile.objects.first()

    if profile is None:
        return Response(
            {"detail": "Aucun profil trouvé. Créez au moins un Profile dans l'admin."},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = ProfileSerializer(profile)
    return Response(serializer.data)

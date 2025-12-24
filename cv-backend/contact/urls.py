from django.urls import path

from .views import ContactMessageCreateView

app_name = "contact"

urlpatterns = [
    # POST /api/contact/
    path("", ContactMessageCreateView.as_view(), name="create"),
]

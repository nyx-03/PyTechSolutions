from django.contrib import admin
from django.urls import path, include
from cv.views import cv_detail

urlpatterns = [
    path('admin/', admin.site.urls),
    # API endpoints
    path('api/cv/<str:slug>/', cv_detail, name="cv-detail"),
    path('api/contact/', include('contact.urls')),
    path('api/', include('api.urls')),
]

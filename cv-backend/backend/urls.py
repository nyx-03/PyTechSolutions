from django.contrib import admin
from django.urls import path
from cv.views import cv_detail

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/cv/', cv_detail, name="cv-detail"),
]

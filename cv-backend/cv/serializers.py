from rest_framework import serializers
from .models import Profile, Skill, Experience, Education, Language, Extra


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["name", "level", "category"]


class ExperienceSerializer(serializers.ModelSerializer):
    start = serializers.DateField(source="start_date")
    end = serializers.DateField(source="end_date", allow_null=True)

    class Meta:
        model = Experience
        fields = ["company", "role", "start", "end", "description"]


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ["school", "degree", "year"]


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ["label", "level"]


class ExtraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Extra
        fields = ["text"]


class ProfileSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)
    experiences = ExperienceSerializer(many=True, read_only=True)
    education = EducationSerializer(many=True, read_only=True)
    languages = LanguageSerializer(many=True, read_only=True)
    extras = ExtraSerializer(many=True, read_only=True)

    contact = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            "name",
            "title",
            "summary",
            "location",
            "address",
            "useful_info",
            "availability",
            "contact",
            "skills",
            "experiences",
            "education",
            "languages",
            "extras",
        ]

    def get_contact(self, obj):
        return {
            "email": obj.email,
            "website": obj.website,
            "linkedin": obj.linkedin,
        }
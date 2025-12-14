from django.contrib import admin
from .models import Profile, Skill, Experience, Education, Language, Extra


class SkillInline(admin.TabularInline):
    model = Skill
    extra = 1


class ExperienceInline(admin.TabularInline):
    model = Experience
    extra = 1


class EducationInline(admin.TabularInline):
    model = Education
    extra = 1


class LanguageInline(admin.TabularInline):
    model = Language
    extra = 1


class ExtraInline(admin.TabularInline):
    model = Extra
    extra = 1


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("name", "title", "location", "email")
    inlines = [SkillInline, ExperienceInline, EducationInline, LanguageInline, ExtraInline]


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name", "profile", "category", "level")
    list_filter = ("category", "level")


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ("role", "company", "profile", "start_date", "end_date")
    list_filter = ("company", "profile")


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ("school", "degree", "profile", "year")


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ("label", "level", "profile")
    list_filter = ("level", "profile")


@admin.register(Extra)
class ExtraAdmin(admin.ModelAdmin):
    list_display = ("text", "profile")
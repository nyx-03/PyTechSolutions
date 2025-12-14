from django.db import models


class Profile(models.Model):
    """
    Représente le profil principal (le CV global d'une personne).
    On suppose ici qu'il y aura généralement un seul profil.
    """

    name = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    summary = models.TextField()
    location = models.CharField(max_length=200, blank=True)

    # Coordonnées
    email = models.EmailField(blank=True)
    website = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)

    # Nouveaux champs pour coller au layout du CV
    address = models.CharField(
        max_length=255,
        blank=True,
        help_text="Adresse postale affichée dans la colonne de gauche.",
    )
    useful_info = models.TextField(
        blank=True,
        help_text="Infos utiles : permis, véhicule, mobilité, remote, etc.",
    )
    availability = models.CharField(
        max_length=255,
        blank=True,
        help_text="Disponibilités : temps, type de missions, délai, etc.",
    )

    def __str__(self):
        return self.name


class Skill(models.Model):
    """
    Une compétence liée à un profil.
    """

    profile = models.ForeignKey(
        Profile,
        related_name="skills",
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=100)
    level = models.CharField(
        max_length=50,
        blank=True,
        help_text="Ex: Débutant / Intermédiaire / Avancé / Expert",
    )
    category = models.CharField(
        max_length=100,
        blank=True,
        help_text="Ex: Backend, Frontend, DevOps, ...",
    )

    def __str__(self):
        return f"{self.name} ({self.profile.name})"


class Experience(models.Model):
    """
    Une expérience professionnelle.
    """

    profile = models.ForeignKey(
        Profile,
        related_name="experiences",
        on_delete=models.CASCADE,
    )
    company = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)  # null/blank = en cours possible
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["-start_date"]  # plus récentes d'abord

    def __str__(self):
        return f"{self.role} - {self.company}"


class Education(models.Model):
    """
    Une formation / diplôme.
    """

    profile = models.ForeignKey(
        Profile,
        related_name="education",
        on_delete=models.CASCADE,
    )
    school = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    year = models.CharField(
        max_length=10,
        help_text="Année ou période, ex: 2018 ou 2015-2018",
    )

    class Meta:
        verbose_name_plural = "Education"

    def __str__(self):
        return f"{self.school} - {self.degree}"


class Language(models.Model):
    """
    Langue parlée par le profil.
    """

    profile = models.ForeignKey(
        Profile,
        related_name="languages",
        on_delete=models.CASCADE,
    )
    label = models.CharField(
        max_length=100,
        help_text="Ex: Français, Anglais, Allemand, ...",
    )
    level = models.CharField(
        max_length=100,
        blank=True,
        help_text="Ex: Langue maternelle, Courant (C1), Technique...",
    )

    def __str__(self):
        return f"{self.label} ({self.profile.name})"


class Extra(models.Model):
    """
    Atout supplémentaire / élément mis en avant dans la colonne de droite.
    """

    profile = models.ForeignKey(
        Profile,
        related_name="extras",
        on_delete=models.CASCADE,
    )
    text = models.CharField(
        max_length=255,
        help_text="Ex: Esprit entrepreneurial, Habitué au remote, ...",
    )

    def __str__(self):
        return f"Atout ({self.profile.name}) : {self.text[:40]}"
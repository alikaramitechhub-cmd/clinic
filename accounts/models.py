from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        PATIENT = 'patient', 'بیمار'
        DOCTOR = 'doctor', 'پزشک'
        SECRETARY = 'secretary', 'منشی'
        ADMIN = 'admin', 'مدیر'

    role = models.CharField('نقش', max_length=10, choices=Role.choices, default=Role.PATIENT)
    phone = models.CharField('شماره موبایل', max_length=11, blank=True)

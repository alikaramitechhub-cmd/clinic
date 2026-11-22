import re

from django import forms
from django.contrib.auth.forms import UserCreationForm

from .models import User


class RegisterForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'username', 'email', 'phone')
        labels = {
            'first_name': 'نام',
            'last_name': 'نام خانوادگی',
            'username': 'نام کاربری',
            'email': 'ایمیل',
            'phone': 'شماره موبایل',
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['password1'].label = 'رمز عبور'
        self.fields['password2'].label = 'تکرار رمز عبور'

    def clean_phone(self):
        phone = self.cleaned_data['phone']
        if not re.fullmatch(r'09\d{9}', phone):
            raise forms.ValidationError('شماره موبایل باید با 09 شروع شود و ۱۱ رقم باشد.')
        return phone

    def clean_email(self):
        email = self.cleaned_data['email']
        if User.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError('این ایمیل قبلاً ثبت شده است.')
        return email

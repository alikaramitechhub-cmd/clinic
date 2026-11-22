from django import forms

from .models import ContactMessage


class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ('name', 'email', 'subject', 'message')
        labels = {
            'name': 'نام و نام خانوادگی',
            'email': 'ایمیل',
            'subject': 'موضوع',
            'message': 'پیام شما',
        }

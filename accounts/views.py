from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import LoginView
from django.shortcuts import render, redirect

from .forms import RegisterForm


def register(request):
    if request.user.is_authenticated:
        return redirect('core:home')
    form = RegisterForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        user = form.save()
        login(request, user)
        messages.success(request, 'ثبت‌نام با موفقیت انجام شد. خوش آمدید!')
        return redirect('core:home')
    return render(request, 'accounts/register.html', {'form': form})


class UserLoginView(LoginView):
    template_name = 'accounts/login.html'
    authentication_form = AuthenticationForm
    redirect_authenticated_user = True

    def get_form(self, form_class=None):
        form = super().get_form(form_class)
        form.fields['username'].label = 'نام کاربری'
        form.fields['password'].label = 'رمز عبور'
        return form

    def form_valid(self, form):
        messages.success(self.request, 'با موفقیت وارد شدید.')
        return super().form_valid(form)

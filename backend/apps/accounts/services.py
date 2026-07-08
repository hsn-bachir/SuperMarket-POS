from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

User = get_user_model()

def get_current_user(user):
    return user

def deactivate_user(user):
    user.is_active = False
    user.save()
    return user
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

User = get_user_model()


def get_current_user(user):
    return user


User = get_user_model()


def create_user(validated_data):
    groups = validated_data.pop("groups", [])
    user = User.objects.create_user(**validated_data)
    user.groups.set(groups)
    return user


def update_user(user, validated_data):
    groups = validated_data.pop("groups", None)

    for attr, value in validated_data.items():
        setattr(user, attr, value)

    user.save()

    if groups is not None:
        user.groups.set(groups)

    return user


def deactivate_user(user):
    user.is_active = False
    user.save()
    return user
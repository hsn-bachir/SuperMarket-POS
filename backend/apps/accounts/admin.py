from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = (
        "username",
        "first_name",
        "last_name",
        "is_active",
        "is_staff",
    )

    list_filter = (
        "is_active",
        "is_staff",
        "groups",
    )

    fieldsets = UserAdmin.fieldsets + (
        (
            "ERP Information",
            {
                "fields": (
                    "phone",
                )
            },
        ),
    )
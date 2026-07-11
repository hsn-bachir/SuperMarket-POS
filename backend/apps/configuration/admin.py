from django.contrib import admin
from django.shortcuts import redirect

from .models import SystemSettings


@admin.register(SystemSettings)
class SystemSettingsAdmin(admin.ModelAdmin):

    def has_add_permission(self, request):
        return not SystemSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        settings = SystemSettings.objects.first()

        if settings:
            return redirect(
                f"/admin/{settings._meta.app_label}/"
                f"{settings._meta.model_name}/"
                f"{settings.pk}/change/"
            )

        return super().changelist_view(request, extra_context)
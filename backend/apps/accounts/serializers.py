from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone",
            "groups",
        )

    def get_groups(self, obj):
        return list(
            obj.groups.values_list("name", flat=True)
        )
    
class UserAdminSerializer(serializers.ModelSerializer):
    groups = serializers.PrimaryKeyRelatedField(
        queryset=Group.objects.all(),
        many=True
    )

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone",
            "is_active",
            "groups",
        )   
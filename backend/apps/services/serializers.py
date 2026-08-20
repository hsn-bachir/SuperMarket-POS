from rest_framework import serializers

from .models import Service, ServicePriceHistory


class ServicePriceHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicePriceHistory
        fields = [
            "id",
            "service",
            "price",
            "effective_from",
        ]
        read_only_fields = [
            "id",
            "effective_from",
        ]


class ServiceSerializer(serializers.ModelSerializer):
    current_price = serializers.SerializerMethodField()
    price_history = ServicePriceHistorySerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Service
        fields = [
            "id",
            "name",
            "description",
            "is_active",
            "current_price",
            "price_history",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "current_price",
            "price_history",
            "created_at",
            "updated_at",
        ]

    def get_current_price(self, obj):
        latest_price = obj.price_history.first()

        if not latest_price:
            return None

        return latest_price.price
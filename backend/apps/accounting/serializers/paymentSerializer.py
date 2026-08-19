from rest_framework import serializers
from apps.accounting.models.paymentModel import Payment
from apps.accounting.services.payment_service import PaymentService

class PaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Payment
        fields = [
    "id",
    "number",
    "date",
    "payment_type",
    "payment_method",
    "amount",
    "content_type",
    "object_id",
    "external_reference",
    "description",
    "status",
    "created_at",
    "updated_at",
]
        read_only_fields = [
    "number",
    "status",
    "created_by",
    "created_at",
    "updated_at",
]

    def create(self, validated_data):

        request = self.context["request"]

        return PaymentService.create_payment(
            created_by=request.user,
            **validated_data,
        )
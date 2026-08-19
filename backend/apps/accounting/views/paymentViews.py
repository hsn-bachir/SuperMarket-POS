from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from apps.accounts.permissions import IsAdminOrManager
from apps.accounting.models.paymentModel import Payment
from apps.accounting.serializers.paymentSerializer import PaymentSerializer
from apps.accounting.services.payment_service import PaymentService


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = (
        Payment.objects
        .select_related("created_by", "content_type")
        .order_by("-date", "-id")
    )
    serializer_class = PaymentSerializer
    permission_classes = [IsAdminOrManager]

    def update(self, request, *args, **kwargs):
        payment = self.get_object()
        if payment.status == "POSTED":
            raise ValidationError(
                "Posted payments cannot be edited. Cancel the payment and create a correction."
            )
        return super().update(request, *args, **kwargs)

    @action(detail=True, methods=["post"])
    def pay(self, request, pk=None):
        payment = self.get_object()
        payment_method = request.data.get("payment_method")

        payment = PaymentService.pay_pending_payment(
            payment=payment,
            payment_method=payment_method,
            user=request.user,
        )
        serializer = self.get_serializer(payment)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        payment = self.get_object()
        PaymentService.cancel_payment(
            payment,
            user=request.user,
        )
        serializer = self.get_serializer(payment)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        payment = self.get_object()
        PaymentService.delete_payment(payment)
        return Response(status=status.HTTP_204_NO_CONTENT)
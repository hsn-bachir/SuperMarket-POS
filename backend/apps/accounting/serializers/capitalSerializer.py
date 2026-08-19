from rest_framework import serializers


class CapitalInvestmentSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=18, decimal_places=2)
    account_code = serializers.ChoiceField(choices=["1110", "1120"])
    date = serializers.DateField()
    description = serializers.CharField(required=False, allow_blank=True)
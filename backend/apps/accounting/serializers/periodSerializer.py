from rest_framework import serializers
from apps.accounting.models.periodsModel import AccountingPeriod

class AccountingPeriodSerializer(
    serializers.ModelSerializer
):

    fiscal_year = serializers.ReadOnlyField()

    class Meta:
        model = AccountingPeriod

        fields = [
            "id",
            "name",
            "start_date",
            "end_date",
            "fiscal_year",
            "status",
            "closed_at",
            "closed_by",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "fiscal_year",
            "status",
            "closed_at",
            "closed_by",
            "created_at",
            "updated_at",
        ]
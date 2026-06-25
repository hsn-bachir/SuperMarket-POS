from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType

from apps.products.models import Product
from apps.suppliers.models import Supplier
from apps.purchases.models import Purchase, PurchaseItem
from apps.sales.models import Sale, SaleItem
from apps.inventory.models import InventoryMovement


class Command(BaseCommand):
    help = "Create ERP roles and assign permissions"

    def handle(self, *args, **kwargs):

        admin_group, _ = Group.objects.get_or_create(name="Admin")
        manager_group, _ = Group.objects.get_or_create(name="Manager")
        cashier_group, _ = Group.objects.get_or_create(name="Cashier")

        admin_group.permissions.clear()
        manager_group.permissions.clear()
        cashier_group.permissions.clear()

        # -------------------------
        # Admin
        # -------------------------

        admin_group.permissions.set(
            Permission.objects.all()
        )

        # -------------------------
        # Manager
        # -------------------------

        manager_models = [
            Product,
            Supplier,
            Purchase,
            PurchaseItem,
            Sale,
            SaleItem,
            InventoryMovement,
        ]

        manager_permissions = Permission.objects.none()

        for model in manager_models:
            manager_permissions |= Permission.objects.filter(
                content_type=ContentType.objects.get_for_model(model)
            )

        manager_group.permissions.set(manager_permissions)

        # -------------------------
        # Cashier
        # -------------------------

        cashier_permissions = Permission.objects.filter(
            codename__in=[
                "view_product",
                "view_sale",
                "add_sale",
                "view_saleitem",
                "add_saleitem",
            ]
        )

        cashier_group.permissions.set(
            cashier_permissions
        )

        self.stdout.write(
            self.style.SUCCESS(
                "ERP roles created successfully."
            )
        )
from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.groups.filter(
            name="Admin"
        ).exists()


class IsManager(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.groups.filter(
            name="Manager"
        ).exists()


class IsCashier(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.groups.filter(
            name="Cashier"
        ).exists()


class IsAdminOrManager(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.groups.filter(
                name__in=["Admin", "Manager"]
            ).exists()
        )


class IsAdminOrManagerOrCashier(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.groups.filter(
                name__in=["Admin", "Manager", "Cashier"]
            ).exists()
        )
    
class CanViewReports(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and (
                request.user.has_perm("reports.view_reports")
                or request.user.is_superuser
            )
        )
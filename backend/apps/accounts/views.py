from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from .serializers import UserSerializer,UserAdminSerializer, GroupSerializer
from .services import get_current_user
from django.contrib.auth import get_user_model
from rest_framework import generics

User = get_user_model()


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = get_current_user(request.user)

        serializer = UserSerializer(user)

        return Response(serializer.data)
    

from rest_framework.filters import SearchFilter

class UserListCreateView(generics.ListCreateAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = User.objects.order_by("username")

    serializer_class = UserAdminSerializer

    filter_backends = [SearchFilter]

    search_fields = [
        "username",
        "first_name",
        "last_name",
        "email",
    ]


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = User.objects.all()
    serializer_class = UserAdminSerializer

        
    def destroy(self, request, *args, **kwargs):
        user = self.get_object()

        user.is_active = False
        user.save()

        return Response(status=204)

from django.contrib.auth.models import Group

class GroupListView(generics.ListAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = Group.objects.all()
    serializer_class = GroupSerializer
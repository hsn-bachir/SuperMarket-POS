from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from .serializers import UserSerializer,UserAdminSerializer
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
    

class UserListCreateView(generics.ListCreateAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = User.objects.all()
    serializer_class = UserAdminSerializer


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    queryset = User.objects.all()
    serializer_class = UserAdminSerializer
from django.shortcuts import render
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
from rest_framework import generics
from .serializers import RoomSerializer
from .models import Room

# Create your views here.


class RoomView(generics.ListAPIView):
    # get all room objects
    queryset = Room.objects.all()
    # pass to serializer to convert queryset to json object
    serializer_class = RoomSerializer

# @api_view(['GET'])
# def RoomView(request):
#     # get all room objects
#     queryset = Room.objects.all()
#     #     # pass to serializer to convert queryset to json object
#     serializer_class = RoomSerializer(queryset, many=True)

#     return Response(serializer_class.data)

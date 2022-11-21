from rest_framework.serializers import ModelSerializer
from .models import Room


class RoomSerializer(ModelSerializer):
    class Meta:
        model = Room
        fields = "__all__"


class CreateRoomSerializer(ModelSerializer):
    class Meta:
        model = Room
        # serliaze request to make sure it is valid. Give back a python format
        fields = ('guest_can_pause', 'votes_to_skip')

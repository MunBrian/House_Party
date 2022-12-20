from rest_framework.serializers import ModelSerializer, CharField
from .models import Room


class RoomSerializer(ModelSerializer):
    class Meta:
        model = Room
        fields = "__all__"


class CreateRoomSerializer(ModelSerializer):
    class Meta:
        model = Room
        # serialize request to make sure it is valid. Give back a python format
        fields = ('guest_can_pause', 'votes_to_skip')


class UpdateRoomSerializer(ModelSerializer):
    # redifine code to ensure that code passed in serializer is not always unique
    code = CharField(validators=[])

    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip', 'code')

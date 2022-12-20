from django.shortcuts import render
from django.http import JsonResponse
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RoomSerializer, CreateRoomSerializer
from .models import Room

# Create your views here.


# diplay all rooms
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


# create a room
class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        # check if user has active sesssion
        if not self.request.session.exists(self.request.session.session_key):
            # if not create a seesion
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)

        # check if the two fields passed on post request is valid and available
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key

            # check if user already has a room
            queryset = Room.objects.filter(host=host)

            # if true
            if queryset.exists():
                # get room and update it
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                # update fields
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                # create a new room
                room = Room(host=host, guest_can_pause=guest_can_pause,
                            votes_to_skip=votes_to_skip)
                room.save()
                self.request.session['room_code'] = room.code
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)


# join room func
class JoinRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        # check if user has active sesssion
        if not self.request.session.exists(self.request.session.session_key):
            # if not create a seesion
            self.request.session.create()

        # get code from post request
        code = request.data.get(self.lookup_url_kwarg)

        # if code exists
        if code != None:
            # fetch room frm db
            room_result = Room.objects.filter(code=code)
            # if roome exists
            if len(room_result) > 0:
                # get room
                room = room_result[0]
                # make key 'room_code' in session to show that user in current session is in the room
                self.request.session['room_code'] = code
                return Response({'message': 'Room Joined!!'}, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Invalid Room Code!!'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'Bad Request': 'Invalid post data, did not find a code key '}, status=status.HTTP_400_BAD_REQUEST)


# get sepecific room  using code
class GetRoom(APIView):
    serializer_class = RoomSerializer
    # pass a parameter called code when fetching for room in the url
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        # get value of 'code' from the url
        code = request.GET.get(self.lookup_url_kwarg)
        # if code exists
        if code != None:
            # filter to find room exactly code as that of url
            room = Room.objects.filter(code=code)
            # check for room
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                # check for host and add 'is_host' field
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            # if no room is available
            return Response({'Room Not Found: Invalid Room Code'}, status=status.HTTP_404_NOT_FOUND)

        # if no code is present
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


# check if user is in room
class UserInRoom(APIView):
    def get(self, request, format=None):
        # check if user has active sesssion
        if not self.request.session.exists(self.request.session.session_key):
            # if not create a session
            self.request.session.create()

        data = {
            'code': self.request.session.get('room_code')
        }

        # take a python dict and serialize it using a json-serializer and send to request
        return JsonResponse(data, status=status.HTTP_200_OK)


# leave room func
class LeaveRoom(APIView):
    def post(self, request, format=None):
        # check if user has active sesssion
        if not self.request.session.exists(self.request.session.session_key):
            # if not create a session
            self.request.session.create()

        # check if room code exist
        if 'room_code' in self.request.session:
            # remove room code from session
            self.request.session.pop('room_code')
            # get host id
            host_id = self.request.session.session_key
            # get room using host id
            room_results = Room.objects.filter(host=host_id)

            # check if room exist
            if len(room_results) > 0:
                room = room_results[0]
                # delete room
                room.delete()
            return Response({'Room Not Found: Invalid Room Code'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)

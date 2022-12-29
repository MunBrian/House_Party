import os
from dotenv import load_dotenv
from django.shortcuts import render
from requests import Request, post
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response


load_dotenv()
client_id = os.getenv("CLIENT_ID")
redirect_uri = os.getenv("REDIRECT_URI")
client_secret = os.getenv("CLIENT_SECRET")


# api endpoint to return url to authenticate application
class AuthURL(APIView):
    def get(self, request, format=None):
        # scope - want to do you want to have access to
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': redirect_uri,
            'client_id': client_id,
        }).prepare().url  # generate url

        return Response({'url': url}, status=status.HTTP_200_OK)


def spotify_callback(request, format=None):
    # get code from spotify after user authenticates
    code = request.GET.get('code')
    error = request.GET.get('error')

    # send post request to spotify with the code to get accesstoken
    reponse = post('https://accounts.spotify.com/api/token', data={
        'grant-type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri,
        'client_id': client_id,
        'client_secret': client_secret
    }).json()

    # get data from response
    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

# geocoding.py

import requests

class GeocodingService:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://api.mapservice.com/geocode"

    def get_coordinates(self, address):
        params = {
            'address': address,
            'key': self.api_key
        }
        response = requests.get(self.base_url, params=params)
        if response.status_code == 200:
            data = response.json()
            if data['results']:
                location = data['results'][0]['geometry']['location']
                return location['lat'], location['lng']
        return None

    def get_address(self, lat, lng):
        params = {
            'latlng': f"{lat},{lng}",
            'key': self.api_key
        }
        response = requests.get(self.base_url + '/reverse', params=params)
        if response.status_code == 200:
            data = response.json()
            if data['results']:
                return data['results'][0]['formatted_address']
        return None
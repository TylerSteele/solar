import requests
from rest_framework import status, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Subscriber, UtilityZipCode
from .serializers import (
    SubscriberSerializer,
    AddressValidationSerializer,
    UtilityZipCodeSerializer
)

@api_view(['GET'])
def health_check(request):
    """Health check endpoint"""
    return Response({'status': 'healthy'})

@api_view(['POST'])
def validate_address(request):
    """Validate address using US Census Geocoding API"""
    serializer = AddressValidationSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    address_string = f"{data['address']}, {data['city']}, {data['state']}, {data['zip_code']}"
    
    try:
        response = requests.get(
            'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress',
            params={
                'address': address_string,
                'benchmark': 'Public_AR_Current',
                'format': 'json'
            },
            timeout=10
        )
        
        if response.status_code == 200:
            census_data = response.json()
            
            if census_data.get('result', {}).get('addressMatches'):
                match = census_data['result']['addressMatches'][0]
                return Response({
                    'valid': True,
                    'formatted_address': match['matchedAddress'],
                    'coordinates': match['coordinates']
                })
            else:
                # TODO: Offer alternative validation methods or suggestions
                return Response({
                    'valid': False,
                    'message': 'Address not found in Census database'
                })
        else:
            return Response({
                'valid': False,
                'message': 'Address validation service unavailable'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            
    except requests.RequestException:
        return Response({
            'valid': False,
            'message': 'Address validation service temporarily unavailable'
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

@api_view(['GET'])
def get_utility_by_zip(request, zip_code):
    """Get utility information by ZIP code"""
    try:
        utility_info = UtilityZipCode.objects.get(zip_code=zip_code)
        
        utility_mapping = {
            'PSE&G': 'PSEG',
            'Jersey Central Power & Light': 'JCPL',
            'Atlantic City Electric': 'ACE',
            'Rockland Electric Co.': 'ROCKLAND',
        }
        
        utility_choice = utility_mapping.get(utility_info.electric_utility, utility_info.electric_utility)
        
        return Response({
            'found': True,
            'utility': utility_choice, 
            'utility_display': utility_info.electric_utility, 
            'city': utility_info.city,
            'zip_code': utility_info.zip_code
        })
    except UtilityZipCode.DoesNotExist:
        return Response({
            'found': False,
            'message': 'Utility information not available for this ZIP code'
        })

class SubscriberListCreateView(generics.ListCreateAPIView):
    """List all subscribers or create a new subscriber"""
    queryset = Subscriber.objects.all()
    serializer_class = SubscriberSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            subscriber = serializer.save()
            
            return Response({
                'success': True,
                'subscriber_id': subscriber.id,
                'message': 'Enrollment submitted successfully',
                'data': SubscriberSerializer(subscriber).data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class SubscriberDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a subscriber"""
    queryset = Subscriber.objects.all()
    serializer_class = SubscriberSerializer
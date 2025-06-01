from rest_framework import serializers
from .models import Subscriber, UtilityZipCode
import re

class AddressValidationSerializer(serializers.Serializer):
    """Serializer for address validation input"""
    address = serializers.CharField(max_length=200)
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=2)
    zip_code = serializers.CharField(max_length=5)

class UtilityZipCodeSerializer(serializers.ModelSerializer):
    """Serializer for utility zip code data"""
    class Meta:
        model = UtilityZipCode
        fields = ['zip_code', 'city', 'electric_utility']

class SubscriberSerializer(serializers.ModelSerializer):
    """Serializer for subscriber enrollment"""
    
    class Meta:
        model = Subscriber
        fields = [
            'id', 'first_name', 'last_name', 'address', 'city', 'state', 
            'zip_code', 'utility', 'utility_account_number', 'assistance_program',
            'address_validated', 'formatted_address', 'created_at'
        ]
        read_only_fields = ['id', 'address_validated', 'formatted_address', 'created_at']
    
    def validate_zip_code(self, value):
        """Validate ZIP code format"""
        if not value.isdigit() or len(value) != 5:
            raise serializers.ValidationError("ZIP code must be 5 digits")
        return value
    
    def validate_utility_account_number(self, value):
        """Validate utility account number based on utility type"""
        if not value:
            return value
        
        # Get the utility from the validated data
        utility = self.initial_data.get('utility')
        
        # Remove any non-numeric characters
        clean_uan = re.sub(r'[^0-9]', '', value)
        
        if utility == 'PSEG' and len(clean_uan) != 10:
            raise serializers.ValidationError("PSE&G account numbers must be 10 digits")
        elif utility == 'JCPL' and len(clean_uan) != 12:
            raise serializers.ValidationError("JCPL account numbers must be 12 digits")
        
        return value
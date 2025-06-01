from django.db import models
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
import re

class UtilityZipCode(models.Model):
    """Model for utility and zip code mapping"""
    zip_code = models.CharField(max_length=5, unique=True)
    city = models.CharField(max_length=100)
    electric_utility = models.CharField(max_length=100)
    
    class Meta:
        db_table = 'utility_zip_codes'
        verbose_name = 'Utility Zip Code'
        verbose_name_plural = 'Utility Zip Codes'
    
    def __str__(self):
        return f"{self.zip_code} - {self.electric_utility}"

class Subscriber(models.Model):
    """Model for solar program subscribers"""
    
    UTILITY_CHOICES = [
        ('PSEG', 'PSE&G'),
        ('JCPL', 'Jersey Central Power & Light'),
        ('ACE', 'Atlantic City Electric'),
        ('ROCKLAND', 'Rockland Electric Co.')
    ]
    
    ASSISTANCE_PROGRAM_CHOICES = [
        ('Medicare', 'Medicare'),
        ('SNAP', 'SNAP'),
        ('', 'None'),
    ]
    
    # Personal Information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    
    # Address Information
    address = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=2, default='NJ')
    zip_code = models.CharField(
        max_length=5,
        validators=[RegexValidator(r'^\d{5}$', 'Enter a valid 5-digit ZIP code')]
    )
    
    # Utility Information
    utility = models.CharField(max_length=10, choices=UTILITY_CHOICES)
    utility_account_number = models.CharField(max_length=20, blank=True)
    
    # Assistance Program
    assistance_program = models.CharField(
        max_length=20, 
        choices=ASSISTANCE_PROGRAM_CHOICES,
        blank=True
    )
    
    # Validation fields
    address_validated = models.BooleanField(default=False)
    formatted_address = models.CharField(max_length=300, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'subscribers'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.zip_code}"
    
    def clean(self):
        """Custom validation for utility account number"""
        if self.utility_account_number:
            # Remove any non-numeric characters
            clean_uan = re.sub(r'[^0-9]', '', self.utility_account_number)
            
            if self.utility == 'PSEG' and len(clean_uan) != 10:
                raise ValidationError({
                    'utility_account_number': 'PSE&G account numbers must be 10 digits'
                })
            elif self.utility == 'JCPL' and len(clean_uan) != 12:
                raise ValidationError({
                    'utility_account_number': 'JCPL account numbers must be 12 digits'
                })
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def full_address(self):
        return f"{self.address}, {self.city}, {self.state} {self.zip_code}"
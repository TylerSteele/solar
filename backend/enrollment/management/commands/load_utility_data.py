import json
import os
from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from enrollment.models import UtilityZipCode

class Command(BaseCommand):
    help = 'Load utility data from JSON file into database'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            default='static/zip_code_and_utilities.json',
            help='Path to the JSON file containing utility data'
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing utility data before loading new data',
        )
    
    def handle(self, *args, **options):
        file_path = options['file']
        
        # Check if file exists
        if not os.path.exists(file_path):
            raise CommandError(f'File not found: {file_path}')
        
        try:
            # Load JSON data
            with open(file_path, 'r') as f:
                utility_data = json.load(f)
            
            self.stdout.write(f'Found {len(utility_data)} utility records in {file_path}')
            
            # Clear existing data if requested
            if options['clear']:
                deleted_count = UtilityZipCode.objects.count()
                UtilityZipCode.objects.all().delete()
                self.stdout.write(f'Cleared {deleted_count} existing utility records')
            
            # Load new data
            created_count = 0
            updated_count = 0
            
            for item in utility_data:
                try:
                    zip_code = item['zip']
                    city = item['city']
                    electric_utility = item['electric_utility']
                    
                    utility_zip, created = UtilityZipCode.objects.update_or_create(
                        zip_code=zip_code,
                        defaults={
                            'city': city,
                            'electric_utility': electric_utility
                        }
                    )
                    
                    if created:
                        created_count += 1
                        self.stdout.write(f'Created: {utility_zip}')
                    else:
                        updated_count += 1
                        self.stdout.write(f'Updated: {utility_zip}')
                        
                except KeyError as e:
                    self.stdout.write(
                        self.style.WARNING(f'Skipping invalid record (missing {e}): {item}')
                    )
                    continue
                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f'Error processing record {item}: {str(e)}')
                    )
                    continue
            
            # Summary
            self.stdout.write(
                self.style.SUCCESS(
                    f'\nSummary:\n'
                    f'- Created: {created_count} records\n'
                    f'- Updated: {updated_count} records\n'
                    f'- Total in database: {UtilityZipCode.objects.count()} records'
                )
            )
            
        except json.JSONDecodeError as e:
            raise CommandError(f'Invalid JSON file: {str(e)}')
        except Exception as e:
            raise CommandError(f'Error loading data: {str(e)}')
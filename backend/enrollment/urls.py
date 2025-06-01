from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    path('validate-address/', views.validate_address, name='validate_address'),
    path('utilities/<str:zip_code>/', views.get_utility_by_zip, name='get_utility_by_zip'),
    path('subscribers/', views.SubscriberListCreateView.as_view(), name='subscriber_list_create'),
    path('subscribers/<int:pk>/', views.SubscriberDetailView.as_view(), name='subscriber_detail'),
]
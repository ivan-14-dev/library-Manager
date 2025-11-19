"""
Sérialiseurs pour l'application analytics
"""
from rest_framework import serializers
from .models import AnalyticsEvent, UserActivity, BookAnalytics, SalesAnalytics


class AnalyticsEventSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les événements d'analyse"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    event_name_display = serializers.SerializerMethodField()

    class Meta:
        model = AnalyticsEvent
        fields = [
            'id', 'user', 'user_name', 'event_type', 'event_name',
            'event_name_display', 'event_data', 'session_id',
            'user_agent', 'ip_address', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def get_event_name_display(self, obj):
        """Retourne un nom d'événement lisible"""
        event_names = {
            'PAGE_VIEW': 'Vue de page',
            'BOOK_VIEW': 'Consultation de livre',
            'DOWNLOAD': 'Téléchargement',
            'SEARCH': 'Recherche',
            'USER_ACTION': 'Action utilisateur',
            'SYSTEM_EVENT': 'Événement système'
        }
        return event_names.get(obj.event_name, obj.event_name)


class UserActivitySerializer(serializers.ModelSerializer):
    """Sérialiseur pour les activités utilisateurs"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)
    personal_book_title = serializers.CharField(source='personal_book.title', read_only=True)
    reading_group_name = serializers.CharField(source='reading_group.name', read_only=True)

    class Meta:
        model = UserActivity
        fields = [
            'id', 'user', 'user_name', 'activity_type', 'description',
            'book', 'book_title', 'personal_book', 'personal_book_title',
            'reading_group', 'reading_group_name', 'metadata', 'duration',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class BookAnalyticsSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les analyses de livres"""
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_isbn = serializers.CharField(source='book.isbn', read_only=True)
    average_rating_display = serializers.SerializerMethodField()
    completion_rate_display = serializers.SerializerMethodField()

    class Meta:
        model = BookAnalytics
        fields = [
            'id', 'book', 'book_title', 'book_isbn', 'total_views',
            'unique_views', 'total_downloads', 'total_borrows',
            'total_reservations', 'average_rating', 'average_rating_display',
            'total_ratings', 'average_reading_time', 'completion_rate',
            'completion_rate_display', 'daily_stats', 'monthly_stats',
            'last_updated'
        ]
        read_only_fields = ['id', 'last_updated']

    def get_average_rating_display(self, obj):
        """Retourne la note moyenne formatée"""
        if obj.average_rating:
            return f"{obj.average_rating:.1f}/5"
        return "Non noté"

    def get_completion_rate_display(self, obj):
        """Retourne le taux de completion formaté"""
        if obj.completion_rate:
            return f"{obj.completion_rate:.1f}%"
        return "N/A"


class SalesAnalyticsSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les analyses de ventes"""
    personal_book_title = serializers.CharField(source='personal_book.title', read_only=True)
    author_name = serializers.CharField(source='personal_book.user.get_full_name', read_only=True)
    current_price_display = serializers.SerializerMethodField()
    total_revenue_display = serializers.SerializerMethodField()
    conversion_rate_display = serializers.SerializerMethodField()
    average_order_value_display = serializers.SerializerMethodField()

    class Meta:
        model = SalesAnalytics
        fields = [
            'id', 'personal_book', 'personal_book_title', 'author_name',
            'total_sales', 'total_revenue', 'total_revenue_display',
            'current_price', 'current_price_display', 'price_history',
            'sales_by_country', 'sales_by_region', 'daily_sales',
            'monthly_sales', 'conversion_rate', 'conversion_rate_display',
            'average_order_value', 'average_order_value_display',
            'last_updated'
        ]
        read_only_fields = ['id', 'last_updated']

    def get_current_price_display(self, obj):
        """Retourne le prix actuel formaté"""
        return f"{obj.current_price:.2f}€"

    def get_total_revenue_display(self, obj):
        """Retourne le revenu total formaté"""
        return f"{obj.total_revenue:.2f}€"

    def get_conversion_rate_display(self, obj):
        """Retourne le taux de conversion formaté"""
        return f"{obj.conversion_rate:.1f}%"

    def get_average_order_value_display(self, obj):
        """Retourne la valeur moyenne des commandes formatée"""
        return f"{obj.average_order_value:.2f}€"
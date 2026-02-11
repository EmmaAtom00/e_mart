from django_filters import rest_framework as filters
from .models import Product

class ProductFilter(filters.FilterSet):
    min_price = filters.NumberFilter(field_name="sale_price", lookup_expr='gte')
    max_price = filters.NumberFilter(field_name="sale_price", lookup_expr='lte')
    category = filters.CharFilter(field_name="category__slug")
    featured = filters.BooleanFilter(field_name="featured")

    class Meta:
        model = Product
        fields = ['category', 'featured', 'min_price', 'max_price']

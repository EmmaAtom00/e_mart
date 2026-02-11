from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Cart, CartItem, Category, CustomUser, Product

# Register your models here.

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'email_verified')
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('avatar', 'role', 'email_verified')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)

class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "sale_price", "discount", "stock", "featured", "rating")
    list_filter = ("featured", "category", "created_at")
    search_fields = ("name", "description")
    readonly_fields = ("slug", "sale_price", "created_at", "updated_at")

admin.site.register(Product, ProductAdmin)

class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", 'slug', "description")
    readonly_fields = ("slug",)

admin.site.register(Category, CategoryAdmin)

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0

class CartAdmin(admin.ModelAdmin):
    list_display = ("cart_code", "created_at", "updated_at")
    inlines = [CartItemInline]

admin.site.register(Cart, CartAdmin)
admin.site.register(CartItem)
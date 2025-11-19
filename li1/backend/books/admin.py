from django.contrib import admin
from .models import Author, Category, Book, PersonalBook, SubCategory

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'date_of_birth', 'date_of_death')
    search_fields = ('first_name', 'last_name')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'publisher', 'language', 'status', 'available_copies')
    list_filter = ('status', 'language')
    search_fields = ('title', 'publisher', 'isbn')
    filter_horizontal = ('authors', 'categories')

@admin.register(PersonalBook)
class PersonalBookAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'status', 'is_public', 'created_at')
    list_filter = ('status', 'is_public')
    search_fields = ('title', 'summary', 'user__username')

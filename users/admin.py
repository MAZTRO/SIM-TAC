"""Admin model"""
from django.contrib import admin
from users.models import Profile
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    """Admin model class"""

    list_display = ('pk', 'user', 'phone_number')
    list_display_links = ('pk', 'user')
    list_editable = ('phone_number',)

    search_fields = (
        'user__email',
        'user__username',
        'user__first_name',
        'user__last_name',
        'phone_number'
    )

    list_filter = (
        'user__is_active',
        'user__is_staff',
        'created_at',
        'updated_at'
    )

    fieldsets = (
        ('Profile', {
            'fields': (('user'),)
        }),
        ('Extra info', {
            'fields': ('phone_number', 'biography')
        }),
        ('Metadata', {
            'fields': (('created_at', 'updated_at'),)
        })
    )

    readonly_fields = ('created_at', 'updated_at')


class ProfileInline(admin.StackedInline):
    """Profile Inline admin"""

    model = Profile
    can_delete = False
    verbose_name_plural = 'profiles'

class UserAdmin(BaseUserAdmin):
    """Add profile admin to Base admin"""

    inlines = (ProfileInline,)
    list_display = (
        'username',
        'email',
        'first_name',
        'last_name',
        'is_active',
        'is_staff'
    )

admin.site.unregister(User)
admin.site.register(User, UserAdmin)

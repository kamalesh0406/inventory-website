from django.contrib import admin
from .models import Inventory

# Register your models here.

class InventoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'quantity', 'location')

admin.site.register(Inventory, InventoryAdmin)

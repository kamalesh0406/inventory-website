from django.db import models

# Create your models here.

class Inventory(models.Model):
    name = models.CharField(max_length=120)
    quantity = models.IntegerField()
    location = models.CharField(max_length=120)
    
    def __str__(self):
        return self.name

class Shipment(models.Model):
    name = models.CharField(max_length=120)
    date = models.DateField()
    destination = models.CharField(max_length=120)
    number_products = models.IntegerField()
    
    def __str__(self):
        return self.name

class ShipmentProduct(models.Model):
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE)
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def __str__(self):
        return self.shipment.name + " " + self.inventory.name

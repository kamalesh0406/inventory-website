from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from .serializers import InventorySerializer
from .models import Inventory, Shipment, ShipmentProduct

class InventoryView(viewsets.ModelViewSet):
    serializer_class = InventorySerializer
    queryset = Inventory.objects.all()

class ShipmentView(APIView):
    parser_classes = [JSONParser]
    def post(self, request):
        data = request.data

        if (data["products"]==None or data["name"]==None or data["date"]==None or data["destination"]==None):
            return Response("Data field missing.", status=400)

        products = data["products"]
        name = data["name"]
        shipment_date = data["date"]
        destination = data["destination"]

        if Shipment.objects.filter(name = data["name"], date=shipment_date, destination=destination).exists():
            return Response("Shipment already exists.", status=400)

        shipment = Shipment(name = name, date=shipment_date, destination = destination, number_products = len(products))
        shipment.save()

        for product_ship in products:
            product_inventory = Inventory.objects.get(id = product_ship["id"])
            if int(product_ship["shipQuantity"])>int(product_inventory.quantity):
                return Response("Shipment Quantity is greater than stock in inventory", status=403)
            
            shipment_product = ShipmentProduct(shipment = shipment, inventory = product_inventory, quantity = product_ship["shipQuantity"])
            shipment_product.save()

            product_inventory.quantity = product_inventory.quantity - int(product_ship["shipQuantity"])
            product_inventory.save()
        return Response(status=200)    


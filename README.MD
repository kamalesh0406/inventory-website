## Inventory Management Backend

The folders frontend/ and backend/ contains the code for the frontend and the backend for a inventory management website respectively. The frontend is written using good old plain HTML and bootstrap for design. The backend is written in Python using the Django framework. 

#### Installation and Running Instructions

The backend requires the django library and certain other dependencies which are all present in the requirements.txt file. If you are using conda, please follow the steps given below to create a conda environment and install the required libraries.

```
conda create -n kamaleshbackend python=3.8
pip install -r backend/requirements.txt
```

Then, Django requires you make the databse migrations before you start running the server. The following set of commands will perform the migrations and start the server. Please note that Django uses SQLite for the database by default.

```
python backend/manage.py makemigrations inventory
python backend/manage.py migrate
python backend/manage.py runserver
```

Finally, the frontent is present in the folder labeled frontent, you just need to open the file home.html . In case you are using a system with MacOS, you can run this command from the comfort of your command line.

```
open frontent/home.html
```

#### Backend Description

Before giving an explanation of the complete database model, I want to confirm that the **additional feature I am implementing is the option to create shipments**. (Description of the additional feature from the pdf: ....). 

#### Database Schema
The database contains three models: Inventory, Shipment, ShipmentProduct. The Inventory model is the basic model that contains the details of the products in the inventory. The shipment model contains a shipment along with the name, date and the destination for the shipment. The ShipmentProduct model maps each shipment with a product from the inventory and additionaly it contains the quantity of the particular product that was present in the given shipment. This is has been created under the assumption that in a single shipment we can add multiple products of different quantity. 

The schema diagram is shown below to clarify the Database schema. 
![database-schema](https://github.com/kamalesh0406/inventory-website/blob/main/DataBaseModel.png)

#### Routes

I am implementing a REST API for this and this requires the django-restframework library. This library provides some nice features like built-in routes to add, modify, delete and view data based on the model. All we need to do is to define the routes in the inventory/views.py file and the serializers which will handle the conversion of JSON to Python objects in the inventory/serializers.py file. However, for the additional feature I have defined the routes by myself and perform the validation using my own coed. The routes present in the backend are as follows:

##### GET /api/inventory

This route returns an array of all product inventory stored in the database in the JSON format specified below. 

```
[
	{
		name: "name",
		location: "location",
		quantity: quantity
	}
	.
	.
	.
]
```
##### POST /api/inventory

This route accepts a JSON object of the details required for creating an inventory object. This route currently has the ability to create only a single product. 

```
{
	name: "name".
	location: "location",
	quantity: quantity
}
```

##### GET /api/inventory/:id

This route fetches the details of a particular product in the inventory based on the id supplied to the route. The format of the data returned by the route is shown below.

```
{
	name: "name".
	location: "location",
	quantity: quantity
}
```

##### PUT /api/inventory/:id

This route edits the details of the particular inventory based on the JSON data supplied in the request. The format of the data required by the route is shown below.

```
{
	name: "name".
	location: "location",
	quantity: quantity
}
```

##### DELETE /api/inventory/:id

This route deletes the particular product from the database based on the ID given.


##### POST /api/shipment

This routes accepts a JSON containing the products to be added to the shipment, date of the shipment and the destination of the shipment. The products field is an array which contains JSON objects with the product ID and the quantity of each products. 

```
{
	products: [
				{
					id: id,
					quantity: quantity
				}
			  ],
	date: mm/dd/yyyy,
	destination: "destination"
}
```

#### Backend Fault Tolerance

There are many potential problems that can arise in the backend and I have written about some of them and how they are handled below. 

Problem | Solution | 
--- | --- | 
The JSON fields sent from the client are emtpy | The backend immediately sends a 400 Bad Request response to the client |
The ID fields for the Edit and the Delete columns are wrong | The backend sends a 404 response to notify the absence of the data |
The quantity of the shipment is greater than the inventory | The backend sends a 403 forbidden response since this could be a manipulation trick by the client |
The shipment already exists | The backend sends a 400 bad request so that the client can correct for any issues |


#### Features to be added

1. The ability to view all the shipments for a given date range. 
2. Filter shipments based on their destination. 
3. Create a map with all the storage locations and when we click a location, it shows the current inventory.
4. Scalable add and deletion of values in the database.
5. Create shipments based on the origin location and destination.
6. If multiple users are creating a shipment with the same product, we need to create a method to ensure that the data is updated appropriately since the two different users might change the product quantity in a different way.

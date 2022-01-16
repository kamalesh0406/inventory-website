$('.sideButton').click((event)=>{
	$("#fetchForm").addClass("d-none");
	$("#editForm").addClass("d-none");
	$("#deleteForm").addClass("d-none");
	$("#addItem").addClass("d-none");
	$("#createShipment").addClass("d-none");
	$("#itemTable").addClass("d-none");
	$("#alertBar").addClass("d-none");
	$("#addForm").addClass("d-none");
	$("#viewTable").addClass("d-none");

	$("#addItem")[0].reset();
	$("#createShipment")[0].reset();
	$("#viewBody tr").remove();
	$("#itemBody tr").remove();
	$("#addForm")[0].reset();
	$("#fetchForm")[0].reset();
	$("#deleteForm")[0].reset();
});

$("#addButton").click((event)=>{
	$("#addForm").removeClass("d-none");
});

$("#editButton").click((event)=>{
	$("#fetchForm").removeClass("d-none");
});

$('#deleteButton').click((event)=>{
	$("#deleteForm").removeClass("d-none");
});

$("#viewButton").click((event)=>{
	$.ajax({
		url: "http://localhost:8000/api/inventory/",
		type: "GET",
		success: (data)=>{
		  console.log(data);
		  for (i=0; i<data.length; i++){
		  	product = data[i];
		  	var tableRow = `
				<tr>
		      	<th scope="row">${product.id}</th>
		      	<td>${product.name}</td>
		      	<td>${product.quantity}</td>
		      	<td>${product.location}</td>
		    	</tr>
			`
			$("#viewBody").append(tableRow);
		  };
		}
	});

	$("#viewTable").removeClass("d-none");
});

$("#shipButton").click((event)=>{
	$("#addItem").removeClass("d-none");
	$("#createShipment").removeClass("d-none");
	$("#itemTable").removeClass("d-none");
});



$("#addForm").submit((event) => {
	event.preventDefault();
	var name = $("#addName").val();
	var quantity = $("#addQuantity").val();
	var location = $("#addLocation").val();

	var jsonData = {
		name: name,
		quantity: quantity,
		location: location
	};

	$.post("http://localhost:8000/api/inventory/", jsonData)
	  .done((data) => {
	  	console.log("response", data);
	});
})

$("#fetchForm").submit((event) =>{
	event.preventDefault();

	var id = $("#fetchID").val();
	var url = "http://localhost:8000/api/inventory/" + id + "/";
	$.ajax({
		url: url,
		success: (data)=>{
		  $("#editID").val(id);
		  $("#editName").val(data.name);
		  $("#editQuantity").val(data.quantity);
		  $("#editLocation").val(data.location);
		  $("#editForm").removeClass('d-none');
		},
		error: (data)=>{
			if (data.status==404){
				$("#alertBar").text("Item not found. Please check the ID you entered.");
				$("#alertBar").removeClass("d-none");
			}
		}
	});
});

$("#editForm").submit((event) => {
	event.preventDefault();
	var id = $("#editID").val();
	var name = $("#editName").val();
	var quantity = $("#editQuantity").val();
	var location = $("#editLocation").val();

	var jsonData = {
		name: name,
		quantity: quantity,
		location: location
	};

	var url = "http://localhost:8000/api/inventory/" + id + "/";
	$.ajax({
		url: url,
		type: "PUT",
		data: jsonData,
		success: (data)=>{
		  console.log(data);
		  console.log("Edit Succesful!");
		  $("#editForm").addClass('d-none');
		},
		error: (data)=>{
			if (data.status==404){
				$("#alertBar").text("Item not found. Please check the ID you entered.");
				$("#alertBar").removeClass("d-none");
			}
		}
	});
});

$("#deleteForm").submit((event) =>{
	event.preventDefault();

	var id = $("#deleteID").val();
	var url = "http://localhost:8000/api/inventory/" + id + "/";
	$.ajax({
		url: url,
		type: "DELETE",
		success: (data)=>{
			console.log("Deleted")
		},
		error: (data)=>{
			if (data.status==404){
				$("#alertBar").text("Item not found. Please check the ID you entered.");
				$("#alertBar").removeClass("d-none");
			}
		}
	});
});

var shipments = [];

$("#addItem").submit((event) => {
	event.preventDefault();

	var id = $("#invenID").val();
	var shipQuantity = $("#invenQuantity").val();
	var url = "http://localhost:8000/api/inventory/" + id + "/";
	$.ajax({
		url: url,
		success: (data)=>{
			var tableRow = `
				<tr>
		      	<th scope="row">${data.name}</th>
		      	<td>${shipQuantity}</td>
		      	<td>${data.quantity}</td>
		      	<td>${data.location}</td>
		    	</tr>
			`

			$("#itemBody").append(tableRow);
			var itemData = {
				id: data.id,
				shipQuantity: shipQuantity
			};

			shipments.push(itemData);
			console.log(shipments);
		},
		error: (data)=>{
			if (data.status==404){
				$("#alertBar").text("Item not found. Please check the ID you entered.");
				$("#alertBar").removeClass("d-none");
			}
		}
	});
});

$("#createShipment").submit((event) => {
	event.preventDefault();
	var name = $("#shipName").val();
	var destination = $("#shipDest").val();
	var date = $("#shipDate").val();

	var jsonData = {
		name: name,
		products: shipments,
		destination: destination,
		date: date
	};

	$.ajax({
		url: "http://localhost:8000/api/shipment",
		type: "POST",
		headers: {"Content-Type": "application/json"},
		data: JSON.stringify(jsonData),
		success: (data)=>{
			console.log("Created");
		},
		error: (data)=>{
			if (data.status==400){
				console.log(data);
				$("#alertBar").text(`Bad submission. ${data.responseText}`);
				$("#alertBar").removeClass("d-none");
			} else if (data.status==403){
				$("#alertBar").text("One of the shipment products entered has quantity greater than inventory. Please create shipment again.");
				$("#alertBar").removeClass("d-none");
			}
		}
	});
})
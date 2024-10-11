function getAllCars() {
    $.ajax({
        url: '/api/Car_API/cars',
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function (data) {
            createCarsTable(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

getAllCars();

function addCar() {
    var car = {
        CAR_ID: $("#createCarForm input[name='carId']").val(),
        CAR_TYPE: $("#createCarForm input[name='carType']").val(),
        RED_CAR: $("#createCarForm input[name='redCar']").is(':checked') ? 1 : 0,
        CAR_AGE: $("#createCarForm input[name='carAge']").val(),
        DRIVER_ID: $("#createCarForm input[name='driverId']").val()
    };

    $.ajax({
        url: '/api/Car_API/cars',
        type: 'POST',
        data: JSON.stringify(car),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            getAllCars();
            //fetchDataForVisualization();
	    //createCarsTable(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function editCar(carId) {
    $.ajax({
        url: '/api/Car_API/cars/' + carId,
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function (data) {
            createEditCarForm(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function editCarValues(carId) {
    var car = {
        CAR_ID: $("#updateCarForm input[name='carId']").val(),
        CAR_TYPE: $("#updateCarForm input[name='carType']").val(),
        RED_CAR: $("#updateCarForm input[name='redCar']").is(':checked') ? 1 : 0,
        CAR_AGE: $("#updateCarForm input[name='carAge']").val(),
        DRIVER_ID: $("#updateCarForm input[name='driverId']").val()
    };

    $.ajax({
        url: '/api/Car_API/cars/' + carId,
        type: 'PUT',
        data: JSON.stringify(car),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            getAllCars();
	    //fetchDataForVisualization();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function deleteCar(carId) {
    $.ajax({
        url: '/api/Car_API/cars/' + carId,
        type: 'DELETE',
        dataType: 'json',
        success: function (data) {
            getAllCars();
	    fetchDataForVisualization();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function createCarsTable(cars) {
    var strResult = '<div class="col-md-12">' +
                    '<table id="carTable" class="table table-bordered table-hover">' +
                    '<thead>' +
                    '<tr>' +
                    '<th>Car ID</th>' +
                    '<th>Car Type</th>' +
                    '<th>Red Car</th>' +
                    '<th>Car Age</th>' +
                    '<th>Driver ID</th>' +
                    '<th>&nbsp;</th>' +
                    '<th>&nbsp;</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>';
    $.each(cars, function (index, car) {
        var redCar = car.RED_CAR == 1 ? 'Yes' : 'No';
        strResult += "<tr><td>" + car.CAR_ID + "</td><td>" + car.CAR_TYPE + "</td><td>" + redCar + "</td><td>" + car.CAR_AGE + "</td><td><a href='driver_details.html?driverId=" + car.DRIVER_ID + "'>" + car.DRIVER_ID + "</a></td><td>";
        strResult += '<input type="button" value="Edit Car" class="btn btn-sm btn-primary" onclick="editCar(' + car.CAR_ID + ');" />';
        strResult += '</td><td>';
        strResult += '<input type="button" value="Delete Car" class="btn btn-sm btn-primary" onclick="deleteCar(' + car.CAR_ID + ');" />';
        strResult += "</td></tr>";
    });
    strResult += "</tbody></table>";
    $("#allData").html(strResult);
}

function createNewCarForm() {
    $("#createCarModal").css("display", "block");

    // Close the create modal when the close button (x) is clicked
    $("#createCarModal .close").click(function() {
        $("#createCarModal").css("display", "none");
    });

    // Bind click event to the button with class .create
    $("#createCarModal .create").click(function() {
        // Call the addCar function when the button is clicked
        addCar();
    });
}

function createEditCarForm(car) {
    $("#updateCarForm input[name='carId']").val(car.CAR_ID);
    $("#updateCarForm input[name='carType']").val(car.CAR_TYPE);
    $("#updateCarForm input[name='redCar']").prop('checked', car.RED_CAR == 1);
    $("#updateCarForm input[name='carAge']").val(car.CAR_AGE);
    $("#updateCarForm input[name='driverId']").val(car.DRIVER_ID);
    $("#updateCarModal").css("display", "block");

    $("#updateCarModal .close").click(function() {
        $("#updateCarModal").css("display", "none");
    });

    $("#updateCarModal .btn-update").click(function() {
        editCarValues(car.CAR_ID);
    });
}

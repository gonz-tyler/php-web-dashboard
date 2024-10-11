document.addEventListener("DOMContentLoaded", function () {
    // Retrieve driver ID from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const driverId = urlParams.get('driverId');

    // Display the driver ID
    getDriver(driverId);
    getDriverClaims(driverId);
    getDriverCars(driverId);
});

function getDriver(driverId) {
    $.ajax({
        url: '/api/Driver_API/drivers/' + driverId,
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function (data) {
            displayDriverDetails(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function getDriverClaims(driverId) {
    $.ajax({
	url: '/api/Claim_API/claims/driver/' + driverId,
	type: 'GET',
	cache: false,
	dataType: 'json',
	success: function (data) {
	    displayDriverClaims(data);
	},
	//error: function (data) {
	error: function (jqXHR, textStatus, errorThrown) {
	    //alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
	    displayDriverClaims([]);
	}
    });
}

function getDriverCars(driverId) {
    $.ajax({
	url: '/api/Car_API/cars/driver/' + driverId,
	type: 'GET',
	cache: false,
	dataType: 'json',
	success: function (data) {
	    displayDriverCars(data);
	},
	error: function (jqXHR, textStatus, errorThrown) {
	    //alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
	    displayDriverCars([]);
	}
    });
}


function displayDriverDetails(driver) {
    const driverIdContainer = document.getElementById("driverIdContainer");
    driverIdContainer.innerHTML = "<h2>Driver ID: <strong>" + driver.ID + "</strong></h2>" +
                                   "<p>Kids Drive: " + driver.KIDSDRIV + "</p>" +
                                   "<p>Age: " + driver.AGE + "</p>" +
                                   "<p>Income: " + driver.INCOME + "</p>" +
                                   "<p>Marital Status: " + (driver.MSTATUS === 1 ? "Married" : "Unmarried") + "</p>" +
                                   "<p>Gender: " + (driver.GENDER === "M" ? "Male" : "Female") + "</p>" +
                                   "<p>Education: " + driver.EDUCATION + "</p>" +
                                   "<p>Occupation: " + driver.OCCUPATION + "</p>";
}

function displayDriverClaims(claims) {
    const claimsContainer = document.getElementById("claimsContainer");
    if (claims.length === 0) {
        claimsContainer.innerHTML = "<p>No claims found for this driver.</p>";
    } else {
        let tableHtml = "<h2>Claims</h2>";
        tableHtml += "<table class='table'>";
        tableHtml += "<thead><tr><th>Claim ID</th><th>Old Claim</th><th>Claim Frequency</th><th>Claim Amount</th><th>Claim Flag</th><th>Kids Drive</th><th>Claim Age</th><th>Claim Income</th><th>Claim Status</th><th>Claim Education</th><th>Claim Occupation</th><th>Car ID</th></tr></thead>";
        tableHtml += "<tbody>";
        claims.forEach(function(claim) {
            tableHtml += "<tr>" +
                         "<td>" + claim.CLAIM_ID + "</td>" +
                         "<td>" + claim.OLDCLAIM + "</td>" +
                         "<td>" + claim.CLM_FREQ + "</td>" +
                         "<td>" + claim.CLM_AMT + "</td>" +
                         "<td>" + claim.CLAIM_FLAG + "</td>" +
                         "<td>" + claim.CLM_KIDSDRIV + "</td>" +
                         "<td>" + claim.CLM_AGE + "</td>" +
                         "<td>" + claim.CLM_INCOME + "</td>" +
                         "<td>" + (claim.CLM_STATUS === 1 ? "Married" : "Unmarried") + "</td>" +
                         "<td>" + claim.CLM_EDUCATION.replace("<","&lt;") + "</td>" +
                         "<td>" + claim.CLM_OCCUPATION + "</td>" +
                         "<td>" + claim.CAR_ID + "</td>" +
                         "</tr>";
        });
        tableHtml += "</tbody></table>";
        claimsContainer.innerHTML = tableHtml;
    }
}

function displayDriverCars(cars) {
    const carsContainer = document.getElementById("carsContainer");
    if (cars.length === 0) {
        carsContainer.innerHTML = "<p>No cars found for this driver.</p>";
    } else {
        let tableHtml = "<h2>Cars</h2>";
        tableHtml += "<table class='table'>";
        tableHtml += "<thead><tr><th>Car ID</th><th>Car Type</th><th>Red Car</th><th>Car Age</th></tr></thead>";
        tableHtml += "<tbody>";
        cars.forEach(function(car) {
            tableHtml += "<tr>" +
                         "<td>" + car.CAR_ID + "</td>" +
                         "<td>" + car.CAR_TYPE + "</td>" +
                         "<td>" + (car.RED_CAR === 1 ? "Yes" : "No") + "</td>" +
                         "<td>" + car.CAR_AGE + "</td>" +
                         "</tr>";
        });
        tableHtml += "</tbody></table>";
        carsContainer.innerHTML = tableHtml;
    }
}

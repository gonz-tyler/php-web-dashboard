function getAllDrivers()
{
    $.ajax({
        url: '/api/Driver_API/drivers',
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function (data) {
            createDriversTable(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

getAllDrivers();

function addDriver()
{
    var driver = {
        ID: $("#createDriverForm input[name='driverId']").val(),
        KIDSDRIV: $("#createDriverForm input[name='kidsDrive']").val(),
        AGE: $("#createDriverForm input[name='age']").val(),
        INCOME: $("#createDriverForm input[name='income']").val(),
        MSTATUS: $("#createDriverForm input[name='mstatus']").is(':checked') ? 1: 0,
        GENDER: $("#createDriverForm select[name='gender']").val(),
        EDUCATION: $("#createDriverForm input[name='education']").val(),
        OCCUPATION: $("#createDriverForm input[name='occupation']").val()
    };
    //for (var key in driver) {
    //    console.log(key + ':', driver[key], typeof driver[key]);
    //}

    $.ajax({
        url: '/api/Driver_API/drivers',
        type: 'POST',
        data: JSON.stringify(driver),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            getAllDrivers();
	    fetchDataForVisualization();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function cancelChangeDriver()
{
    $("#newdriverform").html("");
}

function editDriver(driverId)
{
    $.ajax({
        url: '/api/Driver_API/drivers/' + driverId,
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function (data) {
            createEditDriverForm(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function editDriverValues(driverId)
{
    var driver = {
        ID: $("#updateDriverForm input[name='driverId']").val(),
        KIDSDRIV: $("#updateDriverForm input[name='kidsDrive']").val(),
        AGE: $("#updateDriverForm input[name='age']").val(),
        INCOME: $("#updateDriverForm input[name='income']").val(),
        MSTATUS: $("#updateDriverForm input[name='mstatus']").is(':checked') ? 1: 0,
        GENDER: $("#updateDriverForm select[name='gender']").val(),
        EDUCATION: $("#updateDriverForm input[name='education']").val(),
        OCCUPATION: $("#updateDriverForm input[name='occupation']").val()
    };
    console.log(driver);
    //for (var key in driver) {
    //    console.log(key + ':', driver[key], typeof driver[key]);
    //}

    $.ajax({
        url: '/api/Driver_API/drivers',
        type: 'PUT',
        data: JSON.stringify(driver),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log('Response from PHP script: ', data);
            getAllDrivers();
	    fetchDataForVisualization();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
    getAllDrivers();

}

function deleteDriver(driverId)
{
    $.ajax({
        url: '/api/Driver_API/drivers/' + driverId,
        type: 'DELETE',
        dataType: 'json',
        success: function (data) {
            getAllDrivers();
	    fetchDataForVisualization();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function createDriversTable(drivers)
{
    var strResult = '<div class="col-md-12">' + 
                    '<table id="driverTable" class="table table-bordered table-hover">' +
                    '<thead>' +
                    '<tr>' +
                    '<th>ID</th>' +
                    '<th>Kids Drive</th>' +
                    '<th>Age</th>' +
                    '<th>Income</th>' +
                    '<th>Marital Status</th>' +
                    '<th>Gender</th>' +
                    '<th>Education</th>' +
                    '<th>Occupation</th>' +
                    '<th>&nbsp;</th>' +
                    '<th>&nbsp;</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>';
    $.each(drivers, function (index, driver)
    {
        if (driver.MSTATUS == 1) {
            var marriageStatus = "Married";
        } else {
            var marriageStatus = "Unmarried";
        }
	if (driver.GENDER == "M") {
   	    var gender = "Male";
	} else {
	    var gender = "Female";
	}
        strResult += "<tr><td><a href='driver_details.html?driverId=" + driver.ID + "'>" + driver.ID + "</a></td><td>" + driver.KIDSDRIV + "</td><td>" + driver.AGE + "</td><td>" + driver.INCOME + "</td><td>" + marriageStatus + "</td><td>" + gender + "</td><td>" + driver.EDUCATION.replace("<","&lt;") + "</td><td>" + driver.OCCUPATION + "</td><td>";
        strResult += '<input type="button" value="Edit Driver" class="btn btn-sm btn-primary" onclick="editDriver(' + driver.ID + ');" />';
        strResult += '</td><td>';
        strResult += '<input type="button" value="Delete Driver" class="btn btn-sm btn-primary" onclick="deleteDriver(' + driver.ID + ');" />';
        strResult += "</td></tr>";
    });
    strResult += "</tbody></table>";
    $("#allData").html(strResult);
}

function createNewDriverForm() {
    $("#createDriverModal").css("display", "block");

    // Close the create modal when the close button (x) is clicked
    $("#createDriverModal .close").click(function() {
        $("#createDriverModal").css("display", "none");
    });

    // Bind click event to the button with class .create
    $("#createDriverModal .create").click(function() {
        // Call the addDriver function when the button is clicked
        addDriver();
    });
}

function createEditDriverForm(driver) {
    $("#updateDriverForm input[name='driverId']").val(driver.ID);
    $("#updateDriverForm input[name='kidsDrive']").val(driver.KIDSDRIV);
    $("#updateDriverForm input[name='age']").val(driver.AGE);
    $("#updateDriverForm input[name='income']").val(driver.INCOME);
    if (driver.MSTATUS == 1) {
        $("#updateDriverForm input[name='mstatus']").prop("checked", true);
    } else {
        $("#updateDriverForm input[name='mstatus']").prop("checked", false);
    }
    $("#updateDriverForm select[name='gender']").val(driver.GENDER);
    $("#updateDriverForm input[name='education']").val(driver.EDUCATION);
    $("#updateDriverForm input[name='occupation']").val(driver.OCCUPATION);
    $("#updateDriverModal").css("display", "block");
    $("#updateDriverModal .close").click(function() {
        $("#updateDriverModal").css("display", "none");
    });
    console.log(driver.AGE);
    $("#updateDriverModal .btn-update").click(function() {
        console.log("before edit");
        editDriverValues(driver.ID);
        //console.log(driver.ID);
    });
}

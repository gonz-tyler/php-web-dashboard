function getAllClaims() {
    $.ajax({
        url: '/api/Claim_API/claims',
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function (data) {
            createClaimsTable(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

getAllClaims();

function addClaim() {
    var claim = {
        CLAIM_ID: $("#createClaimForm input[name='claimId']").val(),
        OLDCLAIM: $("#createClaimForm input[name='oldClaim']").val(),
        CLM_FREQ: $("#createClaimForm input[name='claimFrequency']").val(),
        CLM_AMT: $("#createClaimForm input[name='claimAmount']").val(),
        CLAIM_FLAG: $("#createClaimForm input[name='claimFlag']").is(':checked') ? 1 : 0,
        CLM_KIDSDRIV: $("#createClaimForm input[name='claimKidsDrive']").val(),
        CLM_AGE: $("#createClaimForm input[name='claimAge']").val(),
        CLM_INCOME: $("#createClaimForm input[name='claimIncome']").val(),
        CLM_STATUS: $("#createClaimForm input[name='claimStatus']").is(':checked') ? 1 : 0,
        CLM_EDUCATION: $("#createClaimForm input[name='claimEducation']").val(),
        CLM_OCCUPATION: $("#createClaimForm input[name='claimOccupation']").val(),
        DRIVER_ID: $("#createClaimForm input[name='driverId']").val(),
        CAR_ID: $("#createClaimForm input[name='carId']").val()
    };
    for (var key in claim) {
        console.log(key + ':', claim[key], typeof claim[key]);
    }
    console.log("finished printing claim from inside addClaim()");

    $.ajax({
        url: '/api/Claim_API/claims',
        type: 'POST',
        data: JSON.stringify(claim),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
	    //console.log("data sent to claimsAPI");
	    console.log("PHP==", data);
            getAllClaims();
	    fetchDataForVisualization();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function editClaim(claimId) {
    console.log("in edit claim");
    $.ajax({
        url: '/api/Claim_API/claims/' + claimId,
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function (data) {
            createEditClaimForm(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function editClaimValues(claimId) {
    console.log("in edit claim values for claim id ", claimId);
    var claim = {
        CLAIM_ID: $("#updateClaimForm input[name='claimId']").val(),
        OLDCLAIM: $("#updateClaimForm input[name='oldClaim']").val(),
        CLM_FREQ: $("#updateClaimForm input[name='claimFrequency']").val(),
        CLM_AMT: $("#updateClaimForm input[name='claimAmount']").val(),
        CLAIM_FLAG: $("#updateClaimForm input[name='claimFlag']").is(':checked') ? 1 : 0,
        CLM_KIDSDRIV: $("#updateClaimForm input[name='claimKidsDrive']").val(),
        CLM_AGE: $("#updateClaimForm input[name='claimAge']").val(),
        CLM_INCOME: $("#updateClaimForm input[name='claimIncome']").val(),
        CLM_STATUS: $("#updateClaimForm input[name='claimStatus']").is(':checked') ? 1 : 0,
        CLM_EDUCATION: $("#updateClaimForm input[name='claimEducation']").val(),
        CLM_OCCUPATION: $("#updateClaimForm input[name='claimOccupation']").val(),
        DRIVER_ID: $("#updateClaimForm input[name='driverId']").val(),
        CAR_ID: $("#updateClaimForm input[name='carId']").val()
    };

    $.ajax({
        url: '/api/Claim_API/claims',
        type: 'PUT',
        data: JSON.stringify(claim),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
	    console.log("PHP==",data);
            getAllClaims();
	    fetchDataForVisualization();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function deleteClaim(claimId) {
    $.ajax({
        url: '/api/Claim_API/claims/' + claimId,
        type: 'DELETE',
        dataType: 'json',
        success: function (data) {
            getAllClaims();
	    fetchDataForVisualization();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function createClaimsTable(claims) {
    var strResult = '<div class="col-md-12">' +
        '<table id="claimTable" class="table table-bordered table-hover">' +
        '<thead>' +
        '<tr>' +
        '<th>Claim ID</th>' +
        '<th>Old Claim</th>' +
        '<th>Claim Frequency</th>' +
        '<th>Claim Amount</th>' +
        '<th>Claim Flag</th>' +
        '<th>Claim Kids Drive</th>' +
        '<th>Claim Age</th>' +
        '<th>Claim Income</th>' +
        '<th>Claim Status</th>' +
        '<th>Claim Education</th>' +
        '<th>Claim Occupation</th>' +
        '<th>Driver ID</th>' +
        '<th>Car ID</th>' +
        '<th>&nbsp;</th>' +
        '<th>&nbsp;</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>';
    $.each(claims, function (index, claim) {
        var claimFlagText = claim.CLAIM_FLAG === 1 ? "Yes" : "No";
        var claimStatusText = claim.CLM_STATUS === 1 ? "Yes" : "No";
        strResult += "<tr><td>" + claim.CLAIM_ID + "</td><td>" + claim.OLDCLAIM + "</td><td>" + claim.CLM_FREQ + "</td><td>" + claim.CLM_AMT + "</td><td>" + claimFlagText + "</td><td>" + claim.CLM_KIDSDRIV + "</td><td>" + claim.CLM_AGE + "</td><td>" + claim.CLM_INCOME + "</td><td>" + claimStatusText + "</td><td>" + claim.CLM_EDUCATION.replace("<","&lt;") + "</td><td>" + claim.CLM_OCCUPATION + "</td><td><a href='driver_details.html?driverId=" + claim.DRIVER_ID + "'>" + claim.DRIVER_ID + "</a></td><td>" + claim.CAR_ID + "</td><td>";
        strResult += '<input type="button" value="Edit Claim" class="btn btn-sm btn-primary" onclick="editClaim(' + claim.CLAIM_ID + ');" />';
        //strResult += '<input type="button" value="Edit Claim" class="btn btn-sm btn-primary" onclick="testModalClaim();" />';
        strResult += '</td><td>';
        strResult += '<input type="button" value="Delete Claim" class="btn btn-sm btn-primary" onclick="deleteClaim(' + claim.CLAIM_ID + ');" />';
        strResult += "</td></tr>";
    });
    strResult += "</tbody></table>";
    $("#allData").html(strResult);
}

function createNewClaimForm() {
    $("#createClaimModal").css("display", "block");


    // Close the create modal when the close button (x) is clicked
    $("#createClaimModal .close").click(function () {
        $("#createClaimModal").css("display", "none");
    });

    // Bind click event to the button with class .create
    $("#createClaimModal .create").click(function () {
        // Call the addClaim function when the button is clicked
        addClaim();
    });
}

function testModalClaim() {
    $("#updateClaimModal").css("display", "block");
    $("#updateClaimModal .close").click(function () {
	$("#updateClaimModal").css("display", "none");
    });
}

function createEditClaimForm(claim) {
    console.log("creating form");
    $("#updateClaimForm input[name='claimId']").val(claim.CLAIM_ID);
    $("#updateClaimForm input[name='oldClaim']").val(claim.OLDCLAIM);
    $("#updateClaimForm input[name='claimFrequency']").val(claim.CLM_FREQ);
    $("#updateClaimForm input[name='claimAmount']").val(claim.CLM_AMT);
    if (claim.CLAIM_FLAG == 1) {
	$("#updateClaimForm input[name='claimFlag']").prop("checked", true);
    } else {
	$("#updateClaimForm input[name='claimFlag']").prop("checked", false);
    }
    $("#updateClaimForm input[name='claimKidsDrive']").val(claim.CLM_KIDSDRIV);
    $("#updateClaimForm input[name='claimAge']").val(claim.CLM_AGE);
    $("#updateClaimForm input[name='claimIncome']").val(claim.CLM_INCOME);
    if (claim.CLM_STATUS == 1) {
	$("#updateClaimForm input[name='claimStatus']").prop("checked", true);
    } else {
	$("#updateClaimForm input[name='claimStatus']").prop("checked", false);
    }
    $("#updateClaimForm input[name='claimEducation']").val(claim.CLM_EDUCATION);
    $("#updateClaimForm input[name='claimOccupation']").val(claim.CLM_OCCUPATION);
    $("#updateClaimForm input[name='driverId']").val(claim.DRIVER_ID);
    $("#updateClaimForm input[name='carId']").val(claim.CAR_ID);
    $("#updateClaimModal").css("display", "block");
    $("#updateClaimModal .close").click(function () {
        $("#updateClaimModal").css("display", "none");
    });
    $("#updateClaimModal .btn-update").click(function () {
	console.log("button clicked in claim form");
        editClaimValues(claim.CLAIM_ID);
    });
    console.log("form created");
}


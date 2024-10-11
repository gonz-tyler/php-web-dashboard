// Function to fetch claims data
function getClaimData() {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: '/api/Claim_API/claims',
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function(data) {
                resolve(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                reject(errorThrown);
            }
        });
    });
}

// Function to fetch driver data
function getDriverData() {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: '/api/Driver_API/drivers',
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function(data) {
                resolve(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                reject(errorThrown);
            }
        });
    });
}

// Function to fetch car data
function getCarData() {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: '/api/Car_API/cars',
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function(data) {
                resolve(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                reject(errorThrown);
            }
        });
    });
}

// Function to fetch all data and create visualization
function fetchDataForVisualization() {
    let claimsData;
    let driversData;
    let carsData;

    // Fetch claims data
    getClaimData()
        .then(function(data) {
            claimsData = data;
            // Fetch drivers data
            return getDriverData();
        })
        .then(function(data) {
            driversData = data;
            // Fetch cars data
            return getCarData();
        })
        .then(function(data) {
            carsData = data;
            // Once all data is fetched, continue with visualization
            createVisualizations(claimsData, driversData, carsData);
        })
        .catch(function(error) {
            console.error('Error fetching data:', error);
        });
}

// Function to create visualization using fetched data
function createVisualizations(claimsData, driversData, carsData) {

    createGenderChart(claimsData, driversData);
    createMaritalStatusChart(driversData, claimsData);
    createOccupationChart(driversData);
    createEducationChart(driversData);
    createAgeChart(claimsData, driversData)
    createTotalClaimsChart(claimsData);
    createTotalMoneyClaimsChart(claimsData);
    createTopDriversChart(claimsData, 3);
    createCarTypeChart(carsData);
    createCarAgeChart(carsData);
    createRedCarChart(carsData);
}


// Function to create a Chart.js chart for gender proportions
function createGenderChart(claimsData, driversData) {
    let maleCount = 0;
    let femaleCount = 0;
    // Iterate over each claim in the claimsData
    if (claimsData) {
        claimsData.forEach(function(claim) {
            // Find the corresponding driver in the driversData
            let driver = driversData.find(function(driver) {
                return driver.ID == claim.DRIVER_ID;
            });

            // If driver is found, determine gender and increment count
            if (driver) {
                if (driver.GENDER == 'M') {
                    maleCount++;
                } else if (driver.GENDER == 'F') {
                    femaleCount++;
                }
            }
        });
    }
    if (ctx) {
	ctx.destroy();
    }
    var ctx = document.getElementById('genderChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Female', 'Male'],
            datasets: [{
                data: [femaleCount, maleCount],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
      		title: {
        	display: true,
        	text: 'Gender Proportions for Claims',
        	font: {
          	    size: 32
        	},
        	padding: {
          	    top: 30,
          	    bottom: 30
        	},
        	color: 'black',
            	position: 'top', // 'top', 'left', 'bottom', 'right'
        	align: 'center' // 'start', 'center', 'end'
      		}
    	    }
  	}
    });
}

// Function to create a Chart.js chart for marital status
/*function createMaritalStatusChart(driversData, claimsData) {
    // Count the frequency of each marital status for drivers
    let maritalStatusCounts = {};
    driversData.forEach(function(driver) {
        let maritalStatus = driver.MSTATUS;
        if (maritalStatusCounts[maritalStatus]) {
            maritalStatusCounts[maritalStatus]++;
        } else {
            maritalStatusCounts[maritalStatus] = 1;
        }
    });

    // Count the frequency of each marital status for claimants
    let maritalStatusCountsClaims = {};
    claimsData.forEach(function(claim) {
        let maritalStatusClaims = claim.CLM_STATUS;
        if (maritalStatusCountsClaims[maritalStatusClaims]) {
            maritalStatusCountsClaims[maritalStatusClaims]++;
        } else {
            maritalStatusCountsClaims[maritalStatusClaims] = 1;
        }
    });

    // Extract marital statuses and counts for drivers
    let statuses = Object.keys(maritalStatusCounts);
    let counts = Object.values(maritalStatusCounts);

    // Extract marital statuses and counts for claimants
    let statusesClaim = Object.keys(maritalStatusCountsClaims);
    let countsClaim = Object.values(maritalStatusCountsClaims);

    // Create Chart.js chart
    if (ctx) {
        ctx.destroy();
    }
    var ctx = document.getElementById('maritalChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Unmarried Drivers', 'Married Drivers', 'Unmarried Claimants', 'Married Claimants'],
        datasets: [{
            data: counts,
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        },
	{
	    data: countsClaim,
	    backgroundColor: [
		'rgba(255,206,86,0.5)',
		'rgba(75,192,192,1)'
	    ],
	    borderColor: [
	        'rgba(255,206,86,1)',
	        'rgba(75,192,192,1)'
	    ],
	    borderWidth: 1
        }
        ]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: 'Distribution of Drivers and Claimants by Marital Status',
                font: {
                    size: 32
                },
                padding: {
                    top: 30,
                    bottom: 30
                },
                color: 'black',
                position: 'top',
                align: 'center'
            }
        }
    }
});



/*var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Unmarried Drivers', 'Married Drivers', 'Unmarried Claimants', 'Married Claimants'],
        datasets: [{
            label: 'Marital Status Drivers',
            data: counts,
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)', // Unmarried drivers
                'rgba(54, 162, 235, 0.5)' // Married drivers
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        },
        {
            label: 'Marital Status Claims',
            data: countsClaim,
            backgroundColor: [
                'rgba(255, 206, 86, 0.5)', // Unmarried claimants
                'rgba(75, 192, 192, 0.5)' // Married claimants
            ],
            borderColor: [
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: 'Marital Status Distribution',
                font: {
                    size: 32
                },
                padding: {
                    top: 30,
                    bottom: 30
                },
                color: 'black',
                position: 'top', // 'top', 'left', 'bottom', 'right'
                align: 'center' // 'start', 'center', 'end'
            }
        }
    }
});
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: statuses,
            datasets: [{
                label: 'Marital Status Drivers',
                data: counts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            },
            {
                label: 'Marital Status Claims',
                data: countsClaim,
                backgroundColor: [
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Marital Status Distribution',
                    font: {
                        size: 32
                    },
                    padding: {
                        top: 30,
                        bottom: 30
                    },
                    color: 'black',
                    position: 'top', // 'top', 'left', 'bottom', 'right'
                    align: 'center' // 'start', 'center', 'end'
                }
            }
        }
    });
}*/

// Function to create a Chart.js chart for marital status
function createMaritalStatusChart(driversData, claimsData) {
    // Count the frequency of each marital status for drivers
    let driversCounts = {
        'Unmarried Drivers': 0,
        'Married Drivers': 0
    };
    driversData.forEach(function(driver) {
        let maritalStatus = driver.MSTATUS;
        if (maritalStatus == 0) {
	    driversCounts['Unmarried Drivers']++;
	} else if (maritalStatus == 1) {
	    driversCounts['Married Drivers']++;
        }
    });
    console.log("test",driversCounts);
    // Count the frequency of each marital status for claimants
    let claimantsCounts = {
        'Unmarried Claimants': 0,
        'Married Claimants': 0
    };
    claimsData.forEach(function(claim) {
        let maritalStatus = claim.CLM_STATUS;
        if (maritalStatus == 0) {
	    claimantsCounts['Unmarried Claimants']++;
	} else if (maritalStatus == 1) {
	    claimantsCounts['Married Claimants']++;
	}
    });
    console.log("test",claimantsCounts);
    // Create Chart.js chart
    if (ctx) {
        ctx.destroy();
    }
    var ctx = document.getElementById('maritalChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ['Unmarried Drivers', 'Married Drivers', 'Unmarried Claimants', 'Married Claimants'],
            datasets: [{
                data: [
                    driversCounts['Unmarried Drivers'],
                    driversCounts['Married Drivers'],
                    claimantsCounts['Unmarried Claimants'],
                    claimantsCounts['Married Claimants']
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Distribution of Drivers and Claimants by Marital Status',
                    font: {
                        size: 32
                    },
                    padding: {
                        top: 30,
                        bottom: 30
                    },
                    color: 'black',
                    position: 'top',
                    align: 'center'
                }
            }
        }
    });
}


// Function to create a Chart.js chart for occupation
function createOccupationChart(driversData) {
    // Count the frequency of each occupation
    let occupationCounts = {};
    driversData.forEach(function(driver) {
        let occupation = driver.OCCUPATION;
        if (occupationCounts[occupation]) {
            occupationCounts[occupation]++;
        } else {
            occupationCounts[occupation] = 1;
        }
    });

    // Extract occupations and counts
    let occupations = Object.keys(occupationCounts);
    let counts = Object.values(occupationCounts);
    console.log(occupations);
    // Create Chart.js chart
    if (ctx) {
        ctx.destroy();
    }
    var ctx = document.getElementById('occupationChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: occupations,
            datasets: [{
                label: 'Occupation Distribution',
                data: counts,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Occupation Distribution',
                    font: {
                        size: 32
                    },
                    padding: {
                        top: 30,
                        bottom: 30
                    },
                    color: 'black',
                    position: 'top', // 'top', 'left', 'bottom', 'right'
                    align: 'center' // 'start', 'center', 'end'
                }
            }
        }
    });
}

// Function to create a Chart.js chart for education
function createEducationChart(driversData) {
    // Define the order of education levels
    let educationOrder = ['PhD', 'Masters', 'Bachelors', 'High School', '<High School', 'Other'];

    // Initialize counts for each education level
    let educationCounts = {
        'PhD': 0,
        'Masters': 0,
        'Bachelors': 0,
        'High School': 0,
        '<High School': 0,
        'Other': 0
    };

    // Count the frequency of each education level
    driversData.forEach(function(driver) {
        let education = driver.EDUCATION;
        // Check if the education level is one of the predefined levels
        if (educationCounts.hasOwnProperty(education)) {
            // Increment the count for the corresponding education level
            educationCounts[education]++;
        } else {
            // Increment the count for 'Other' if the education level is not in the predefined list
            educationCounts['Other']++;
        }
    });

    // Initialize arrays to store the ordered education levels and their corresponding counts
    let levels = [];
    let counts = [];

    // Populate the arrays in the order specified
    educationOrder.forEach(function(level) {
        levels.push(level);
        counts.push(educationCounts[level]);
    });

    // Create Chart.js chart
    if (ctx) {
        ctx.destroy();
    }
    var ctx = document.getElementById('educationChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: levels,
            datasets: [{
                label: 'Education Level Distribution',
                data: counts,
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
	    indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Education Level Distribution',
                    font: {
                        size: 32
                    },
                    padding: {
                        top: 30,
                        bottom: 30
                    },
                    color: 'black',
                    position: 'top', // 'top', 'left', 'bottom', 'right'
                    align: 'center' // 'start', 'center', 'end'
                }
            }
        }
    });
}

// Function to create a line chart comparing ages of claimants and drivers
function createAgeChart(claimsData, driversData) {
    // Extract ages of claimants and drivers
    let claimantAges = claimsData.map(claim => claim.CLM_AGE);
    let driverAges = driversData.map(driver => driver.AGE);

    // Get labels for the chart (ages)
    let labels = Array.from(new Set([...claimantAges, ...driverAges])).sort((a, b) => a - b);

    // Prepare data arrays for claimants and drivers
    let claimantData = labels.map(age => claimantAges.filter(a => a === age).length);
    let driverData = labels.map(age => driverAges.filter(a => a === age).length);

    // Create the line chart
    var ctx = document.getElementById('ageChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Claimants',
                data: claimantData,
                borderColor: 'rgba(255, 99, 132, 1)', // Red color for claimants
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Semi-transparent red background
                borderWidth: 1,
                fill: false
            }, {
                label: 'Drivers',
                data: driverData,
                borderColor: 'rgba(54, 162, 235, 1)', // Blue color for drivers
                backgroundColor: 'rgba(54, 162, 235, 0.2)', // Semi-transparent blue background
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Age',
                        font: {
                            size: 16
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Frequency',
                        font: {
                            size: 16
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Comparison of Ages Between Claimants and Drivers',
                    font: {
                        size: 20
                    }
                }
            }
        }
    });
}


// Function to create a Chart.js chart for total number of claims
function createTotalClaimsChart(claimsData) {
    // Count the total number of claims
    let totalClaims = claimsData.length;
    // Get a reference to the div where you want to display the content
    var divElement = document.getElementById("totalClaimsChart");

    // Define the HTML content
    var htmlContent = "<p>Total Number of Claims:</p>";
    htmlContent += '<p style="font-size:64px; text-align:center"><strong>' + totalClaims + "</strong></p>";
    console.log(htmlContent);
    // Add the HTML content to the div
    divElement.innerHTML = htmlContent;

}

// Function to create a Chart.js chart for total money claims
function createTotalMoneyClaimsChart(claimsData) {
    // Calculate the total money claims
    let totalMoneyClaims = 0;
    let totalOldMoneyClaims = 0;

    claimsData.forEach(function(claim) {
	totalMoneyClaims += parseFloat(claim.CLM_AMT);
	totalOldMoneyClaims += parseFloat(claim.OLDCLAIM);
    });

    // Calculate the total claim money and the highest claim
//let totalMoneyClaims = claimsData.reduce((total, claim) => total + claim.CLM_AMT + claim.OLDCLAIM, 0);
let highestClaim = Math.max(...claimsData.map(claim => claim.CLM_AMT), ...claimsData.map(claim => claim.OLDCLAIM));

// Format the money values as currency with a dollar sign
let formattedTotalMoneyClaims = totalMoneyClaims.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
let formattedHighestClaim = highestClaim.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
let averageClaim = totalMoneyClaims/claimsData.length;
let formattedAverageClaim = averageClaim.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
// Get a reference to the div where you want to display the content
var divElement = document.getElementById("totalMoneyChart");

// Define the HTML content
var htmlContent = "<p>Total Claim Money: <strong>" + formattedTotalMoneyClaims + "</strong></p>";
htmlContent += "<p>Highest Claim: <strong>" + formattedHighestClaim + "</strong></p>";
htmlContent += "<P>Average Claim Amount: <strong>" + formattedAverageClaim + "</strong></p>";
// Add the HTML content to the div
divElement.innerHTML = htmlContent;
}

// Function to create a Chart.js bar chart for top n drivers with most claims
function createTopDriversChart(claimsData, n = 3) {
    // Object to store driver ID and claim count
    var driverClaimsCount = {};

    // Iterate through claims data to count claims for each driver
    claimsData.forEach(function(claim) {
        var driverId = claim.DRIVER_ID;
        if (driverClaimsCount[driverId]) {
            driverClaimsCount[driverId]++;
        } else {
            driverClaimsCount[driverId] = 1;
        }
    });

    // Convert object to array of { driverId, claimCount } objects
    var driversArray = [];
    for (var driverId in driverClaimsCount) {
        driversArray.push({ driverId: driverId, claimCount: driverClaimsCount[driverId] });
    }

    // Sort drivers based on claim count in descending order
    driversArray.sort(function(a, b) {
        return b.claimCount - a.claimCount;
    });

    // Get top N drivers
    var topDrivers = driversArray.slice(0, n);
    // Extract driver names and claim counts
    var driverNames = topDrivers.map(function(driver) {
        return "Driver " + driver.driverId; // Example: "Driver 123"
    });
    var claimCounts = topDrivers.map(function(driver) {
        return driver.claimCount;
    });

    // Create Chart.js chart
    var ctx = document.getElementById('topDriversChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: driverNames,
            datasets: [{
                label: 'Number of Claims',
                data: claimCounts,
                backgroundColor: ['rgba(255, 99, 132, 0.5)','rgba(99,132,255,0.5)','rgba(132,255,99,0.5)'],
                borderColor: ['rgba(255, 99, 132, 1)','rgba(99,132,255,1)','rgba(132,255,99,1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Top Drivers with Most Claims',
                    font: {
                        size: 18
                    }
                }
            }
        }
    });
}


// Function to create a Chart.js chart for car types
function createCarTypeChart(carsData) {
    // Count the frequency of each car type
    let carTypeCounts = {};
    carsData.forEach(function(car) {
        let carType = car.CAR_TYPE;
        if (carTypeCounts[carType]) {
            carTypeCounts[carType]++;
        } else {
            carTypeCounts[carType] = 1;
        }
    });

    // Extract car types and counts
    let carTypes = Object.keys(carTypeCounts);
    let counts = Object.values(carTypeCounts);

    // Create Chart.js chart
    if (ctx) {
        ctx.destroy();
    }
    var ctx = document.getElementById('carTypeChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: carTypes,
            datasets: [{
                label: 'Car Types',
                data: counts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Car Types Distribution',
                    font: {
                        size: 32
                    },
                    padding: {
                        top: 30,
                        bottom: 30
                    },
                    color: 'black',
                    position: 'top', // 'top', 'left', 'bottom', 'right'
                    align: 'center' // 'start', 'center', 'end'
                }
            }
        }
    });
}

// Function to create a Chart.js chart for car ages
function createCarAgeChart(carsData) {
    // Extract car ages
    let carAgeCounts = {};
    carsData.forEach(function(car) {
        let carAge = car.CAR_AGE;
        if (carAgeCounts[carAge]) {
            carAgeCounts[carAge]++;
        } else {
            carAgeCounts[carAge] = 1;
        }
    });

    let carAges = Object.keys(carAgeCounts);
    let counts = Object.values(carAgeCounts);


    // Create histogram for car age distribution
    if (ctx) {
        ctx.destroy();
    }
    var ctx = document.getElementById('carAgeChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: carAges,
            datasets: [{
                label: 'Car Age Distribution',
                data: counts,
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                },
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Car Age Distribution',
                    font: {
                        size: 32
                    },
                    padding: {
                        top: 30,
                        bottom: 30
                    },
                    color: 'black',
                    position: 'top', // 'top', 'left', 'bottom', 'right'
                    align: 'center' // 'start', 'center', 'end'
                }
            }
        }
    });
}

// Function to create a Chart.js chart for red cars
function createRedCarChart(carsData) {
    // Count the number of red cars
    let redCarCount = carsData.reduce((count, car) => {
        if (car.RED_CAR == 1) {
            return count + 1;
        } else {
            return count;
        }
    }, 0);

    // Create Chart.js chart
    if (ctx) {
        ctx.destroy();
    }
    var ctx = document.getElementById('redCarChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Red Cars', 'Non-Red Cars'],
            datasets: [{
                data: [redCarCount, carsData.length - redCarCount],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Red Cars Distribution',
                    font: {
                        size: 32
                    },
                    padding: {
                        top: 30,
                        bottom: 30
                    },
                    color: 'black',
                    position: 'top', // 'top', 'left', 'bottom', 'right'
                    align: 'center' // 'start', 'center', 'end'
                }
            }
        }
    });
}

// Call the function to fetch data and create visualization
fetchDataForVisualization();

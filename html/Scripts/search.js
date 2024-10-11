$(document).ready(function() {
  // Add event listener for keyup event on search input
  $("#searchInput").on("keyup", function() {
    // Get the value of the search input
    var searchText = $(this).val().toLowerCase();
    // Filter table rows based on the search input
    $("#driverTable tbody tr").each(function() {
      // Compare the text in the first column (Driver ID) with the search input
      var driverId = $(this).find("td:first-child").text().toLowerCase();
      // Toggle the visibility of the table row based on whether it matches the search input
      $(this).toggle(driverId.indexOf(searchText) > -1);
    });
  });
});

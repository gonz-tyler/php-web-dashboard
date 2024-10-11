document.addEventListener('DOMContentLoaded', function() {
    var widgets = document.querySelectorAll('.widget');
    var overlay = document.getElementById('overlay');

    widgets.forEach(function(widget) {
        widget.addEventListener('click', function(event) {
        // Increase the size of the clicked widget
        var originalWidth = widget.offsetWidth;
        var originalHeight = widget.offsetHeight;
        console.log(originalWidth,originalHeight);
        widget.style.maxWidth = '800px'; // (originalWidth * 5) + 'px';
        widget.style.maxHeight = '900px'; // (originalHeight * 5) + 'px';
        widget.style.zIndex = '99'; // Move widget to a higher z-index
        //var widgetRect = widget.getBoundingClientRect();
        //console.log(widgetRect.width,widgetRect.height);
        // Center the widget on the screen
        //var widgetRect = widget.getBoundingClientRect();
        var centerX = window.innerWidth / 2 - widget.style.maxWidth / 2;
        var centerY = window.innerHeight / 2 - widget.style.maxHeight / 2;
        widget.style.left = centerX + 'px';
        widget.style.top = centerY + 'px';
        widget.style.position = 'absolute';

        // Show overlay
        overlay.style.display = 'block';

        // Disable scrolling on the body
        document.body.style.overflow = 'hidden';
      });
    });

    // Close enlarged widget when clicking on overlay
    overlay.addEventListener('click', function() {
        widgets.forEach(function(widget) {
        // Reset the size of the widget
        widget.style.maxWidth = '';
        widget.style.maxHeight = '';
        widget.style.zIndex = 'auto'; // Reset z-index to default
        widget.style.position = 'static'; // Reset position to static
      });

      // Hide overlay
      overlay.style.display = 'none';

      // Enable scrolling on the body
      document.body.style.overflow = 'auto';
    });
    $(document).ready(function() {
        // Add event listener for keyup event on search input
        $("#searchInput").on("keyup", function() {
            // Get the value of the search input
            var searchText = $(this).val().toLowerCase();
            // Filter table rows based on the search input
    	    $("#driverTable tbody tr").filter(function() {
      	    	// Compare the text in the first column (Driver ID) with the search input
      	    	$(this).toggle($(this).children("td").eq(0).text().toLowerCase().indexOf(searchText) > -1);
    	    });
        });
    });

});

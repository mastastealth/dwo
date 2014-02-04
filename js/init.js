//Activate Overlay
function overlayOn() {
	var o = document.querySelector('.overlay');
	buoy.addClass(o,'active');
}

// Clicking on a homepage button
[].forEach.call(document.querySelectorAll('.home button'), function(el) {
  el.addEventListener('click', function() {
    // Create
    if ( buoy.hasClass(this, 'create') ) {
    	var game = document.querySelector('.game');
    	buoy.addClass(game,'active');
	}
    // Join
    else if ( buoy.hasClass(this, 'join') ) {
    	overlayOn();
    }
    // Build
    else if ( buoy.hasClass(this, 'build') ) {
    	overlayOn();
    }
  })
})
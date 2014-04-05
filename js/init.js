document.addEventListener('DOMContentLoaded', function(){ 
	var deck;
	var victoryPts = 0;

	//Activate Overlay
	function overlayOn() {
		var o = document.querySelector('.overlay');
		buoy.addClass(o,'active');
	}

	// Clicking on a homepage button
	[].forEach.call(document.querySelectorAll('.home button'), function(el) {
	  el.addEventListener('click', function() {
		// Sets some main variables
		var m = document.querySelector('.overlay .modal');
		var game = document.querySelector('.game');
		var conn;
		var peer;

		function cancelConn() {
			peer.destroy();
			buoy.removeClass(m.parentNode,'active');
			buoy.removeClass(game,'active');
			m.innerHTML = '';
		}

		// Create Game
		if ( buoy.hasClass(this, 'create') ) {
			buoy.addClass(game,'active');
			overlayOn();
			var tlkBtn = document.getElementById('tlkio').appendChild( document.createElement('span') );
			tlkBtn.addEventListener('click', function(e) {
				var tlk = document.getElementById('tlkio');
				if ( buoy.hasClass(tlk,'active') ) {
					buoy.removeClass(tlk,'active')
				} else { buoy.addClass(tlk,'active') }
			});

			// Randomly generate room ID and populate modal with info
			var roomid = Math.random().toString(36).substr(2, 5);
			m.innerHTML += '<h4>Your room id is...</h4>';
			m.innerHTML += '<h2>'+roomid+'</h2>';
			m.innerHTML += '<p>Give this code to your friend to join/watch!</p>';
			m.innerHTML += '<p class="light"><i class="fa fa-spinner"></i> Waiting for someone to join...';
			m.innerHTML += '<button class="cancel">Cancel</button>';

			// Set user as host of the room
			peer = new Peer('dwo'+roomid, {
				key: 'fbpvikd79qpsnhfr', debug:3
			});

			// Upon join
			peer.on('connection', function(c) { 
				conn = c;
				c.on('open', function() {
					// <TOADD: If first person to join (player) or not (watcher)> 
					buoy.removeClass(m.parentNode,'active');
					onMessage(c);
					myTurn = false;
					attacker = false;
					playInit(c,deck,attacker);
					notify('yellow', "Opponent's Turn");
				});
			});

			// Cancel!
			document.querySelector('.overlay .cancel').addEventListener('click', function(e) {
				cancelConn();
			});
		}
		// Join Game
		else if ( buoy.hasClass(this, 'join') && validDeck() ) {
			buoy.addClass(game,'active');
			overlayOn();
			m.innerHTML += '<h4>Enter Room ID to join:</h4>';
			m.innerHTML += '<input type="text">';
			m.innerHTML += '<button class="cancel">Cancel</button>';

			peer = new Peer({
				key: 'fbpvikd79qpsnhfr', debug:3
			});

			// Inputting a number will do the joining
			document.querySelector('.overlay input').addEventListener('keypress', function(e) {
				if (!e) e = window.event;
					var keyCode = e.keyCode || e.which;
					// If pressing enter
					if (keyCode == '13'){
						document.querySelector('.overlay input').setAttribute('disabled','true');
						var room = this.value.replace(/\s+/g, '');
						conn = peer.connect( 'dwo'+room, { reliable: true } );

						conn.on('open', function() {
							buoy.removeClass(m.parentNode,'active');
							onMessage(conn);
							myTurn = true;
							attacker = true;
							playInit(conn,deck,attacker);
							notify('green', 'Your Turn');
						});
					return false;
				}
			});

			// Cancel!
			document.querySelector('.overlay .cancel').addEventListener('click', function(e) {
				cancelConn();
			});
		}
		// Build
		else if ( buoy.hasClass(this, 'build') ) {
			//overlayOn();
		}
	  });
	});

	validDeck = function(deck) {
		// If there are 25 supplies
		// whatever units, co's, combos
		// then you're good to go
		return true;
	}

	onMessage = function(conn) {
		conn.on('data', function(msg) {
			//console.log(msg);
			switch (msg.func) {
				case 'testCard': 
					testCard(msg.card, msg.action, msg.who);
					break;
				case 'odeck':
					opponentDeck = msg.deck; 
					break;
				case 'drawCardConfirmed':
					drawCardConfirmed(msg.card); 
					break;
				case 'playCard':
					playCard(msg.card, msg.who); 
					break;
				case 'yourTurn':
					myTurn = true; 
					notify('green', 'Your Turn');
					document.querySelector('.shuf').removeAttribute('disabled'); 
					document.querySelector('.end').removeAttribute('disabled');
					document.querySelector('.turn').removeAttribute('disabled');
					buoy.removeClass(document.querySelector('.hand'),'disable'); 
					break;
				case 'unitPos':
					placeUnit(msg.pos, msg.card, msg.who, msg.id);
					break;
				case 'comboPos':
					comboCard(msg.pos, msg.card, msg.who);
					break;
				case 'specialCombo':
					specialCombo(msg.card, msg.who);
					break;
				case 'notify':
					notify(msg.type, msg.msg);
					break;
				case 'win' :
					if (attacker === true) win(msg.points); 
					resetField(0,false); 
					break;
			}
		});
	};

	function win(p) { 
		victoryPts += parseInt(p); 
		document.querySelector('.player .outpost').textContent = victoryPts;
	}

	// Prepend function
	Element.prototype.prependChild = function(child) { this.insertBefore(child, this.firstChild); };
});
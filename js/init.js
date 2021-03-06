document.addEventListener('DOMContentLoaded', function(){ 
	var victoryPts = 0;
	var conn;
	var peer;
	var game = document.querySelector('.game');
	var m = document.querySelector('.overlay .modal');

	// Mute Button
	var mute = document.querySelector('.mute');
	mute.addEventListener('click', function(e) {
		if ( buoy.hasClass(mute,'active') ) {
			buoy.removeClass(mute,'active');
			music.play();
		} else { 
			buoy.addClass(mute,'active');
			music.pause();
		}
	});

	// Tlk.io Tab
	var tlkBtn = document.getElementById('tlkio').appendChild( document.createElement('span') );
	tlkBtn.addEventListener('click', function(e) {
		var tlk = document.getElementById('tlkio');
		if ( buoy.hasClass(tlk,'active') ) {
			buoy.removeClass(tlk,'active')
		} else { buoy.addClass(tlk,'active') }
	});

	//------------------------
	//      Builder Code
	//------------------------

	// Builder Buttons
	document.querySelector('.returnToMenu').addEventListener('click', function() {
		buoy.removeClass(document.querySelector('.builder'),'active');

		clearDeck();
		[].forEach.call(document.querySelectorAll('.builder .card'), function(card) {
			card.querySelector('.add').removeEventListener('click', cardCounter);
			card.querySelector('.del').removeEventListener('click', cardDecounter);
		});
	});

	// Deck Saving Listener
	document.querySelector('.saveDeck').addEventListener('click', function() {
		if ( document.querySelector('.loadDeck1.active') ) {
			saveDeck( 'deck' );
		} else if ( document.querySelector('.loadDeck2.active') ) {
			saveDeck( 'deck2' );
		} else if ( document.querySelector('.loadDeck3.active') ) {
			saveDeck( 'deck3' );
		}
	});

	// Deck Loading
	[].forEach.call(document.querySelectorAll('.loadDeck'), function(btn) {
		btn.addEventListener('click', function(e) {
			console.log(e.target);

			buoy.removeClass( document.querySelector('.loadDeck.active'), 'active');
			buoy.addClass(e.target, 'active');

			if ( buoy.hasClass(e.target, 'loadDeck1') ) {
				loadDeck( store.get('deck'), 'deck' );
			} else if ( buoy.hasClass(e.target, 'loadDeck2') ) {
				loadDeck( store.get('deck2'), 'deck2' );
			} else if ( buoy.hasClass(e.target, 'loadDeck3') ) {
				loadDeck( store.get('deck3'), 'deck3' );
			}
		});
	});

	function countShare(target,count,plus) {
		target.parentNode.setAttribute('data-count', count);
		var total = parseInt(target.parentNode.parentNode.querySelector('h3 span').getAttribute('data-total'));
		target.parentNode.parentNode.querySelector('h3 span').setAttribute('data-total', total+plus);
	}

	function cardCounter(e) {
		var target = (e.target) ? e.target : e;

		window.requestAnimationFrame(function() {
			var cat = target.parentNode.parentNode.querySelector('h3 span').getAttribute('class');
			var count = parseInt(target.parentNode.getAttribute('data-count'));

			var total = parseInt(target.parentNode.parentNode.querySelector('h3 span').getAttribute('data-total'));
			
			if (cat === 'u' && total>=20 || cat === 'k' && total>=25 || cat === 'co' && total>=2 || count >=6 ) {
				return false;
			} else {
				if (count===0) buoy.addClass(target.parentNode,'active');
				count += 1;
				countShare(target,count,1);
			}
		});
	}

	function cardDecounter(e) {
		var cat = e.target.parentNode.parentNode.querySelector('h3 span').getAttribute('class');
		var count = parseInt(e.target.parentNode.getAttribute('data-count'));
		if (count === 0) {
			return false;
		} else {
			count += -1;
			if (count===0) buoy.removeClass(e.target.parentNode,'active');
			countShare(e.target,count,-1);
		}
		
	}

	function clearDeck() {
		window.requestAnimationFrame(function() {
			[].forEach.call(document.querySelectorAll('.builder .card'), function(card) {
				card.setAttribute('data-count',0);
				if (buoy.hasClass(card,'active')) buoy.removeClass(card,'active');
				document.querySelector('.u').setAttribute('data-total',0);
				document.querySelector('.k').setAttribute('data-total',0);
				document.querySelector('.co').setAttribute('data-total',0);
			});
		});
	}

	function loadDeck(loadedDeck,slot) {
		if (!loadedDeck) { 
			notify('red', 'No Deck Found Here, Create a new one!');
			clearDeck();
			return false; 
		}

		notify('green', 'Loaded Deck!');
		clearDeck();
		deck = loadedDeck;
		store.set('lastDeck', slot);

		window.requestAnimationFrame( function() {
			for (var i=0;i<loadedDeck.length;i++) {
				if (!loadedDeck[i].supply) {
					cardCounter( document.querySelector('div[data-type="'+loadedDeck[i].type+'"] .add') );
				}
			}
		});
	}

	function saveDeck(deckSlot) {
		if ( document.querySelector('.u').getAttribute('data-total') != '20' || document.querySelector('.k').getAttribute('data-total') != '25' || document.querySelector('.co').getAttribute('data-total') != '2' ) {
			notify('red', 'Deck Incomplete, Not Saved!'); return false;
		}

		newDeck = [];

		// Add 25 supplies 
		for (var i=0;i<25;i++) {
			newDeck.push( {'type': 'supply', 'supply' : 1 } );
		}

		[].forEach.call(document.querySelector('.u').parentNode.parentNode.querySelectorAll('.card'), function(card) {
			if ( parseInt( card.getAttribute('data-count'))>0 ) { 
				for (var i=0;i<parseInt( card.getAttribute('data-count'));i++) {
					newDeck.push( { 'type' : card.getAttribute('data-type'), 'unit' : 1 } );
				}
			}
			
		});

		[].forEach.call(document.querySelector('.k').parentNode.parentNode.querySelectorAll('.card'), function(card) {
			if ( parseInt( card.getAttribute('data-count'))>0 ) { 
				for (var i=0;i<parseInt( card.getAttribute('data-count'));i++) {
					newDeck.push( { 'type' : card.getAttribute('data-type'), 'combo' : 1 } );
				}
			}
		});

		[].forEach.call(document.querySelector('.co').parentNode.parentNode.querySelectorAll('.card'), function(card) {
			if ( parseInt(card.getAttribute('data-count'))>0 ) { 
				for (var i=0;i<parseInt( card.getAttribute('data-count'));i++) {
					newDeck.push( { 'type' : card.getAttribute('data-type'), 'co' : 1 } );
				}
			}
		});

		if (newDeck.length === 72) {
			store.set(deckSlot, newDeck);
			store.set('lastDeck', deckSlot);
			deck = newDeck;
			notify('green', 'Saved! Using new deck');
		} else {
			notify('red', 'Deck Not Saved!');
		}
		
	}


	// Clicking on a homepage button
	[].forEach.call(document.querySelectorAll('.home button'), function(el) {
	  el.addEventListener('click', function() {

		function cancelConn() {
			wipeGame();

			peer.destroy();
			if (buoy.hasClass(m.parentNode,'active')) buoy.removeClass(m.parentNode,'active');
			buoy.removeClass(game,'active');
			m.innerHTML = '';
		}

		// Create Game
		if ( buoy.hasClass(this, 'create') ) {
			buoy.addClass(game,'active');
			overlayOn();

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
					buoy.removeClass(m.parentNode,'active');
					m.innerHTML = '';
					onMessage(c);
					myTurn = false;
					attacker = false;
					playInit(c,deck,attacker,peer);
					notify('yellow', "Opponent's Turn");
					buoy.addClass(document.querySelector('.hand'),'disable');
					// TEMPORARY: Disconnect so no one else can join
					peer.disconnect();
				});

				// On player disconnect
				conn.on('close', function(c) {
					// Notify
					notify('red', 'Player Disconnected');
					// Kill Connection
					cancelConn();
					// Reset Board
					[].forEach.call(document.querySelectorAll('.hand .card'), function(el) {
						el.remove();
					});
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
			m.innerHTML += '<input type="text"><button class="joinGame" style="margin-right:5px">Join</button>';
			m.innerHTML += '<button class="cancel">Cancel</button>';

			peer = new Peer({
				key: 'fbpvikd79qpsnhfr', debug:2
			});

			function joinGame(el) {
				document.querySelector('.overlay input').setAttribute('disabled','true');
				document.querySelector('.joinGame').setAttribute('disabled','true');
				var spinner = document.createElement('i');
				buoy.addClass(spinner,'fa'); buoy.addClass(spinner,'fa-spinner');
				m.appendChild( spinner );
				var room = el.value.replace(/\s+/g, '');
				conn = peer.connect( 'dwo'+room, { reliable: true } );

				conn.on('open', function() {
					buoy.removeClass(m.parentNode,'active');
					onMessage(conn);
					m.innerHTML = '';
					myTurn = true;
					attacker = true;
					buoy.addClass(document.querySelector('.player'),'myturn');
					playInit(conn,deck,attacker,peer);
					notify('green', 'Your Turn');
				});

				// On player disconnect
				conn.on('close', function(c) {
					// Notify
					notify('red', 'Disconnected');
					// Kill Connection
					cancelConn();
					// Reset Board
					[].forEach.call(document.querySelectorAll('.hand .card'), function(el) {
						el.remove();
					});
				});
			}

			// Inputting a number will do the joining
			document.querySelector('.overlay input').addEventListener('keypress', function(e) {
				if (!e) e = window.event;
					var keyCode = e.keyCode || e.which;
					// If pressing enter
					if (keyCode == '13'){ joinGame(this); return false; }
			});

			document.querySelector('button.joinGame').addEventListener('click', function(e) {
				joinGame( document.querySelector('.overlay input') );
			});

			// Cancel!
			document.querySelector('.overlay .cancel').addEventListener('click', function(e) {
				cancelConn();
			});
		}
		// Build
		else if ( buoy.hasClass(this, 'build') ) {
			buoy.addClass(document.querySelector('.builder'),'active');

			[].forEach.call(document.querySelectorAll('.builder .card'), function(card) {
				card.querySelector('.add').addEventListener('click', cardCounter);
				card.querySelector('.del').addEventListener('click', cardDecounter);
			});

			window.setTimeout( function() { 
				if (!document.querySelector('.loadDeck.active')) {
					if (store.get('lastDeck') === 'deck') buoy.addClass( document.querySelector('.loadDeck1'), 'active'); 
					if (store.get('lastDeck') === 'deck2') buoy.addClass( document.querySelector('.loadDeck2'), 'active'); 
					if (store.get('lastDeck') === 'deck3') buoy.addClass( document.querySelector('.loadDeck3'), 'active'); 
				}

				loadDeck( store.get( store.get('lastDeck') ), store.get('lastDeck') ); 
			}, 1200);
		}
		// Tutorial
		else if ( buoy.hasClass(this, 'howto') ) {
			var tut = document.createElement('script');
			tut.src = 'js/tut.js';
			document.head.appendChild(tut);
		}
	  });
	});

	// Quit Button 
	document.querySelector('.game .menu').addEventListener('click', function() {
		if ( buoy.hasClass(document.querySelector('.game'), 'tut') ) {
			wipeGame();
		} else {
			wipeGame();

			peer.destroy();
			if (buoy.hasClass(m.parentNode,'active')) buoy.removeClass(m.parentNode,'active');
			buoy.removeClass(game,'active');
			m.innerHTML = '';
		}
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
					if (msg.time) { testCard(msg.card, msg.action, msg.who, msg.time); }
					else { testCard(msg.card, msg.action, msg.who); }
					break;
				case 'odeck':
					opponentDeck = msg.deck; 
					break;
				case 'drawCardConfirmed':
					drawCardConfirmed(msg.card, msg.time); 
					break;
				case 'playCard':
					playCard(msg.card, msg.who); 
					break;
				case 'yourTurn':
					var v = (msg['var'] === false) ? msg['var'] : true;
					myTurn = true; 
					forceEnd = false;
					buoy.addClass(document.querySelector('.player'),'myturn');

					// Add to history
					addHistory('endt','opponent');

					// Expansion Check
					if (document.querySelectorAll('.opponent .formation .unit').length === 4 && attacker === false && expanded === 0) {
						notify('yellow', 'Attacker has expanded field! You can retreat all units & give up 1 point, or risk playing for 2.',true);
						expanded = 1;
						expandChoice(v);
					} else if (document.querySelectorAll('.opponent .formation .unit').length === 5 && attacker === false && expanded === 1) {
						notify('yellow', 'Attacker has expanded field! You can retreat all units & give up 2 points, or risk playing for 3.',true);
						expanded = 2;
						expandChoice(v);
					} else {
						notify('green', 'Your Turn');
						document.querySelector('.end').removeAttribute('disabled');
						buoy.removeClass(document.querySelector('.hand'),'disable'); 
						swapThree(v);
					}

					// Check slot limits
					if (document.querySelectorAll('.player .formation .unit').length > 4) {
						buoy.addClass(document.querySelector('.hand'),'noUnit');
					} else { buoy.removeClass(document.querySelector('.hand'),'noUnit'); }
					
					break;
				case 'unitPos':
					placeUnit(msg.pos, msg.card, msg.who, msg.id);
					break;
				case 'comboPos':
					comboCard(msg.pos, msg.card, msg.who);
					break;
				case 'specialCombo':
					var v = (msg['var']) ? msg['var'] : 0;
					specialCombo(msg.card, msg.who, v);
					break;
				case 'notify':
					var v = (msg['var']) ? msg['var'] : false;
					notify(msg.type, msg.msg, v);
					break;
				case 'log':
					var v = (msg['var']) ? msg['var'] : false;
					addHistory(msg.type,msg.who,v);
					break;
				case 'win' :
					var a = parseInt(document.querySelector('.player .atk').textContent);
					var d = parseInt(document.querySelector('.opponent .def').textContent);
					if (attacker || (!attacker && a > d) ) win(msg.points,a,d,attacker);
					resetField(0,false); 
					break;
				case 'endgame' :
					endGame(msg.who);
					break;
			}
		});
	};

	function win(p,a,d,atkr) { 
		victoryPts += parseInt(p); 
		document.querySelector('.player .outpost').textContent = victoryPts;
		// Add to history
		addHistory('endr','player','Won Round');
		if (!atkr && a > d) { addHistory('counter','player'); }
	}

	function expandChoice(v) {
		function clearBtn() {
			buoy.addClass( document.querySelector('.sticky'), 'un');
			window.setTimeout( function() { document.querySelector('.un.sticky').remove(); }, 500);
			retreat.removeEventListener('click', retreatListen);
			contin.removeEventListener('click', conListen);
			document.querySelector('.xopt').remove();
			document.querySelector('.xopt').remove();
			buoy.removeClass(document.querySelector('.hand'),'noBtn');
		}

		// Continue
		buoy.addClass(document.querySelector('.hand'),'noBtn');
		var contin = document.querySelector('.hand').appendChild( document.createElement('button') );
		buoy.addClass(contin,'xopt'); buoy.addClass(contin,'continue');
		contin.textContent = "Continue";

		function conListen() {
			clearBtn();
			notify('green', 'Your Turn');
			document.querySelector('.end').removeAttribute('disabled');
			buoy.removeClass(document.querySelector('.hand'),'disable'); 
			swapThree(v);
		}

		contin.addEventListener('click', conListen);

		// Retreat
		var retreat = document.querySelector('.hand').appendChild( document.createElement('button') );
		buoy.addClass(retreat,'xopt'); buoy.addClass(retreat,'retreat');
		retreat.textContent = "Retreat";

		function retreatListen() {
			clearBtn();
			// Only possible to end round on your turn
			if (myTurn) {
				var points = 0;
				var his = document.querySelectorAll('.opponent .formation .unit').length;

				if (his<=4) {
					points = 1;
				} else { points = 2; }

				// Discard units (& combos)
				resetField(points,true,true);
			}
		}

		retreat.addEventListener('click', retreatListen);
	}

	// Prepend function
	Element.prototype.prependChild = function(child) { this.insertBefore(child, this.firstChild); };
});
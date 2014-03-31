var conn;
var opponentDeck;
var playerDeck;
var myTurn;

// Define all the cards
var cardType = {
	'unit' : {
		'infantry' : { 'atk': 1, 'def': 1, 'sup': 0, 'trait' : ['grd', 'inf'] },
		'recon' : { 'atk': 1, 'def': 2, 'sup': 1, 'trait' : ['grd', 'arm'] },
		'apc' : { 'atk': 1, 'def': 2, 'sup': -1, 'trait' : ['grd', 'arm'] },
		'aa' : { 'atk': 1, 'def': 2, 'sup': 1, 'trait' : ['grd', 'arm', 'aa'] },
		'tank' : { 'atk': 2, 'def': 2, 'sup': 2, 'trait' : ['grd', 'arm'] },
		'htank' : { 'atk': 4, 'def': 5, 'sup': 5, 'trait' : ['grd', 'arm'] },
		'arty' : { 'atk': 3, 'def': 1, 'sup': 3, 'trait' : ['grd', 'arm', 'lr'] },
		'harty' : { 'atk': 5, 'def': 3, 'sup': 5, 'trait' : ['grd', 'arm', 'lr'] },
		'drone' : { 'atk': 1, 'def': 1, 'sup': 1, 'trait' : ['air', 'aa', 'as', 'inf'] },
		'helo' : { 'atk': 2, 'def': 2, 'sup': 2, 'trait' : ['air', 'aa'] },
		'a2g' : { 'atk': 2, 'def': 4, 'sup': 3, 'trait' : ['air', 'as'] },
		'jet' : { 'atk': 0, 'def': 4, 'sup': 3, 'trait' : ['air', 'aa'] },
		'bomber' : { 'atk': 0, 'def': 3, 'sup': 4, 'trait' : ['air', 'as'] },
		'hbomber' : { 'atk': 1, 'def': 4, 'sup': 5, 'trait' : ['air', 'as'] }
	},
	'co' : {
		'urban' : 0,
		'tundra' : 0,
		'cloudy' : 0,
		'desert' : 0,
		'forest' : 0
	},		
	'combo' : {
		'at' : { 'atk' : 3, 'sup' : 1, 'canuse' : ['inf'] },
		'sniper' : { 'canuse' : ['inf'] },
		'medic' : { 'def' : 1, 'sup' : 0, 'canuse' : ['inf'] },
		'reactive' : { 'def' : 2, 'sup' : 1, 'canuse' : ['arm']},
		'aa' : { 'vs' : 'aa', 'atk' : 3, 'sup' : 1, 'canuse' : ['inf']  },
		'support' : { 'sup' : -2, 'canuse' : ['inf'] },
		'retreat' : { },
		'shift' : { },
		'reinforce' : { },
		'frontline' : { 'atk' : 2, 'def' : -1, 'sup' : 0, 'canuse' : ['grd','grd'] },
		'intel' : { 'sup': 3, 'canuse' : ['inf','air'] },
		'fallback' : { 'def' : 2, 'atk' : -1, 'sup' : 0, 'canuse' : ['grd','grd'] }
	},
	'supply' : 3
}

var properCards;

// Starts off the game and all the other functions
function playInit(connection, deck) {
	conn = connection;

	properCards = md5(cardType);

	var hashedDeck = {};
	deck = [
		{'type': 'infantry', 'id' : 0, 'hash' : 0}, 
		{'type': 'tank', 'id' : 0, 'hash' : 0}, 
		{'type': 'apc', 'id' : 0, 'hash' : 0},
		{'type': 'infantry', 'id' : 0, 'hash' : 0}, 
		{'type': 'tank', 'id' : 0, 'hash' : 0}, 
		{'type': 'tank', 'id' : 0, 'hash' : 0},
		{'type': 'infantry', 'id' : 0, 'hash' : 0}, 
		{'type': 'infantry', 'id' : 0, 'hash' : 0}, 
		{'type': 'apc', 'id' : 0, 'hash' : 0},
		{'type': 'at', 'id' : 0, 'hash' : 0},
		{'type': 'at', 'id' : 0, 'hash' : 0},
		{'type': 'at', 'id' : 0, 'hash' : 0},
		{'type': 'at', 'id' : 0, 'hash' : 0},
		{'type': 'at', 'id' : 0, 'hash' : 0},
		{'type': 'at', 'id' : 0, 'hash' : 0},
		{'type': 'at', 'id' : 0, 'hash' : 0},
		{'type': 'supply', 'id' : 0, 'hash' : 0}, 
		{'type': 'supply', 'id' : 0, 'hash' : 0}, 
		{'type': 'supply', 'id' : 0, 'hash' : 0},
		{'type': 'supply', 'id' : 0, 'hash' : 0}, 
		{'type': 'supply', 'id' : 0, 'hash' : 0}, 
		{'type': 'supply', 'id' : 0, 'hash' : 0}
	];

	playerDeck = shuffle(deck);

	// Go through deck, hash, send
	var count = 8;
	for (var i=0;i<playerDeck.length;i++) {

		// ID the cards
		var salt = Math.random().toString(36).substr(2, 9);
		playerDeck[i].id = playerDeck[i].type+'_'+salt;

		// Hash em
		var hash = md5(playerDeck[i].id);
		playerDeck[i].hash = hash;

		// Add hashed card to array
		hashedDeck[hash] = 1;

		// Once done hashing deck, send to opponent
		if (i===playerDeck.length-1) {
			console.log('Sending hashed deck')
			conn.send( { 'func':'odeck', 'deck': hashedDeck } );
			drawCard(playerDeck,count);
		}
	}

	// UI Stuff

	// End Turn
	var endTurn = document.querySelector('.hand').appendChild( document.createElement('button') )
	endTurn.innerHTML = "End Turn";
	endTurn.addEventListener('click', function() {
		if (myTurn = true){
			if (document.querySelectorAll('.card').length<8) {
				drawCard(playerDeck,8-document.querySelectorAll('.card').length);
			} else { drawCard(playerDeck,1); }

			conn.send( { 'func':'yourTurn' } );
			myTurn = false;
		}
	});

	// Shuffle array (deck)
	function shuffle(array) {
		var currentIndex = array.length
		, temporaryValue
		, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}
}

// Play a card
function playCard(card,who) {
	var cardEl = document.getElementById(card.id);

	//var salt = card.getAttribute('id');
	//var type = card.getAttribute('data-type');

	// Remove card from hand
	if (who === 'player') cardEl.remove();

	if ( properCards === md5(cardType) ) {
		// Add card to field if a unit
		if (cardType.unit[card.type] && document.querySelectorAll('.'+who+' .unit').length < 5) {
			var newUnit;
			// If only one unit, place in center of formation
			if (document.querySelectorAll('.'+who+' .unit').length === 0) {
				newUnit = document.querySelector('.'+who+' li:nth-child(3)').appendChild( document.createElement('div') );
				unitCard(newUnit,card,who,card.id);
			} 
			// If more than one unit, choose position
			else {
				//disableCards(); - TODO

				// only choose if actually the player
				if (who === 'player'){
					// Get first and last positioned units
					var firstUnit = document.querySelectorAll('.'+who+' .unit')[0];
					var lastUnit = document.querySelectorAll('.'+who+' .unit')[document.querySelectorAll('.'+who+' .unit').length-1];
					var addPrev;
					var addNext;

					// If they exist or whatevs then add button
					if (firstUnit.parentNode.previousElementSibling) {
						addPrev = firstUnit.parentNode.previousElementSibling.appendChild( document.createElement('button') );
						buoy.addClass(addPrev, 'prev');
						buoy.addClass(firstUnit.parentNode, 'active');
					}
					if (lastUnit.parentNode.nextElementSibling) {
						addNext = lastUnit.parentNode.nextElementSibling.appendChild( document.createElement('button') );
						buoy.addClass(addNext, 'next');
						buoy.addClass(lastUnit.parentNode, 'active');
					}
					
					// Add listener for each button
					[].forEach.call(document.querySelectorAll('.player li button'), function(el) {
		  				el.addEventListener('click', function() {
		  					// If the slot is empty
		  					if (el.children.length === 0) {
		  						buoy.removeClass(firstUnit.parentNode, 'active');
		  						buoy.removeClass(lastUnit.parentNode, 'active');

		  						// Add unit to correct slot
		  						newUnit = el.parentNode.appendChild( document.createElement('div') );
		  						//if (buoy.hasClass(el,'next')) newUnit = el.parentNode.nextElementSibling.appendChild( document.createElement('div') );
								unitCard(newUnit,card,who);

								if (buoy.hasClass(el,'prev')) conn.send( { 'func':'unitPos', 'pos' : 'prev', 'card' : card, 'who' : 'opponent' } );
								if (buoy.hasClass(el,'next')) conn.send( { 'func':'unitPos', 'pos' : 'next', 'card' : card, 'who' : 'opponent' } );

								// Cleanup
								addPrev.parentNode.removeChild(addPrev);
		  						addNext.parentNode.removeChild(addNext);
		  						addPrev = null;
		  						addNext = null;

		  						// Smart shift
		  						smartShift(who);
		  					}
		  				});
		  			});
				} 
				// Otherwise, place according to the player's choice
				else {
					// Nothing? Opponent sends position
				}
			}
			
		} 
		// Add commander to field
		else if (cardType.co[card.type]) {
			// Whatevs
		}
		// Add combo to unit
		else if (cardType.combo[card.type]) {
			// Only do choosing if player
			if (who === 'player') {
				// First check if combo can be played anywhere
				[].forEach.call(document.querySelectorAll('.'+who+' .unit'), function(el) {
					// Get each unit's traits
					var traits = cardType.unit[el.getAttribute('data-type')].trait;

					// For every trait
					var comboMatch;
					for (var i=0;i<traits.length;i++) {
						console.log('Checking if '+traits[i]+' is part of '+cardType.combo[card.type].canuse);

						// Check if unit trait matches what combo needs
						if (cardType.combo[card.type].canuse.indexOf( traits[i] ) != -1) {
							console.log('MATCH')
							comboMatch = true;
							break;
						} else if (i===traits.length) { console.log('NO MATCH'); comboMatch = false; }
					}

					if (comboMatch) {
						// Probably want to check for double/triple combo in future - TODO

						// Make unit slot combo-attachable
						buoy.addClass(el.parentNode,'active');
						el.parentNode.addEventListener('click', function() {
							if (buoy.hasClass(el.parentNode,'active')) {
								// Attach combo to unit
								console.log(el.getAttribute('id'));
								comboCard(el.getAttribute('id'),card,who);
								conn.send( { 'func':'comboPos', 'pos' : el.getAttribute('id'), 'card' : card, 'who' : 'opponent' } );

								[].forEach.call(document.querySelectorAll('.'+who+' li.active'), function(el) {
									buoy.removeClass(el,'active');
								});
							}
						});
					}
				});
			}
		} else {
			// If supplies, then just add to current supply count
			currentSup = parseInt(document.querySelector('.'+who+' .sup').textContent);
			document.querySelector('.'+who+' .sup').innerHTML = currentSup+3;
			if (who === 'player') drawCard(playerDeck,1);
		}
	}

	console.log('Card played');
}

// =================================
// -------- CARD FUNCTIONS ---------
// =================================

function testCard(card,action) {
	// Test a card against the hashed deck list
	// Return true if it exists
	if (opponentDeck[card.hash]) {
		if (action === 'draw') {
			conn.send({ 
				'func': 'drawCardConfirmed', 
				'card' : card,
				'who' : 'origin'
			});
		}
		else if (action === 'play') {
			conn.send({ 
				'func': 'playCard', 
				'card' : card,
				'who' : 'player'
			});

			playCard(card,'opponent');
		}
	}
}

// Draw a card 
function drawCard(deck,n,origin) {
	//console.log('Drawing from: ',deck)

	n = typeof n !== 'undefined' ? n : 1;

	// Add to UI
	for (var i=0;i<n;i++) {

		// Play card from our deck
		var wannaplay = deck.pop();

		// Check against opponent to make sure it's legit
		if (origin != 'origin') {
			conn.send({ 
				'func'  : 'testCard', 
				'card'  : wannaplay,
				'who'   : 'origin',
				'action': 'draw'
			});
		}
	}
}

// Actually draw a real card
function drawCardConfirmed(card) {

	// DOM Stuff
	var newcard = document.querySelector('.hand').appendChild( document.createElement('div') )
	newcard.classList.add('card');
	newcard.setAttribute('id', card.id);
	newcard.setAttribute('data-type',card.type);

	newcard.addEventListener('click', function() {
		//console.log('Testing Card ',card);

		function canAfford(card) {
			console.log(card);

			var totalSup = parseInt(document.querySelector('.player .sup').textContent);
			var currentSup = 0;
			var neededSup;

			if (cardType.unit[card.getAttribute('data-type')]) {
				neededSup = cardType.unit[card.getAttribute('data-type')].sup;
			} else if (cardType.combo[card.getAttribute('data-type')]) {
				neededSup = cardType.combo[card.getAttribute('data-type')].sup;
			} else { neededSup = 0 }

			[].forEach.call(document.querySelectorAll('.player .unit'), function(el) {
				currentSup += parseInt(el.getAttribute('data-sup'));
			});

			console.log(neededSup, currentSup, totalSup);

			if (neededSup + currentSup <= totalSup) {
				return true;
			} else { return false; }
		}

		if (myTurn && canAfford(this) ) {
			conn.send({ 
				'func'  : 'testCard', 
				'card'  : card,
				'who'   : 'origin',
				'action': 'play'
			});
		}
	});
}

// Discard a card
function discardCard() {

}

// Zoom on card
function zoomCard() {

}

function unitCard(newUnit,card,who,id) {
	// Add unit class and type
	buoy.addClass(newUnit,'unit');
	newUnit.setAttribute('id', id);
	newUnit.setAttribute('data-type', card.type);
	// Set attack
	newUnit.setAttribute('data-atk', cardType.unit[card.type].atk );
	currentAtk = parseInt(document.querySelector('.'+who+' .atk').textContent);
	document.querySelector('.'+who+' .atk').innerHTML = currentAtk+parseInt(newUnit.getAttribute('data-atk'));
	// Set defense
	newUnit.setAttribute('data-def', cardType.unit[card.type].def );
	currentDef = parseInt(document.querySelector('.'+who+' .def').textContent);
	document.querySelector('.'+who+' .def').innerHTML = currentDef+parseInt(newUnit.getAttribute('data-def'));
	// Set supply cost
	newUnit.setAttribute('data-sup', cardType.unit[card.type].sup );
}

function comboCard(unit,card,who) {
	var slot = document.getElementById(unit).parentNode;
	buoy.addClass(slot,'combo');

	if (cardType.combo[card.type].atk) {
		currentAtk = parseInt(document.querySelector('.'+who+' .atk').textContent);
		slot.setAttribute('data-atk', cardType.combo[card.type].atk );
		buoy.addClass(slot,'atk');
		document.querySelector('.'+who+' .atk').innerHTML = currentAtk+parseInt(cardType.combo[card.type].atk);
	}

	if (cardType.combo[card.type].def) {
		currentDef = parseInt(document.querySelector('.'+who+' .def').textContent);
		slot.setAttribute('data-def', cardType.combo[card.type].def );
		buoy.addClass(slot,'def');
		document.querySelector('.'+who+' .def').innerHTML = currentDef+parseInt(cardType.combo[card.type].def);
	}
}

// =================================
// --------- UI FUNCTIONS ----------
// =================================

function placeUnit(pos, card, who) {
	var newUnit;

	if (pos === 'prev') {
		var firstUnit = document.querySelectorAll('.opponent .unit')[0];
		newUnit = firstUnit.parentNode.previousElementSibling.appendChild( document.createElement('div') );
	} else {
		var lastUnit = document.querySelectorAll('.opponent .unit')[document.querySelectorAll('.opponent .unit').length-1];
		newUnit = lastUnit.parentNode.nextElementSibling.appendChild( document.createElement('div') );
	}
	
	unitCard(newUnit, card, who);
	smartShift('opponent');
}

function placeCombo(pos, card, who) {
	var unit = document.getElementById(pos);	
	comboCard(unit, card, who);
}

function smartShift(who) {
	if (document.querySelectorAll('.'+who+' .unit').length === 3) {
		// Unit was added on the top side, bring bottom, empty li to top to center formation
		if ( document.querySelector('.'+who+' li:first-child').children.length != 0 ) {
			var lastLi = document.querySelector('.'+who+' li:last-child');
			document.querySelector('.'+who+' ul').prependChild(lastLi);
		} 
		// or do the opposite for bottom
		if ( document.querySelector('.'+who+' li:last-child').children.length != 0 ) {
			var firstLi = document.querySelector('.'+who+' li:first-child');
			document.querySelector('.'+who+' ul').appendChild(firstLi);
		}
	} else if (document.querySelectorAll('.'+who+' .unit').length === 4) {
		if ( document.querySelector('.'+who+' li:first-child').children.length != 0 ) {
			document.querySelector('.'+who+' ul').prependChild( document.createElement('li') );
		}
		if ( document.querySelector('.'+who+' li:last-child').children.length != 0 ) {
			document.querySelector('.'+who+' ul').appendChild( document.createElement('li') );
		}
	} else if (document.querySelectorAll('.'+who+' .unit').length === 5) {
		var emptyLi = document.querySelector('.'+who+' li:empty');
		emptyLi.parentNode.removeChild(emptyLi);
	}

}
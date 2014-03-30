var conn;
var opponentDeck;
var playerDeck;
var myTurn;

// Define all the cards
var cardType = {
	'unit' : {
		'infantry' : { 'atk': 1, 'def': 1, 'sup': 0 },
		'recon' : { 'atk': 1, 'def': 2, 'sup': 1 },
		'apc' : { 'atk': 1, 'def': 2, 'sup': 1 },
		'aa' : { 'atk': 1, 'def': 2, 'sup': 1 },
		'tank' : { 'atk': 2, 'def': 2, 'sup': 2 },
		'htank' : { 'atk': 4, 'def': 5, 'sup': 5 },
		'arty' : { 'atk': 3, 'def': 1, 'sup': 3 },
		'harty' : { 'atk': 5, 'def': 3, 'sup': 5 },
		'drone' : { 'atk': 1, 'def': 1, 'sup': 1 },
		'helo' : { 'atk': 2, 'def': 2, 'sup': 2 },
		'a2g' : { 'atk': 2, 'def': 4, 'sup': 3 },
		'jet' : { 'atk': 0, 'def': 4, 'sup': 3 },
		'bomber' : { 'atk': 0, 'def': 3, 'sup': 4 },
		'hbomber' : { 'atk': 1, 'def': 4, 'sup': 5 }
	},
	'co' : {
		'urban' : 0,
		'tundra' : 0,
		'cloudy' : 0,
		'desert' : 0,
		'forest' : 0
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
		{'type': 'recon', 'id' : 0, 'hash' : 0}, 
		{'type': 'apc', 'id' : 0, 'hash' : 0},
		{'type': 'infantry', 'id' : 0, 'hash' : 0}, 
		{'type': 'recon', 'id' : 0, 'hash' : 0}, 
		{'type': 'apc', 'id' : 0, 'hash' : 0},
		{'type': 'infantry', 'id' : 0, 'hash' : 0}, 
		{'type': 'recon', 'id' : 0, 'hash' : 0}, 
		{'type': 'apc', 'id' : 0, 'hash' : 0},
		{'type': 'infantry', 'id' : 0, 'hash' : 0}, 
		{'type': 'recon', 'id' : 0, 'hash' : 0}, 
		{'type': 'apc', 'id' : 0, 'hash' : 0},
		{'type': 'infantry', 'id' : 0, 'hash' : 0}, 
		{'type': 'recon', 'id' : 0, 'hash' : 0}, 
		{'type': 'apc', 'id' : 0, 'hash' : 0},
		{'type': 'supply', 'id' : 0, 'hash' : 0}, 
		{'type': 'supply', 'id' : 0, 'hash' : 0}, 
		{'type': 'supply', 'id' : 0, 'hash' : 0},
		{'type': 'supply', 'id' : 0, 'hash' : 0}, 
		{'type': 'supply', 'id' : 0, 'hash' : 0}, 
		{'type': 'supply', 'id' : 0, 'hash' : 0},
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
		if (cardType.unit[card.type]) {
			var newUnit;
			// If only one unit, place in center of formation
			if (document.querySelectorAll('.'+who+' .unit').length === 0) {
				newUnit = document.querySelector('.'+who+' li:nth-child(3)').appendChild( document.createElement('div') );
				unitCard(newUnit,card,who);
			} 
			// If more than one unit, choose position
			else {
				//disableCards();
				// only choose if actually the player
				if (who === 'player'){
					var firstUnit = document.querySelectorAll('.'+who+' .unit')[0];
					var lastUnit = document.querySelectorAll('.'+who+' .unit')[document.querySelectorAll('.'+who+' .unit').length-1];

					if (firstUnit.parentNode.previousElementSibling) {
						buoy.addClass(firstUnit.parentNode.previousElementSibling, 'add');
						buoy.addClass(firstUnit.parentNode.previousElementSibling, 'prev');
					}
					if (lastUnit.parentNode.nextElementSibling) {
						buoy.addClass(lastUnit.parentNode.nextElementSibling, 'add');
						buoy.addClass(lastUnit.parentNode.nextElementSibling, 'next');
					}
					
					[].forEach.call(document.querySelectorAll('li.add'), function(el) {
		  				el.addEventListener('click', function() {
		  					if (buoy.hasClass(el,'add') && el.children.length === 0) {
		  						if (firstUnit.parentNode.previousElementSibling) buoy.removeClass(firstUnit.parentNode.previousElementSibling, 'add');
								if (lastUnit.parentNode.nextElementSibling) buoy.removeClass(lastUnit.parentNode.nextElementSibling, 'add');

		  						newUnit = el.appendChild( document.createElement('div') );
								unitCard(newUnit,card,who);

								if (buoy.hasClass(el,'prev')) conn.send( { 'func':'unitPos', 'pos' : 'prev', 'card' : card, 'who' : who } );
								if (buoy.hasClass(el,'next')) conn.send( { 'func':'unitPos', 'pos' : 'next', 'card' : card, 'who' : who } );

								if (firstUnit.parentNode.previousElementSibling) buoy.removeClass(firstUnit.parentNode.previousElementSibling, 'prev');
								if (lastUnit.parentNode.nextElementSibling) buoy.removeClass(lastUnit.parentNode.nextElementSibling, 'next');
		  					}
		  				});
		  			});
				} 
				// Otherwise, place according to the player's choice
				else {
					// Nothing? Opponent sends position
				}
			}
			
		} else if (cardType.co[card.type]) {
			// Whatevs
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

function unitCard(newUnit,card,who) {
	// Add unit class and type
	buoy.addClass(newUnit,'unit');
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
}
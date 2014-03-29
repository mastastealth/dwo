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
	var endTurn = document.querySelector('.hand').appendChild( document.createElement('button') )
	endTurn.innerHTML = "End Turn";
	endTurn.addEventListener('click', function() {
		if (myTurn = true){
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
		// Add card to field
		if (cardType.unit[card.type]) {
			var newUnit = document.querySelector('.'+who).appendChild( document.createElement('div') );
			buoy.addClass(newUnit,'unit');
			newUnit.data('type',card.type);

			function unitSprite() {
				// Change image based off card.type
			}
		} else if (cardType.co[card.type]) {
			// Whatevs
		} else {
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
		if (myTurn) {
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
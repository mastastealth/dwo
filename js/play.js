var conn;
var opponentDeck;

// Starts off the game and all the other functions
function playInit(connection, deck) {
	conn = connection;

	// Define all the cards
	var card = {
		'infantry' : 0,
		'recon' : 0,
		'apc' : 0,
		'aa' : 0,
		'tank' : 0,
		'htank' : 0,
		'arty' : 0,
		'harty' : 0,
		'drone' : 0,
		'helo' : 0,
		'a2g' : 0,
		'jet' : 0,
		'bomber' : 0,
		'hbomber' : 0,
		'urban' : 0,
		'tundra' : 0,
		'cloudy' : 0,
		'desert' : 0,
		'forest' : 0,
		'supply' : 0
	}

	var hashedDeck = {};
	var deck = [
		{'type': 'infantry', 'id' : 0, 'hash' : 0}, 
		{'type': 'recon', 'id' : 0, 'hash' : 0}, 
		{'type': 'apc', 'id' : 0, 'hash' : 0}
	];

	deck = shuffle(deck);

	// Go through deck, hash, send
	for (var i=0;i<deck.length;i++) {

		// ID the cards
		var salt = Math.random().toString(36).substr(2, 9);
		deck[i].id = deck[i].type+'_'+salt;

		// Hash em
		var hash = md5(deck[i].id);
		deck[i].hash = hash;

		// Add hashed card to array
		hashedDeck[hash] = 1;

		// Once done hashing deck, send to opponent
		if (i===deck.length-1) {
			console.log('Sending hashed deck')
			conn.send( { 'func':'odeck', 'deck': hashedDeck } );
			drawCard(deck,3);
		}
	}

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
function playCard(c) {
	var salt = card.getAttribute('id');
	var type = card.getAttribute('data-type');
	console.log('Card played');
}

function testCard(card) {
	// Test a card against the hashed deck list
	// Return true if it exists
	if (opponentDeck[card.hash]) console.log('Drew: '+card.id);
}

// Draw a card 
function drawCard(deck,n,origin) {
	console.log('Drawing from: ',deck)

	n = typeof n !== 'undefined' ? n : 1;

	// Add to UI
	for (var i=0;i<n;i++) {
		// Play card from our deck
		var wannaplay = deck.pop();
		console.log('Want to play: ',wannaplay);

		// Check against opponent to make sure it's legit
		if (origin != 'origin') {
			conn.send({ 
				'func': 'testCard', 
				'card' : wannaplay,
				'who' : 'origin'
			});
		}
	}
}

// Actually draw a real card
function drawCardConfirmed(card) {
	// DOM Stuff
	var card = document.querySelector('.hand').appendChild( document.createElement('div') )
	card.classList.add('card');
	card.setAttribute('id', salt);
	card.setAttribute('data-type',type);
	card.addEventListener('click', function() {
		playCard(card);
	});
}

// Discard a card
function discardCard() {

}

// Zoom on card
function zoomCard() {

}
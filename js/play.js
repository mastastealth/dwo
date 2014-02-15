// Starts off the game and all the other functions
function playInit(conn, deck) {
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

	var hasheddeck = {};
	var odeck = '';
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
		deck[i].id += '_'+salt;
		// Hash em
		var hash = md5(deck[i]);
		deck[i].hash = hash;

		// Send hash to opponent
		hasheddeck[hash] = 1;

		// Once done with deck, send fully hashed deck
		if (i===deck.length-1) {
			console.log('Sending hashed deck')
			conn.send( ['odeck', hasheddeck] );
			drawCard(3);
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

	// Play a card
	function playCard(c) {
		var salt = card.getAttribute('id');
		var type = card.getAttribute('data-type');
		console.log('Card played');
	}

	function testCard(card) {
		// Test a card against the hashed deck list
		// Return true if it exists
	}

	// Draw a card 
	function drawCard(n) {
		n = typeof n !== 'undefined' ? n : 1;

		// Add to UI
		for (var i=0;i<n;i++) {
			// Play card from our deck
			var wannaplay = deck.pop();
			// Check against opponent to make sure it's legit
			conn.send( ['testCard', wannaplay] );
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
}
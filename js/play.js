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

	var hasheddeck = [];
	var deck = ['infantry', 'recon', 'apc'];
	deck = shuffle(deck);

	for (var i=0;i<deck.length;i++) {
		deck[i] += '_'+Math.random().toString(36).substr(2, 9);
		hasheddeck.push( md5(deck[i]) );

		if (i===deck.length-1) {
			console.log('Sending hashed deck')
			conn.send( hasheddeck );
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
	function playCard() {
		alert('card played');
	}

	// Draw a card 
	function drawCard() {

	}

	// Discard a card
	function discardCard() {

	}

	// Zoom on card
	function zoomCard() {

	}
}
var conn;
var opponentDeck;
var playerDeck;
var myTurn;
var attacker;

// Define all the cards
var cardType = {
	'unit' : {
		'infantry' : { 'atk': 1, 'def': 1, 'sup': 0, 'trait' : ['grd', 'inf'] },
		'recon' : { 'atk': 1, 'def': 2, 'sup': 1, 'bonus' : [2,'inf'], 'trait' : ['grd', 'arm'] },
		'apc' : { 'atk': 1, 'def': 2, 'sup': -1, 'bonus' : [1,'inf'], 'trait' : ['grd', 'arm'] },
		'aa' : { 'atk': 1, 'def': 2, 'sup': 1, 'bonus' : [2,'air'], 'trait' : ['grd', 'arm', 'aa'] },
		'tank' : { 'atk': 2, 'def': 2, 'sup': 2, 'trait' : ['grd', 'arm'] },
		'htank' : { 'atk': 4, 'def': 5, 'sup': 5, 'trait' : ['grd', 'arm'] },
		'arty' : { 'atk': 3, 'def': 1, 'sup': 3, 'trait' : ['grd', 'arm', 'lr'] },
		'harty' : { 'atk': 5, 'def': 3, 'sup': 5, 'trait' : ['grd', 'arm', 'lr'] },
		'drone' : { 'atk': 1, 'def': 1, 'sup': 1, 'trait' : ['air', 'aa', 'as', 'inf'] },
		'helo' : { 'atk': 2, 'def': 2, 'sup': 2, 'trait' : ['air', 'aa'] },
		'a2g' : { 'atk': 2, 'def': 4, 'sup': 3, 'bonus' : [2,'grd'], 'trait' : ['air', 'as'] },
		'jet' : { 'atk': 0, 'def': 4, 'sup': 3, 'bonus' : [4,'air'], 'trait' : ['air', 'aa'] },
		'bomber' : { 'atk': 0, 'def': 3, 'sup': 4, 'bonus' : [4,'grd'], 'trait' : ['air', 'as'] },
		'hbomber' : { 'atk': 1, 'def': 4, 'sup': 5, 'bonus' : [4,'grd'], 'trait' : ['air', 'as'] }
	},
	'co' : {
		'saptiva' : { 'bonus' : [1,'inf','atk'], 'bonus2' : [1,'inf','def']},
		'advocate' : { 'bonus' : [2,'any','def'], 'bonus2' : [-1,'any','sup']},
		'poppy' : { 'bonus' : [1,'air','def'] },
		'mo' : { 'bonus' : [1,'grd','def'] },
		'oz' : { 'bonus' : [1,'arm','atk'] }
	},		
	'combo' : {
		'at' : { 'atk' : 2, 'sup' : 1, 'canuse' : ['inf'] },
		'sniper' : { 'special' : true, 'canuse' : ['inf'] },
		'medic' : { 'def' : 1, 'sup' : 0, 'canuse' : ['inf'] },
		'reactive' : { 'def' : 2, 'sup' : 1, 'canuse' : ['arm']},
		'aa' : { 'vs' : 'aa', 'atk' : 3, 'sup' : 1, 'canuse' : ['inf']  },
		'support' : { 'special' : true, 'sup' : 0, 'canuse' : ['inf'] },
		'retreat' : { 'special' : true, 'any' : true, 'sup' : 0 },
		'shift' : { 'special' : true, 'any' : true, 'sup' : 0 },
		'reinforce' : { 'special' : true, 'any' : true, 'sup' : 0 },
		'frontline' : { 'atk' : 2, 'def' : -1, 'sup' : 0, 'canuse' : ['grd','grd'] },
		'intel' : { 'sup': 3, 'canuse' : ['inf','air'], 'special' : true },
		'fallback' : { 'def' : 2, 'atk' : -1, 'sup' : 0, 'canuse' : ['grd','grd'] },
		'cstrike' : { 'def' : 0, 'atk' : 3, 'sup' : 1, 'canuse' : ['grd','air'] },
		'shell' : { 'def' : 0, 'atk' : 2, 'sup' : 1, 'canuse' : ['arm','arm'] },
		'coverage' : { 'def' : 3, 'atk' : 0, 'sup' : 1, 'canuse' : ['grd','air'] },
		'wingman' : { 'def' : 2, 'atk' : 0, 'sup' : 0, 'canuse' : ['air','air'] },
		'stealth' : { 'special' : true, 'sup' : 1, 'canuse' : ['inf','lr'] },
		'barrier' : { 'special' : true, 'sup' : 0, 'canuse' : ['arm','inf','arm'] },
		'squad' : { 'atk' : 3, 'def' : 0, 'sup' : 0, 'canuse' : ['inf','inf','inf']},
		'patrol' : { 'atk' : 0, 'def' : 4, 'sup' : 2, 'canuse' : ['grd','air','grd']},
		'acover' : { 'special' : true, 'sup' : 0, 'canuse' : ['air','as','air']},
		'column' : { 'atk' : 2, 'def' : 2, 'sup' : 1, 'canuse' : ['arm','arm','arm']},
		'bigguns' : { 'special' : true, 'sup' : 1, 'canuse' : ['inf','arm','lr']},
		'evasion' : { 'atk' : 0, 'def' : 3,'sup' : 1, 'canuse' : ['air','air','air']},
		'tstrike' : { 'special' : true, 'sup' : 1, 'canuse' : ['inf','lr','air']}
	},
	'supply' : 3
}

var properCards;

// Starts off the game and all the other functions
function playInit(connection, deck, atkr) {
	var attacker = atkr;
	conn = connection;

	properCards = md5(cardType);

	var hashedDeck = {};
	deck = [
		{'type': 'infantry', 'id' : 0, 'hash' : 0}, 
		{'type': 'infantry', 'id' : 0, 'hash' : 0}, 
		{'type': 'drone', 'id' : 0, 'hash' : 0}, 
		{'type': 'drone', 'id' : 0, 'hash' : 0}, 
		{'type': 'at', 'id' : 0, 'hash' : 0}, 
		{'type': 'at', 'id' : 0, 'hash' : 0},
		{'type': 'at', 'id' : 0, 'hash' : 0},
		{'type': 'frontline', 'id' : 0, 'hash' : 0},
		{'type': 'barrier', 'id' : 0, 'hash' : 0},
		{'type': 'supply', 'id' : 0, 'hash' : 0}, 
		{'type': 'supply', 'id' : 0, 'hash' : 0},
		{'type': 'supply', 'id' : 0, 'hash' : 0},
		{'type': 'poppy', 'id' : 0, 'hash' : 0},
		{'type': 'mo', 'id' : 0, 'hash' : 0}
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
	var endTurn = document.querySelector('.hand').appendChild( document.createElement('button') );
	endTurn.innerHTML = "End Turn";
	buoy.addClass(endTurn,'turn');
	if (!myTurn) endTurn.setAttribute('disabled','true');

	endTurn.addEventListener('click', function() {
		if (myTurn = true){
			endTurn.setAttribute('disabled','true');
			document.querySelector('.end').setAttribute('disabled','true');
			if (document.querySelectorAll('.card').length<8) {
				drawCard(playerDeck,8-document.querySelectorAll('.card').length);
			} else { drawCard(playerDeck,1); }

			conn.send( { 'func':'yourTurn' } );
			myTurn = false;
			buoy.addClass(document.querySelector('.hand'),'disable');
		}

		notify('red', 'Ended Turn');
	});

	// End Round
	var endRound = document.querySelector('.hand').appendChild( document.createElement('button') );
	endRound.innerHTML = "End Round";
	buoy.addClass(endRound,'end');
	if (!myTurn) endRound.setAttribute('disabled','true');

	endRound.addEventListener('click', function() {
		if (myTurn = true){
			var points;

			if (document.querySelectorAll('.opponent .unit').length <= 3) {
				points = 1;
			} else if (document.querySelectorAll('.opponent .unit').length===4) {
				points = 2;
			} else { points = 3; }

			// Discard units (& combos)
			resetField(points,true);
		}
	});

	// Reshuffle deck
	var reshuffle = document.querySelector('.hand').appendChild( document.createElement('button') );
	reshuffle.innerHTML = "Reshuffle";
	buoy.addClass(reshuffle,'shuf');
	if (!myTurn) reshuffle.setAttribute('disabled','true');

	reshuffle.addEventListener('click', function() {
		if (myTurn = true && document.querySelectorAll('.card').length>=8){
			var cards = [];

			[].forEach.call(document.querySelectorAll('.hand .card'), function(el) {
				cards.push(el.cardProps);
			});

			redeckCard(playerDeck,cards,true);
			reshuffle.setAttribute('disabled','true');
		}
	});
}

// Play a card
function playCard(card,who) {
	if (who === 'player') var cardEl = document.getElementById(card.id);

	if ( properCards === md5(cardType) ) {
		// Add card to field if a unit
		if (cardType.unit[card.type] && document.querySelectorAll('.'+who+' .unit').length < 5) {
			var newUnit;
			var whoUnitCount = document.querySelectorAll('.'+who+' .unit').length;
			// If only one unit, place in center of formation
			if (whoUnitCount === 0) {
				newUnit = document.querySelector('.'+who+' li:nth-child(3)').appendChild( document.createElement('div') );
				unitCard(newUnit,card,who,card.id);

			} 
			// If more than one unit, choose position
			else {
				// Disable cards while choosing
				if (who === 'player') {
					[].forEach.call(document.querySelectorAll('.hand .card'), function(el) {
						buoy.addClass(el, 'disable');
					});
				}

				// only choose if actually the player AND allowed to expand
				if (who === 'player'){
					// This is meant to limit defender to attacker's count
					// var theirUnitCount = document.querySelectorAll('.opponent .unit').length;
					// if (whoUnitCount >= 3 && whoUnitCount >= theirUnitCount) return false;
					
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
								unitCard(newUnit,card,who,card.id);

								if (buoy.hasClass(el,'prev')) conn.send( { 'func':'unitPos', 'pos' : 'prev', 'card' : card, 'who' : 'opponent', 'id' : card.id } );
								if (buoy.hasClass(el,'next')) conn.send( { 'func':'unitPos', 'pos' : 'next', 'card' : card, 'who' : 'opponent', 'id' : card.id } );

								// Cleanup
								addPrev.parentNode.removeChild(addPrev);
								addNext.parentNode.removeChild(addNext);
								addPrev = null;
								addNext = null;

								[].forEach.call(document.querySelectorAll('.hand .card'), function(el) {
									buoy.removeClass(el, 'disable');
								});

								// Smart shift
								smartShift(who);
							}
						});
					});
				} // Otherwise, place according to the player's choice
			}
			// Remove card from hand
			if (who === 'player') cardEl.remove();
		} 
		// Add commander to field
		else if (cardType.co[card.type]) {
			if (!document.querySelector('.'+who+' .commander')) {
				var comm = document.querySelector('.'+who).appendChild( document.createElement('div') );
				buoy.addClass(comm,'commander');
				comm.setAttribute('data-type', card.type);
				comm.bonus = cardType.co[card.type].bonus;
				if (cardType.co[card.type].bonus2) comm.bonus2 = cardType.co[card.type].bonus2;

				// Remove card from hand
				if (who === 'player') cardEl.remove();

				unitCalc('opponent');
				unitCalc('player');

				if (who != 'player') notify('purple', "<img src='images/cards/co_"+card.type+".png'> Commander was played");
			}
		}
		// Add combo to unit
		else if (cardType.combo[card.type]) {
			// Only do choosing if player
			if (who === 'player') {
				console.log(cardType.combo[card.type]);

				// Listener for typical combos
				function clickListener(e) {
					var slot = e.target;
					if (buoy.hasClass(slot,'active')) {
						// Attach combo to unit
						var card = slot.arg[0];
						var who = slot.arg[1];
						console.log('ID: '+slot.lastElementChild.getAttribute('id'));
						comboCard(slot.lastElementChild.getAttribute('id'),card,who);

						conn.send( { 
							'func':'comboPos', 
							'pos' : slot.lastElementChild.getAttribute('id'), 
							'card' : card, 
							'who' : 'opponent' 
						});

						[].forEach.call(slot.parentNode.children, function(li) {
							// Kill Listeners
							li.removeEventListener('click', clickListener);
							buoy.removeClass(li,'active');
						});
					}
				}

				// First check if combo can be played anywhere
				[].forEach.call(document.querySelectorAll('.'+who+' .unit'), function(el) {
					// Get each unit's traits
					console.log('Checking '+el.getAttribute('id'));
					var traits = cardType.unit[el.getAttribute('data-type')].trait;
		
					// For every trait
					var comboMatch = false;
					if (cardType.combo[card.type].canuse) {
						comboStars = cardType.combo[card.type].canuse;
					} else { comboStars = 0; }

					// Check if unit trait matches what 1 star combo needs
					if ( comboStars.length === 1 && (!buoy.hasClass(el.parentNode,'combo')) ) {
						for (var i=0;i<traits.length;i++) {
							if (comboStars.indexOf( traits[i] ) != -1) {
								comboMatch = true;
								break;
							}
						}
					}
					// Check if unit trait matches what 2 star combo needs
					else if (comboStars.length >= 2 && (!buoy.hasClass(el.parentNode,'combo')) ) {
						// Check both side units traits for the other star
						var sideMatch = 0;
						var farSideMatch = 0;
						var farPrev;
						var farNext;
						var prev = el.parentNode.previousElementSibling.firstElementChild;
						var next = el.parentNode.nextElementSibling.firstElementChild;
						
						if (prev) {
							if (!buoy.hasClass(prev,'combo')) {
								var prev = cardType.unit[prev.getAttribute('data-type')].trait;
								var first = Math.round(comboStars.length/2)-1;
								for (var i=0;i<prev.length;i++) {
									//console.log(comboStars,prev[i]);
									if (comboStars[first] === prev[i] || (comboStars.length === 3 && comboStars[0] === prev[i]) ) {
										//console.log('PREV MATCH');
										sideMatch += 1;
										break;
									}
								}
							}
						}

						if (next) {
							if (!buoy.hasClass(next,'combo')) {
								var next = cardType.unit[next.getAttribute('data-type')].trait;
								for (var i=0;i<next.length;i++) {
									//console.log(comboStars, next[i]);
									if ((comboStars.length === 2 && comboStars[1] === next[i]) || (comboStars.length === 3 && comboStars[2] === next[i]) || (comboStars.length === 3 && comboStars[1] === next[i])) {
										//console.log('NEXT MATCH');
										sideMatch += 2;
										break;
									}
								}
							}
						}

						if (comboStars.length === 2) {
							//console.log('Side match: '+sideMatch);
							for (var i=0;i<traits.length;i++) {
								if ( comboStars.indexOf( traits[i] ) != -1 && sideMatch > 0 ) {
									comboMatch = true;
									break;
								}
							}
						} else {
							farPrev = el.parentNode.previousElementSibling.previousElementSibling;
							farNext = el.parentNode.nextElementSibling.nextElementSibling;

							if (farPrev) {
								if (farPrev.children.length > 0) {
									var farPrev = cardType.unit[farPrev.firstElementChild.getAttribute('data-type')].trait
									for (var i=0;i<farPrev.length;i++) {
										if (comboStars[0] === traits[i]) {
											//console.log('FAR PREV MATCH');
											farSideMatch = 1;
											break;
										}
									}
								}
							}

							if (farNext) {
								if (farNext.children.length > 0) {
									var farNext = cardType.unit[farNext.firstElementChild.getAttribute('data-type')].trait
									for (var i=0;i<farNext.length;i++) {
										if (comboStars[2] === traits[i]) {
											//console.log('FAR NEXT MATCH');
											farSideMatch = 2;
											break;
										}
									}
								}
							}

							console.log(sideMatch, farSideMatch);

							for (var i=0;i<traits.length;i++) {
								if ( (comboStars[2] === traits[i] && farSideMatch===1 && sideMatch===1) || (sideMatch===3 && comboStars[1] === traits[i]) || (sideMatch===2&&farSideMatch===2&&comboStars[0] === traits[i]) ) {
									//console.log('THREE STAR COMBO');
									comboMatch = true;
									break;
								}
							}
						}
					}

					if (comboMatch) {
						console.log('Combo match!');
						// For non-special combos, do standard stuff
						if (!cardType.combo[card.type].special) {
							// Remove card from hand
							cardEl.remove();

							// Make unit slot combo-attachable
							buoy.addClass(el.parentNode,'active');

							el.parentNode.addEventListener('click', clickListener);
							el.parentNode.arg = [card,who];
						}
					}
				});

				if (cardType.combo[card.type].any) {
					specialCombo(card,who);
				}
			}
		} else {
			// If supplies, then just add to current supply count
			currentSup = parseInt(document.querySelector('.'+who+' .sup').getAttribute('data-sup'));
			document.querySelector('.'+who+' .sup').setAttribute('data-sup', currentSup+3);
			if (who === 'player') {
				drawCard(playerDeck,1);
				cardEl.remove();
			}

			unitCalc('opponent');
			unitCalc('player');

			if (who != 'player') notify('yellow', "<img src='images/cards/supply.png'> Supply was played");
		}
	}
}

// =================================
// -------- CARD FUNCTIONS ---------
// =================================

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

function testCard(card,action) {
	// Test a card against the hashed deck list
	// Return true if it exists
	if (!card) return false;

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
	n = typeof n !== 'undefined' ? n : 1;

	var indexOfAttr = function(array, attr, value) {
	    for(var i = 0; i < array.length; i++) {
	        if(array[i].hasOwnProperty(attr) && array[i][attr] === value) {
	            return i;
	        }
	    }
	    return -1;
	}

	// Add to UI
	for (var i=0;i<n;i++) {
		var wannaplay;

		// If starting draw, first grab supply + unit (if possible)
		if (n===8 && i===0 && indexOfAttr(deck,'type','supply') != -1) {
			wannaplay = deck.splice( indexOfAttr(deck,'type','supply'), 1)[0];
		} 
		else if (n===8 && i===1 && indexOfAttr(deck,'type','unit') != -1) {
			wannaplay = deck.splice( indexOfAttr(deck,'type','unit'), 1)[0];
		}
		// Otherwise draw whatever
		else { wannaplay = deck.pop(); }

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

// Redeck Card
function redeckCard(deck,cards,redraw) {
	for (var i=0;i<cards.length;i++) {
		deck.push( cards[i] );
		// Delete unit/cards and not li.combo's
		if (document.getElementById(cards[i].id)) {
			document.getElementById(cards[i].id).remove();
		}

		// Last card, do something
		if (i===cards.length-1) {
			deck = shuffle(deck);
			if (redraw) drawCard(playerDeck,cards.length);
		}
	}
}

// Actually draw a real card
function drawCardConfirmed(card) {
	// Image
	var pre = '';
	if ( cardType.unit[card.type] ) { pre = 'unit_'; }
	else if ( cardType.co[card.type] ) { pre = 'co_'; }

	// DOM Stuff
	var newcard = document.querySelector('.hand').appendChild( document.createElement('div') );
	var img = newcard.appendChild( document.createElement('img') );
	img.setAttribute('src','images/cards/'+pre+card.type+'.png');
	newcard.classList.add('card');
	newcard.cardProps = card;
	newcard.setAttribute('id', card.id);
	newcard.setAttribute('data-type',card.type);

	newcard.addEventListener('click', function() {
		//console.log('Testing Card ',card);

		function canAfford(card) {
			//console.log(card);

			var totalSup = parseInt(document.querySelector('.player .sup').getAttribute('data-sup') );
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

			//console.log(neededSup, currentSup, totalSup);

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

		document.querySelector('.shuf').setAttribute('disabled','true');
	});
}

// Discard a card
function discardCard() {

}

// Zoom on card
function zoomCard() {
	// Scrolling is weird
}

function unitCard(newUnit,card,who,id) {
	// Add unit class and type
	buoy.addClass(newUnit,'unit');
	newUnit.setAttribute('id', id);
	newUnit.setAttribute('data-type', card.type);
	newUnit.cardProps = card;
	// Image
	var img = newUnit.appendChild( document.createElement('img') );
	img.setAttribute('src','images/cards/unit_'+card.type+'.png');
	// Set attack
	newUnit.setAttribute('data-atk', cardType.unit[card.type].atk );
	currentAtk = parseInt(document.querySelector('.'+who+' .atk').getAttribute('data-unit') );
	document.querySelector('.'+who+' .atk').setAttribute( 'data-unit', currentAtk+parseInt(newUnit.getAttribute('data-atk')) );
	// Set defense
	newUnit.setAttribute('data-def', cardType.unit[card.type].def );
	currentDef = parseInt(document.querySelector('.'+who+' .def').getAttribute('data-unit') );
	document.querySelector('.'+who+' .def').setAttribute( 'data-unit', currentDef+parseInt(newUnit.getAttribute('data-def')) );
	// Set supply cost
	newUnit.setAttribute('data-sup', cardType.unit[card.type].sup );

	unitCalc('opponent');
	unitCalc('player');

	if (who!="player") notify(cardType.unit[card.type].trait[0], "<img src='images/cards/unit_"+card.type+".png'> Unit was played");
}

function unitCalc(who) {
	var atkSpan = document.querySelector('.'+who+' .atk');
	var defSpan = document.querySelector('.'+who+' .def');
	var supSpan = document.querySelector('.'+who+' .sup');
	var bonusTotal = 0;
	var comboAtkTotal = 0;
	var comboDefTotal = 0;
	var unitTraits= [];
	var commAtkBonus = 0;
	var commDefBonus = 0;
	var unitAtk = parseInt(atkSpan.getAttribute('data-unit') );
	var currentSupUse = 0;
	var currentSup = parseInt( supSpan.getAttribute('data-sup') );

	[].forEach.call(document.querySelectorAll('.'+who+' .unit'), function(el) {
		// If unit has a bonus
		if ( cardType.unit[el.getAttribute('data-type')].bonus ) {
			var bonusTrait = cardType.unit[el.getAttribute('data-type')].bonus;
			// Check all enemy units...
			[].forEach.call(document.querySelectorAll('aside:not(.'+who+') .unit'), function(em) {
				// ...and see if they have a trait matching the bonus trait
				if ( cardType.unit[em.getAttribute('data-type')].trait.indexOf( bonusTrait[1] ) != -1  ) {
					bonusTotal += bonusTrait[0];
				}
			});
		}
		// If unit has combo attached
		if ( buoy.hasClass(el.parentNode,'combo') ) {
			if (el.parentNode.getAttribute('data-atk')) comboAtkTotal += parseInt(el.parentNode.getAttribute('data-atk'))
			if (el.parentNode.getAttribute('data-def')) comboDefTotal += parseInt(el.parentNode.getAttribute('data-def'))

			currentSupUse += parseInt(el.parentNode.getAttribute('data-sup'));
		}

		unitTraits.push(cardType.unit[el.getAttribute('data-type')].trait);
		// Add supply cost
		currentSupUse += parseInt(cardType.unit[el.getAttribute('data-type')].sup);
	});

	if (document.querySelector('.'+who+' .commander')) {
		var comm = document.querySelector('.'+who+' .commander');

		for (var i=0;i<unitTraits.length;i++) {
			if ( unitTraits[i].indexOf( comm.bonus[1] ) != -1 ) {
				if ( comm.bonus[2] === 'atk') commAtkBonus += comm.bonus[0]
				if ( comm.bonus[2] === 'def') commDefBonus += comm.bonus[0]

				if (comm.bonus2 && unitTraits[i].indexOf( comm.bonus2[1] ) != -1) {
					if ( comm.bonus2[2] === 'atk') commAtkBonus += comm.bonus2[0]
					if ( comm.bonus2[2] === 'def') commDefBonus += comm.bonus2[0]
				}
			} 
		}
	}

	//console.log('Bonus Total: '+bonusTotal);
	var unitBonus = bonusTotal+parseInt(atkSpan.getAttribute('data-bonus') );

	atkSpan.innerHTML = unitAtk + unitBonus + comboAtkTotal + commAtkBonus;
	defSpan.innerHTML = parseInt(defSpan.getAttribute('data-unit')) + comboDefTotal + commDefBonus;
	
	supSpan.setAttribute('data-supuse', currentSupUse);
	supSpan.textContent = supSpan.getAttribute('data-supuse')+'/'+supSpan.getAttribute('data-sup');
}

function comboCard(unit,card,who) {
	var slot = document.getElementById(unit).parentNode;
	buoy.addClass(slot,'combo');

	var pre = '';
	if ( cardType.unit[card.type] ) { pre = 'unit_'; }
	else if ( cardType.co[card.type] ) { pre = 'co_'; }

	slot.setAttribute('data-type', card.type);
	// Image?
	var img = document.createElement("img");
	img.setAttribute('src','images/cards/'+pre+card.type+'.png');
	slot.firstElementChild.appendChild(img);

	slot.cardProps = card;

	if (cardType.combo[card.type].atk) {
		var unitAtk = parseInt(document.querySelector('.'+who+' .atk').getAttribute('data-unit') );
		slot.setAttribute('data-atk', cardType.combo[card.type].atk );
		if (cardType.combo[card.type].atk>0) buoy.addClass(slot,'atk');
	}

	if (cardType.combo[card.type].def) {
		var unitDef = parseInt(document.querySelector('.'+who+' .def').getAttribute('data-unit') );
		slot.setAttribute('data-def', cardType.combo[card.type].def );
		if (cardType.combo[card.type].def>0) buoy.addClass(slot,'def');
	}

	if (cardType.combo[card.type].sup) {
		slot.setAttribute('data-sup', cardType.combo[card.type].sup );
	} else { slot.setAttribute('data-sup', "0") }

	unitCalc('opponent');
	unitCalc('player');

	if (who!='player')notify('red', "<img src='images/cards/"+card.type+".png'> Combo was played");
}

function specialCombo(card,who) {
	switch (card.type) {
		case "sniper":
			// Place on inf, then listener to kill
			// opponent combo
			break;
		case "retreat":
			// Add listener to redeck
			break;
		case "shift":
			// Add listener to reorder li's
			break;
		case "reinforce":
			document.getElementById(card.id).remove();
			drawCard(playerDeck,3);
			break;
		case "barrier":
			break;
		case "stealth":
			break;
	}
}

// =================================
// --------- UI FUNCTIONS ----------
// =================================

function placeUnit(pos, card, who, id) {
	var newUnit;

	if (pos === 'prev') {
		var firstUnit = document.querySelectorAll('.opponent .unit')[0];
		newUnit = firstUnit.parentNode.previousElementSibling.appendChild( document.createElement('div') );
	} else {
		var lastUnit = document.querySelectorAll('.opponent .unit')[document.querySelectorAll('.opponent .unit').length-1];
		newUnit = lastUnit.parentNode.nextElementSibling.appendChild( document.createElement('div') );
	}
	
	unitCard(newUnit, card, who, id);
	smartShift('opponent');
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

function notify(type, msg) {
	var bubble = document.querySelector('body').appendChild( document.createElement('div') );
	bubble.innerHTML = msg;
	buoy.addClass(bubble, 'notify');
	buoy.addClass(bubble, type);

	var notCount = document.querySelectorAll('.notify').length;
	if (notCount > 1) bubble.style.top = (((notCount-1)*80)+(10*(notCount)))+'px';

	window.setTimeout( function() { bubble.remove(); }, 5000);
}

function resetField(points,loser) {
	// Reset units, auto save if one unit
	if (document.querySelectorAll('.player .unit').length === 1) {
		console.log(document.querySelector('.player .unit').cardProps);
		redeckCard(playerDeck,[document.querySelector('.player .unit').cardProps],false);
		// Redeck combo if it exists
		if (!loser && document.querySelector('.player .combo')) redeckCard(playerDeck,[document.querySelector('.player .combo').cardProps],false);

		if (loser) {
			[].forEach.call(document.querySelectorAll('.player .combo'), function(el) {
				el.setAttribute('class','');
				el.removeAttribute('data-atk');
				el.removeAttribute('data-def');
				el.removeAttribute('data-sup');
				el.removeAttribute('data-type');
				el.removeAttribute('id');
			});

			notify('red', 'Lost Round');
			conn.send({ 'func':'notify', 'type':'green', 'msg': 'You win round'});
			conn.send({ 'func':'win', 'points': points });
		}

		window.setTimeout( function() {
			unitCalc('player');
			unitCalc('opponent');
		}, 500);
	} 
	// More than one unit
	else {
		function chooseListener(e) {
			var o = e.target;
			var objType;
			if (o.nodeName==='DIV') { objType = 'unit' } else { objType = 'combo' }

			redeckCard(playerDeck,[o.cardProps],false);

			[].forEach.call(document.querySelectorAll('.player .active.'+objType), function(obj) {
				// Kill Listeners
				obj.removeEventListener('click', chooseListener);
				if(objType === 'unit') {
					obj.remove();
				} else {
					obj.setAttribute('class','');
					obj.removeAttribute('data-atk');
					obj.removeAttribute('data-def');
					obj.removeAttribute('data-sup');
					obj.removeAttribute('data-type');
					obj.firstElementChild.firstElementChild.remove();
				}
			});

			window.setTimeout( function() {
				unitCalc('player');
				unitCalc('opponent');
			}, 500);
		}

		// Loser gets to save one
		if (loser) {
			notify('yellow',"Choose <strong>1</strong> of your units to retreat into your deck");

			// Choose unit
			[].forEach.call(document.querySelectorAll('.player .unit'), function(unit) {
				buoy.addClass(unit, 'active');
				unit.addEventListener('click', chooseListener);
			});

			// Discard all combos
			[].forEach.call(document.querySelectorAll('.player .combo'), function(el) {
				el.setAttribute('class','');
				el.removeAttribute('data-atk');
				el.removeAttribute('data-def');
				el.removeAttribute('data-sup');
				el.removeAttribute('data-type');
				el.firstElementChild.firstElementChild.remove();
			});

			notify('red', 'Lost Round');
			conn.send({ 'func':'notify', 'type':'green', 'msg': 'You win round'});
			conn.send({ 'func':'win', 'points': points });
		} 
		// Winner saves all
		else { 
			var saveUnits = [];

			[].forEach.call(document.querySelectorAll('.player .unit'), function(el) {
				saveUnits.push(el.cardProps);
			});

			console.log(saveUnits);
			redeckCard(playerDeck,saveUnits,false);

			window.setTimeout( function() {
				unitCalc('player');
				unitCalc('opponent');
			}, 500);
		}

		// Auto save 1 combo, if not, also add selectors
		if (!loser && document.querySelectorAll('.player .combo').length === 1) {
			console.log('Multiple units, 1 Combo');

			var onlyCombo = document.querySelectorAll('.player .combo');
			console.log(onlyCombo);
			redeckCard(playerDeck,[onlyCombo.cardProps],false);

			onlyCombo.setAttribute('class','');
			onlyCombo.removeAttribute('data-atk');
			onlyCombo.removeAttribute('data-def');
			onlyCombo.removeAttribute('data-sup');
			onlyCombo.removeAttribute('data-type');
			onlyCombo.firstElementChild.firstElementChild.remove();

			window.setTimeout( function() {
				unitCalc('player');
				unitCalc('opponent');
			}, 500);
		} 
		else if (!loser && document.querySelectorAll('.player .combo').length > 1) {
			console.log('Multiple units, 1+ Combo');

			notify('yellow',"Choose <strong>1</strong> of your combos to retreat into your deck");

			[].forEach.call(document.querySelectorAll('.player .combo'), function(combo) {
				buoy.addClass(combo, 'active');
				combo.addEventListener('click', chooseListener);
			});
		} 
	}

	// Reset stats
	function wipeStats(who) {
		if (who==="opponent") {
			[].forEach.call(document.querySelectorAll('.opponent .unit'), function(unit) {
				unit.remove();
			});

			[].forEach.call(document.querySelectorAll('.opponent .combo'), function(combo) {
				combo.setAttribute('class','');
				combo.removeAttribute('data-atk');
				combo.removeAttribute('data-def');
				combo.removeAttribute('data-sup');
				combo.removeAttribute('data-type');
				combo.firstElementChild.firstElementChild.remove();
			});

			unitCalc('opponent');
		}

		document.querySelector('.'+who+' .atk').setAttribute('data-unit','0');
		document.querySelector('.'+who+' .def').setAttribute('data-bonus','0');

		document.querySelector('.'+who+' .def').setAttribute('data-unit','0');
		document.querySelector('.'+who+' .atk').setAttribute('data-bonus','0');

		document.querySelector('.'+who+' .sup').setAttribute('data-sup','0');
		document.querySelector('.'+who+' .sup').setAttribute('data-supuse','0');
		if (document.querySelector('.'+who+' .commander')) document.querySelector('.'+who+' .commander').remove();
	}

	wipeStats('player');
	wipeStats('opponent');

	// Swap attacker status
	if (!attacker) {
		attacker = true;
		myTurn = true; 
		document.querySelector('.shuf').removeAttribute('disabled'); 
		document.querySelector('.end').removeAttribute('disabled');
		document.querySelector('.turn').removeAttribute('disabled');
		buoy.removeClass(document.querySelector('.hand'),'disable');
	} else { 
		attacker = false;
		notify('yellow', "Opponent's Turn as Attacker");
		document.querySelector('.turn').setAttribute('disabled','true');
		document.querySelector('.end').setAttribute('disabled','true');
		if (document.querySelectorAll('.card').length<8) {
			drawCard(playerDeck,8-document.querySelectorAll('.card').length);
		} else { drawCard(playerDeck,1); }

		conn.send( { 'func':'yourTurn' } );
		myTurn = false;
		buoy.addClass(document.querySelector('.hand'),'disable');
	}
}
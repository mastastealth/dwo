var conn;
var peer;
var opponentDeck;
var playerDeck;
var myTurn;
var attacker;
var expanded = 0;
var forceEnd = 0;

var music = new Howl({
	autoplay: true,
	loop: true,
	urls: ['sfx/5Armies.mp3'], 
	volume: 0,
	onload: function() {
		music.fade(0,0.1,1500);
	} 
});

var sfx_deal = new Howl({ urls: ['sfx/deal.mp3'], volume: 0.35 });
var sfx_slide = new Howl({ urls: ['sfx/slide.mp3'], volume: 0.35 });
var sfx_shuffle = new Howl({ urls: ['sfx/shuffle.mp3'], volume: 0.35 });
var sfx_explode = new Howl({ urls: ['sfx/explosion.mp3'], volume: 0.35 });
var sfx_explode2 = new Howl({ urls: ['sfx/distant_explosion.mp3'], volume: 0.75 });
sfx_explode.pos3d()[0] = 2;

// Define all the cards
var cardType = {
	'unit' : {
		'infantry' : { 'atk': 1, 'def': 1, 'sup': 0, 'trait' : ['grd', 'inf'] },
		'recon' : { 'atk': 1, 'def': 2, 'sup': 1, 'bonus' : [2,'inf'], 'trait' : ['grd', 'arm'] },
		'apc' : { 'atk': 1, 'def': 2, 'sup': 0, 'bonus' : [1,'inf'], 'trait' : ['grd', 'arm'] },
		'aa' : { 'atk': 1, 'def': 2, 'sup': 1, 'bonus' : [2,'air'], 'trait' : ['grd', 'arm', 'aa'] },
		'tank' : { 'atk': 2, 'def': 2, 'sup': 2, 'trait' : ['grd', 'arm'] },
		'htank' : { 'atk': 4, 'def': 5, 'sup': 5, 'trait' : ['grd', 'arm'] },
		'arty' : { 'atk': 3, 'def': 1, 'sup': 3, 'trait' : ['grd', 'arm', 'lr'] },
		'harty' : { 'atk': 5, 'def': 3, 'sup': 5, 'trait' : ['grd', 'arm', 'lr'] },
		'drone' : { 'atk': 1, 'def': 1, 'sup': 1, 'trait' : ['air', 'aa', 'as', 'inf'] },
		'helo' : { 'atk': 2, 'def': 2, 'sup': 2, 'trait' : ['air', 'aa'] },
		'a2g' : { 'atk': 2, 'def': 4, 'sup': 3, 'bonus' : [2,'arm'], 'trait' : ['air', 'as'] },
		'jet' : { 'atk': 1, 'def': 4, 'sup': 3, 'bonus' : [3,'air'], 'trait' : ['air', 'aa'] },
		'bomber' : { 'atk': 1, 'def': 3, 'sup': 4, 'bonus' : [3,'arm'], 'trait' : ['air', 'as', 'lr'] },
		'hbomber' : { 'atk': 1, 'def': 4, 'sup': 5, 'bonus' : [4,'grd'], 'trait' : ['air', 'as', 'lr'] }
	},
	'co' : {
		'saptiva' : { 'bonus' : [1,'inf','atk'], 'bonus2' : [1,'inf','def']},
		'advocate' : { 'bonus' : [2,'any','def'], 'bonus2' : [-2,'any','sup']},
		'poppy' : { 'bonus' : [1,'air','def'] },
		'mo' : { 'bonus' : [1,'grd','def'] },
		'oz' : { 'bonus' : [1,'arm','atk'] },
		'tankgirl' : { 'bonus' : [1,'any','atk'] }
	},		
	'combo' : {
		'at' : { 'vs' : 'arm', 'atk' : 3, 'sup' : 1, 'canuse' : ['inf'] },
		'sniper' : { 'special' : true, 'sup': 2, 'canuse' : ['inf'] },
		'medic' : { 'def' : 1, 'sup' : 0, 'canuse' : ['inf'] },
		'reactive' : { 'def' : 2, 'sup' : 2, 'canuse' : ['arm']},
		'stinger' : { 'vs' : 'air', 'atk' : 3, 'sup' : 2, 'canuse' : ['inf']  },
		'support' : { 'special' : true, 'sup' : 0, 'canuse' : ['inf'] },
		'retreat' : { 'special' : true, 'any' : true, 'sup' : 0 },
		'shift' : { 'special' : true, 'any' : true, 'sup' : 0 },
		'reinforce' : { 'special' : true, 'any' : true, 'sup' : 0 },
		'frontline' : { 'atk' : 2, 'def' : -1, 'sup' : 0, 'canuse' : ['grd','grd'] },
		'intel' : { 'sup': 3, 'canuse' : ['inf','air'], 'special' : true },
		'fallback' : { 'def' : 2, 'atk' : -1, 'sup' : 0, 'canuse' : ['grd','grd'] },
		'cstrike' : { 'def' : 0, 'atk' : 3, 'sup' : 2, 'canuse' : ['arm','air'] },
		'shell' : { 'def' : 0, 'atk' : 2, 'sup' : 2, 'canuse' : ['arm','arm'] },
		'coverage' : { 'def' : 3, 'atk' : 0, 'sup' : 1, 'vs': 'as', 'canuse' : ['grd','air'] },
		'wingman' : { 'def' : 2, 'atk' : 0, 'sup' : 1, 'canuse' : ['air','air'] },
		'stealth' : { 'special' : true, 'sup' : 1, 'canuse' : ['inf','lr'] },
		'barrier' : { 'special' : true, 'sup' : 0, 'canuse' : ['arm','inf','arm'] },
		'squad' : { 'special' : true, 'sup' : 0, 'canuse' : ['inf','inf','inf']},
		'patrol' : { 'atk' : 0, 'def' : 4, 'sup' : 2, 'canuse' : ['air','grd','air']},
		'acover' : { 'special' : true, 'sup' : 0, 'canuse' : ['air','as','air']},
		'column' : { 'atk' : 2, 'def' : 2, 'sup' : 2, 'canuse' : ['arm','arm','arm']},
		'bigguns' : { 'special' : true, 'sup' : 2, 'canuse' : ['inf','arm','lr']},
		'evasion' : { 'atk' : 0, 'def' : 3,'sup' : 1, 'canuse' : ['air','air','air']},
		'tstrike' : { 'special' : true, 'sup' : 3, 'canuse' : ['inf','lr','air']}
	},
	'supply' : 3
}

var properCards;

// Starts off the game and all the other functions
function playInit(connection, deck, atkr,p) {
	// Attacker/Defender
	peer = p;
	var attacker = atkr;

	if (attacker) {
		buoy.addClass(document.querySelector('.player'), 'attacker');
	} else { buoy.addClass(document.querySelector('.opponent'), 'attacker'); }

	conn = connection;

	// Prepare for networking stuff
	properCards = md5(cardType);
	var hashedDeck = {};
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
			document.querySelector('.hand').setAttribute('data-count',playerDeck.length);
			drawCard(playerDeck,count);
		}
	}

	// UI Stuff

	// End Turn
	var endTurn = document.querySelector('.hand').appendChild( document.createElement('button') );
	endTurn.innerHTML = "End Turn";
	buoy.addClass(endTurn,'turn');
	endTurn.setAttribute('disabled','true');

	endTurn.addEventListener('click', endTurnListener);

	// End Round
	var endRound = document.querySelector('.hand').appendChild( document.createElement('button') );
	endRound.innerHTML = "End Round";
	buoy.addClass(endRound,'end');
	if (!myTurn) endRound.setAttribute('disabled','true');

	endRound.addEventListener('click', function() {
		// Only possible to end round on your turn
		if (myTurn) {
			var points;
			var his = document.querySelectorAll('.opponent .formation .unit').length;

			if ( his <= 3 ) {
				points = 1;
			} else if (his===4) {
				points = 2;
			} else { points = 3; }

			// Discard units (& combos)
			resetField(points,true);
		}
	});
}

// Play a card
function playCard(card,who) {
	console.log(card);
	if (who === 'player') var cardEl = document.getElementById(card.id);

	if ( properCards === md5(cardType) ) {
		
		// Initial counts and stuff
		var unitCount = document.querySelectorAll('.'+who+' .formation .unit').length;
		var oUnitCount = document.querySelectorAll('aside:not(.'+who+') .formation .unit').length;
		var fieldOfPlayCheck = true;

		// If you're defender AND your current is >= opponent AND your opponent has more than 3
		if (!attacker &&  (oUnitCount > 3 && unitCount === oUnitCount || oUnitCount <= 3 && unitCount === 3)  ) fieldOfPlayCheck = false;

		// Add card to field if a unit
		if (cardType.unit[card.type] && unitCount < 5 && fieldOfPlayCheck) {
			var newUnit;
			// If only one unit, place in center of formation
			if (unitCount === 0) {
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
					// Get first and last positioned units
					var firstUnit = document.querySelectorAll('.'+who+' .formation .unit')[0];
					var lastUnit = document.querySelectorAll('.'+who+' .formation .unit')[document.querySelectorAll('.'+who+' .formation .unit').length-1];
					var addPrev;
					var addNext;

					// Notify player
					notify('u', 'Choose to place new unit at the top or bottom of the formation', true); 

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

								if (buoy.hasClass(el,'prev') && conn) conn.send( { 'func':'unitPos', 'pos' : 'prev', 'card' : card, 'who' : 'opponent', 'id' : card.id } );
								if (buoy.hasClass(el,'next') && conn) conn.send( { 'func':'unitPos', 'pos' : 'next', 'card' : card, 'who' : 'opponent', 'id' : card.id } );

								// Cleanup
								if (addPrev) addPrev.parentNode.removeChild(addPrev);
								if (addNext) addNext.parentNode.removeChild(addNext);
								addPrev = null;
								addNext = null;

								[].forEach.call(document.querySelectorAll('.hand .card'), function(el) {
									buoy.removeClass(el, 'disable');
								});

								[].forEach.call(document.querySelectorAll('.sticky'), function(msg) {
									buoy.addClass( msg, 'un');
									window.setTimeout( function() { msg.remove(); }, 500);
								});

								// Smart shift
								smartShift(who);
							}
						});
					});
				} // Otherwise, place according to the player's choice
			}
			// Remove card from hand
			if (who === 'player') cardToDiscard(cardEl);
		} 
		else if (cardType.unit[card.type] && document.querySelectorAll('.'+who+' .formation .unit').length >= 5) {
			if (who === 'player') notify('yellow', "Can't play any more units, your field is full!");
		} else if (cardType.unit[card.type] && unitCount < 5 && !fieldOfPlayCheck) {
			if (who === 'player') notify('yellow', "Can't play any more units, only attacker can expand field count!");
		}
		// Add commander to field
		else if (cardType.co[card.type]) {
			if (!document.querySelector('.'+who+' .commander')) {
				var comm = document.querySelector('.'+who).appendChild( document.createElement('div') );
				buoy.addClass(comm,'commander');
				comm.setAttribute('data-type', card.type);
				comm.style.backgroundImage = 'url(images/misc/'+card.type+'.png)'
				comm.bonus = cardType.co[card.type].bonus;
				if (cardType.co[card.type].bonus2) comm.bonus2 = cardType.co[card.type].bonus2;

				// Remove card from hand
				if (who === 'player') cardToDiscard(cardEl);
				sfx_slide.play();
				unitCalc('opponent');
				unitCalc('player');
				addHistory('comm',who,card.type);

				if (who === 'player') forceEndCheck(who);

				if (who != 'player') notify('purple', "<img src='images/cards/co_"+card.type+".png'> General was played");
			}
		}
		// Add combo to unit
		else if (cardType.combo[card.type]) {
			// Only do choosing if player
			if (who === 'player') {
				// Listener for typical combos
				function clickListener(e) {
					var slot = e.target;
					if (buoy.hasClass(slot,'active')) {
						// Attach combo to unit
						var card = slot.arg[0];
						var who = slot.arg[1];
						//console.log('ID: '+slot.lastElementChild.getAttribute('id'));
						comboCard(slot.querySelector('.unit').getAttribute('id'),card,who);

						if (conn) conn.send( { 
							'func':'comboPos', 
							'pos' : slot.querySelector('.unit').getAttribute('id'), 
							'card' : card, 
							'who' : 'opponent' 
						});

						[].forEach.call(slot.parentNode.parentNode.querySelectorAll('li.active'), function(li) {
							// Kill Listeners
							li.removeEventListener('click', clickListener);
							buoy.removeClass(li,'active');
						});
					}
				}

				function cancelComboListener(e) {
					[].forEach.call(document.querySelectorAll('.player li.active'), function(li) {
						// Kill Listeners
						li.removeEventListener('click', clickListener);
						buoy.removeClass(li,'active');
					});

					document.querySelector('.cardContainer').appendChild(cardEl);
					buoy.removeClass(cardEl,'toDiscard');

					document.querySelector('.hand .cancel').remove();
				}

				// Special function for barrier combo
				function barrierCheck(u) {
					var prevSlot = (u.parentNode.previousElementSibling) ? u.parentNode.previousElementSibling : document.querySelector('body');
					var nextSlot = (u.parentNode.nextElementSibling) ? u.parentNode.nextElementSibling : document.querySelector('body');

					if (prevSlot.getAttribute('data-type')==='barrier' || nextSlot.getAttribute('data-type')==='barrier') {
						if ( !u.parentNode.getAttribute('data-type2') ) { 
							return true; 
						} else { return false; }
					} else { return false; }
				}

				// Some variables
				var field = [];
				var notified = 0;
				var comboMatch = false;
				if (cardType.combo[card.type].canuse) {
					comboStars = cardType.combo[card.type].canuse;
				} else { comboStars = 0; }

				// First check if combo can be played anywhere
				[].forEach.call(document.querySelectorAll('.'+who+' .unit'), function(el) {
					// Get each unit's traits
					field.push( {'id' : el.cardProps.id, 't' : cardType.unit[el.getAttribute('data-type')].trait} );
				});

				// 1 Star Combo
				if (comboStars.length === 1) {
					// Check for a single match
					for (var i=0;i<field.length;i++) {
						if (field[i].t.indexOf(comboStars[0]) != -1) {
							var u = document.getElementById(field[i].id);
							if (!buoy.hasClass(u.parentNode,'combo') || barrierCheck(u)) {
								comboMatch = true;
								// Remove card from hand
								if (cardEl) cardToDiscard(cardEl);

								var unit = document.getElementById(field[i].id);
								// Make unit slot combo-attachable
								buoy.addClass(unit.parentNode,'active');
								unit.parentNode.addEventListener('click', clickListener);
								unit.parentNode.arg = [card,who];
							}
						}
					}
				} else if (comboStars.length === 2) {
					// Check for 2 matches
					for (var i=0;i<field.length;i++) {
						if (field[i].t.indexOf(comboStars[0]) != -1) {
							if (field[i+1]) {
								if ( field[i+1].t.indexOf(comboStars[1]) != -1 ) {
									comboMatch = true;
									if (cardEl) cardToDiscard(cardEl);

									var unit = document.getElementById(field[i].id);
									var unit2 = document.getElementById(field[i+1].id);

									if (!buoy.hasClass(unit.parentNode,'combo')) buoy.addClass(unit.parentNode,'active');
									if (!buoy.hasClass(unit2.parentNode,'combo')) buoy.addClass(unit2.parentNode,'active');

									[].forEach.call(document.querySelectorAll('.'+who+' li.active'), function(slot) {
										slot.addEventListener('click', clickListener);
										slot.arg = [card,who];
									});
								}
							} else { break; }
						}
					}
				} else if (comboStars.length === 3) {
					// Check for 3 matches
					for (var i=0;i<field.length;i++) {
						if (field[i].t.indexOf(comboStars[0]) != -1) {
							if (field[i+1] && field[i+2]) {
								if ( field[i+1].t.indexOf(comboStars[1]) != -1 && field[i+2].t.indexOf(comboStars[2]) != -1) {
									var unit = document.getElementById(field[i].id);
									var unit2 = document.getElementById(field[i+1].id);
									var unit3 = document.getElementById(field[i+2].id);

									if (!buoy.hasClass(unit.parentNode,'combo')) buoy.addClass(unit.parentNode,'active');
									// Special check for Barrier
									if (!buoy.hasClass(unit2.parentNode,'combo') || barrierCheck(unit2) ) {
										buoy.addClass(unit2.parentNode,'active');
									}
									if (!buoy.hasClass(unit3.parentNode,'combo')) buoy.addClass(unit3.parentNode,'active');

									[].forEach.call(document.querySelectorAll('.'+who+' li.active'), function(slot) {
										slot.addEventListener('click', clickListener);
										slot.arg = [card,who];
									});

									if (!document.querySelector('.'+who+' li.active')) {
										notify('red',"Booster doesn't match any units in play! Check stars for formation/required traits.");
										return false;
									}

									comboMatch = true;
									if (cardEl) cardToDiscard(cardEl);
								}
							} else { break; }
						}
					}
				} else if (comboStars === 0) {
					comboMatch = true;
					specialCombo(card,who);
				}

				if (!comboMatch) {
					notify('red',"Booster doesn't match any units in play! Check stars for formation/required traits.");
				} else {
					buoy.addClass(document.querySelector('.hand'),'disable');
					if (cardType.combo[card.type].special) return false;
					var cancelBtn = document.querySelector('.hand').appendChild( document.createElement('button') );
					buoy.addClass(cancelBtn,'cancel');
					cancelBtn.textContent = "Cancel";
					cancelBtn.addEventListener('click',cancelComboListener);
				}
			}
		} else if (card.type === "supply") {
			// If supplies, then just add to current supply count
			currentSup = parseInt(document.querySelector('.'+who+' .sup').getAttribute('data-supplayed'));
			document.querySelector('.'+who+' .sup').setAttribute('data-supplayed', currentSup+3);
			if (who === 'player') {
				if (!tutDeck) drawCard(playerDeck,1);
				if (tutDeck) drawCardConfirmed(tutDeck.pop(),100);
				cardToDiscard(cardEl);
			}

			sfx_slide.play();
			addSupply(who);
			unitCalc('opponent');
			unitCalc('player');

			addHistory('sup',who)

			if (who === 'player') forceEndCheck(who);

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

function reshuffleCheck() {
	if (tutDeck) return false;
	var cards = [];
	var supCount = 0;
	var unitCount = 0;

	// AUto draw cards
	if (document.querySelectorAll('.hand .card').length<8) {
		drawCard(playerDeck,8-document.querySelectorAll('.hand .card').length);
	}

	[].forEach.call(document.querySelectorAll('.hand .card'), function(el) {
		cards.push(el.cardProps);
		if (el.cardProps.unit) unitCount += 1;
		if (el.cardProps.type === "supply") supCount += 1;
	});

	if (supCount === 0 || unitCount === 0) {
		console.log(unitCount, supCount);
		redeckCard(playerDeck,cards,true);
	}
}

function testCard(card,action,who,time) {
	// Test a card against the hashed deck list
	// Return true if it exists
	if (!card) return false;

	if (opponentDeck[card.hash]) {
		if (action === 'draw') {
			conn.send({ 
				'func': 'drawCardConfirmed', 
				'card' : card,
				'who' : 'origin',
				'time': time
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

			if (!wannaplay) endGame(loser,1);
		} 
		else if (n===8 && i===1 && indexOfAttr(deck,'unit',1) != -1) {
			wannaplay = deck.splice( indexOfAttr(deck,'unit',1), 1)[0];
		}
		// Otherwise draw whatever
		else { wannaplay = deck.pop(); }

		// Check against opponent to make sure it's legit
		if (origin != 'origin' && conn) {
			conn.send({ 
				'func'  : 'testCard', 
				'card'  : wannaplay,
				'who'   : 'origin',
				'action': 'draw',
				'time' : i*100
			});
		}
	}
}

// Redeck Card
function redeckCard(deck,cards,redraw) {
	var count = 0;

	for (var i=0;i<cards.length;i++) {
		deck.push( cards[i] );
		//console.log('Redecking: ',cards[i]);
		count++;
		// Delete unit/cards and not li.combo's
		if (document.getElementById(cards[i].id)) {
			cardToDeck( document.getElementById(cards[i].id) );
		}

		// Last card, do something
		if (i===cards.length-1) {
			if (!tutDeck) deck = shuffle(deck);
			if (redraw && cards.length<8) { drawCard(playerDeck,cards.length) }
			else if (redraw && cards.length>=8) { drawCard(playerDeck,8); sfx_shuffle.play(); }
			else if (tutDeck) { drawCardConfirmed(tutDeck.pop(),100); }
		}
	}
}

// Actually draw a real card
function drawCardConfirmed(card,time) {
	window.setTimeout( function() {
		// Image
		var pre = '';
		if ( cardType.unit[card.type] ) { pre = 'unit_'; }
		else if ( cardType.co[card.type] ) { pre = 'co_'; }

		// DOM Stuff
		var newcard = document.querySelector('.hand .cardContainer').appendChild( document.createElement('div') );
		var img = newcard.appendChild( document.createElement('img') );
		img.setAttribute('src','images/cards/'+pre+card.type+'.png');
		buoy.addClass(newcard, 'card');
		buoy.addClass(newcard, 'new');

		sfx_deal.play();
		window.setTimeout( function() { buoy.removeClass(newcard, 'new'); },300);
		// Deck Graphic
		var hand = document.querySelector('.hand');
		if (playerDeck) {
			hand.setAttribute('data-count',playerDeck.length);
			if (playerDeck.length>32 && playerDeck.length<49 && !buoy.hasClass(hand,'low') ) {
				buoy.addClass(hand,'low');
			} else if (playerDeck.length>16 && playerDeck.length<33 && !buoy.hasClass(hand,'er')) {
				buoy.addClass(hand,'er')
			} else if (playerDeck.length<17 && !buoy.hasClass(hand,'est') ) { buoy.addClass(hand,'est') }
		} else if (tutDeck) { hand.setAttribute('data-count',tutDeck.length); }

		newcard.cardProps = card;
		newcard.setAttribute('id', card.id);
		newcard.setAttribute('data-type',card.type);
		if ( cardType.unit[card.type] ) newcard.setAttribute('data-isunit', true);

		newcard.addEventListener('click', playListener);
	},time);
}

function playListener(e) {
	var card = e.target.cardProps;
	if ( buoy.hasClass( document.querySelector('.hand') ,'disable') ) return false;

	function canAfford(card) {
		var totalSup = parseInt(document.querySelector('.player .sup').getAttribute('data-sup') );
		var currentSup = parseInt(document.querySelector('.player .sup').getAttribute('data-supuse') );
		var neededSup;

		if (cardType.unit[card.getAttribute('data-type')]) {
			neededSup = cardType.unit[card.getAttribute('data-type')].sup;
		} else if (cardType.combo[card.getAttribute('data-type')]) {
			neededSup = cardType.combo[card.getAttribute('data-type')].sup;
		} else { neededSup = 0 }

		//console.log(neededSup, currentSup, totalSup);

		if (neededSup + currentSup <= totalSup || neededSup === 0) {
			return true;
		} else { 
			notify('red', 'Not Enough Supplies');
			return false; 
		}
	}

	if (myTurn) {
		if ( canAfford(e.target) ) {
			if (conn) {
				conn.send({ 
					'func'  : 'testCard', 
					'card'  : card,
					'who'   : 'origin',
					'action': 'play'
				});
			} else if (tutDeck) {
				console.log('Local Play');
				playCard(card,'player');
			}
		}
	} else {
		if (!buoy.hasClass(document.querySelector('.game'),'tut')) notify('red', 'Not Your Turn');
	}
	
}

function addUnit(u,who,card) {
	// Set attack
	u.setAttribute('data-atk', cardType.unit[card].atk );
	currentAtk = parseInt(document.querySelector('.'+who+' .atk').getAttribute('data-unit') );
	document.querySelector('.'+who+' .atk').setAttribute( 'data-unit', currentAtk+parseInt(u.getAttribute('data-atk')) );
	// Set defense
	u.setAttribute('data-def', cardType.unit[card].def );
	currentDef = parseInt(document.querySelector('.'+who+' .def').getAttribute('data-unit') );
	document.querySelector('.'+who+' .def').setAttribute( 'data-unit', currentDef+parseInt(u.getAttribute('data-def')) );
	// Set supply cost
	u.setAttribute('data-sup', cardType.unit[card].sup );
	// Adds supply for APC
	if (card==='apc') {
		//var currentSup = parseInt(document.querySelector('.'+who+' .sup').getAttribute('data-sup'));
		u.setAttribute('data-supadd','1');
	}

	// Check slot limits
	if (document.querySelectorAll('.player .formation .unit').length > 4) {
		buoy.addClass(document.querySelector('.hand'),'noUnit');
	} else { buoy.removeClass(document.querySelector('.hand'),'noUnit'); }
}

function unitCard(newUnit,card,who,id) {
	// Add unit class and type
	buoy.addClass(newUnit,'unit');
	newUnit.setAttribute('id', id);
	newUnit.setAttribute('data-type', card.type);
	newUnit.cardProps = card;

	// Image
	var img = newUnit.appendChild( document.createElement('i') );
	sfx_slide.play();
	addUnit(newUnit,who,card.type);
	sfx_explode.play();
	buoy.addClass(document.querySelector('aside:not(.'+who+')'), 'rumble');

	// Add to history
	addHistory('u',who,card.type);

	// Attributes
	traitList = newUnit.appendChild( document.createElement('ul') );
	for (var i=0;i<cardType.unit[card.type].trait.length;i++) {
		var icon = traitList.appendChild( document.createElement('li') );
		buoy.addClass(icon,'icon-'+cardType.unit[card.type].trait[i]);
	}

	// Check slot limits
	if (document.querySelectorAll('.player .formation .unit').length > 4) {
		buoy.addClass(document.querySelector('.hand'),'noUnit');
	} else { buoy.removeClass(document.querySelector('.hand'),'noUnit'); }

	unitCalc('opponent');
	unitCalc('player');
	window.setTimeout( function() { buoy.removeClass(document.querySelector('aside:not(.'+who+')'), 'rumble'); },600);

	if (who === 'player') forceEndCheck(who);

	if (who!="player") notify(cardType.unit[card.type].trait[0], "<img src='images/cards/unit_"+card.type+".png'> Unit was played");
}

function comboCard(unit,card,who) {
	var slot = document.getElementById(unit).parentNode;
	buoy.addClass(slot,'combo');

	slot.setAttribute('id', card.id);
	if (!slot.getAttribute('data-type')) {
		slot.setAttribute('data-type', card.type);
	} else { slot.setAttribute('data-type2', card.type); }
	if (cardType.combo[card.type].vs) slot.setAttribute('data-vs', cardType.combo[card.type].vs);

	// Image?
	var img = document.createElement("img");
	img.setAttribute('src','images/cards/'+card.type+'.png');
	slot.querySelector('span').appendChild(img);
	sfx_slide.play();
	slot.cardProps = card;

	if (who==='player' && document.querySelector('.hand .cancel')) document.querySelector('.hand .cancel').remove();
	if (who==='player' && document.querySelector('.hand.disable')) buoy.removeClass(document.querySelector('.hand'),'disable');

	if (cardType.combo[card.type].atk) {
		var currentSlotAtk = (slot.getAttribute('data-atk')) ? parseInt( slot.getAttribute('data-atk') ) : 0;
		slot.setAttribute('data-atk', currentSlotAtk+cardType.combo[card.type].atk );
		if (cardType.combo[card.type].atk>0) buoy.addClass(slot,'atk');
	}

	if (cardType.combo[card.type].def) {
		var currentSlotDef = (slot.getAttribute('data-def')) ? parseInt( slot.getAttribute('data-def') ) : 0;
		slot.setAttribute('data-def', currentSlotDef+cardType.combo[card.type].def );
		if (cardType.combo[card.type].def>0) buoy.addClass(slot,'def');
	}

	var currentSlotSup = (slot.getAttribute('data-sup')) ? parseInt( slot.getAttribute('data-sup') ) : 0;
	if (cardType.combo[card.type].sup) {
		slot.setAttribute('data-sup', currentSlotSup+cardType.combo[card.type].sup );
	} else { slot.setAttribute('data-sup', currentSlotSup) }

	if (cardType.combo[card.type].special) {
		specialCombo(card,who);

		// Special combo color slots
		if (card.type==='support') buoy.addClass(slot,'sup');
		if (card.type==='sniper' || card.type==='tstrike' || card.type==='squad') buoy.addClass(slot,'atk');
		if (card.type==='acover') buoy.addClass(slot,'def');
		if (card.type==='intel' || card.type==='stealth' || card.type==='bigguns' || card.type==='barrier') { 
			buoy.addClass(slot,'atk'); 
			buoy.addClass(slot,'def'); 
		}
	} else {
		addHistory('ccc',who,card.type);
		unitCalc('opponent');
		unitCalc('player');
	}

	if (who === 'player' && card.type!='sniper' && card.type!='tstrike' && card.type!='stealth' && card.type!='bigguns') forceEndCheck(who);

	if (who!='player' && !cardType.combo[card.type].special) notify('red', "<img src='images/cards/"+card.type+".png'> Booster was played");
}

function specialCombo(card,who,v) {
	function extraUnit(u,who) {
		// Add .unit inf (with li?) to support combos
		var extra;
		if (!document.querySelector('.'+who+' ul.extra')) {
			extra = document.createElement('ul');
			buoy.addClass(extra,'extra');
			document.querySelector('.'+who).appendChild(extra);
		} else { extra = document.querySelector('.'+who+' ul.extra'); }

		// Add elements
		var extraSlot = extra.appendChild( document.createElement('li') );
		var unit = extraSlot.appendChild( document.createElement('div') );
		unit.appendChild( document.createElement('span') );
		var uid = document.querySelectorAll('.'+who+' ul.extra li').length;
		unit.cardProps = { 'id' : u+'_extra'+uid, 'type' : u };
		unit.setAttribute('id',u+'_extra'+uid);
		buoy.addClass(unit,'unit');
		unit.setAttribute('data-type', u);

		var img = unit.appendChild( document.createElement('i') );
		addUnit(unit,who,u);

		// Attributes
		traitList = unit.appendChild( document.createElement('ul') );
		for (var i=0;i<cardType.unit[u].trait.length;i++) {
			var icon = traitList.appendChild( document.createElement('li') );
			buoy.addClass(icon,'icon-'+cardType.unit[u].trait[i]);
		}

		addUnit(unit,who,u);
		unitCalc('opponent');
		unitCalc('player');

		if (who==='player') forceEndCheck(who);
	}

	function snipe(e) {
		[].forEach.call(document.querySelectorAll('.sticky'), function(note) {
			buoy.addClass( note, 'un');
			window.setTimeout( function() { note.remove(); }, 500);
		});

		// Remove choice
		[].forEach.call(document.querySelectorAll('aside:not(.'+who+') li.active'), function(slot) {
			buoy.removeClass(slot,'active');
			slot.removeEventListener('click', snipe);
		});

		// Kill Card(s)
		clearCombo( e.target );
		var uid = e.target.querySelector('.unit').cardProps.id;
		if ( e.target.querySelector('.unit').killUnit ) e.target.querySelector('.unit').remove();

		// Recalc
		unitCalc('player');
		unitCalc('opponent');
		gapShift(e.target);
		//if (forceEnd!=1) 
		forceEndCheck(who);

		// Send kill
		conn.send( { 
			'func':'specialCombo', 
			'card' : card, 
			'who' : 'opponent', 
			'var' : uid
		});
	}

	function multiplier(card, n,stat,against,trait) {
		var slot = document.getElementById(card.id);
		slot.mBonus = { 
			'count' : n,
			'stat' : stat,
			'who' : against,
			'vs' : trait
		}

		unitCalc('opponent');
		unitCalc('player');
	}

	//console.log('Special Combo! Played by: '+who);
	switch (card.type) {
		// One Star Combos
		case "support":
			document.getElementById(card.id).setAttribute('data-supadd', '2');
			unitCalc('opponent');
			unitCalc('player');

			if (who==='player') forceEndCheck(who);

			break;
		case "sniper":
			// Add listener to kill
			if (who==='player') {
				[].forEach.call(document.querySelectorAll('aside:not(.'+who+') .combo .unit'), function(u) {
					if ( cardType.unit[ u.cardProps.type ].trait.indexOf('grd') != -1 ) {
						buoy.addClass(u.parentNode,'active');
						u.parentNode.addEventListener('click', snipe);
					}
				});

				if (document.querySelectorAll('.opponent .combo.active').length > 0 ) {
					notify('yellow', 'Select an enemy ground unit to snipe a combo off from!', true);
				} else { 
					notify('red', 'There was nothing to snipe from.'); 
					if (who==='player') forceEndCheck(who);
				}
				
			} else {
				if (v) {
					clearCombo( document.getElementById(v).parentNode );
				}
				// Recalc
				unitCalc('player');
				unitCalc('opponent');
			}
			addHistory('ccc',who,card.type);
			break;
		case "retreat":
			function retreat(e) {
				buoy.addClass( document.querySelector('.sticky'), 'un');
				window.setTimeout( function() { document.querySelector('.un.sticky').remove(); }, 500);

				// Set some variables
				var unit = e.target.querySelector('.unit').cardProps.id
				var uCard = e.target.querySelector('.unit').cardProps;

				// Check if combo is support first, and clear those supplies
				if (e.target.getAttribute('data-type')==='support') {
					var currentSup = parseInt(document.querySelector('.'+who+' .sup').getAttribute('data-sup'));
					document.querySelector('.'+who+' .sup').setAttribute('data-sup', currentSup-2);
				}

				// Check if unit was APC
				if (e.target.querySelector('.unit').getAttribute('data-type')==='apc') {
					var currentSup = parseInt(document.querySelector('.'+who+' .sup').getAttribute('data-sup'));
					document.querySelector('.'+who+' .sup').setAttribute('data-sup', currentSup-1);
				}

				// Remove unit and combo
				e.target.querySelector('.unit').remove();
				clearCombo(e.target);

				// Add unit back to hand
				drawCardConfirmed(uCard,0);

				// Collapse formation
				e.target.parentNode.appendChild( e.target );

				// Reset junk
				[].forEach.call(document.querySelectorAll('.'+who+' li'), function(slot) {
					if (buoy.hasClass(slot,'active')) buoy.removeClass(slot,'active');
					slot.removeEventListener('click', retreat);
				});

				if (tutDeck && buoy.hasClass(document.querySelector('.hand'),'disable')) buoy.removeClass(document.querySelector('.hand'),'disable');

				// Check slot limits
				if (document.querySelectorAll('.player .formation .unit').length < 5) {
					if (buoy.hasClass(document.querySelector('.hand'),'noUnit')) buoy.removeClass(document.querySelector('.hand'),'noUnit'); 
				}

				// Recalc and send
				unitCalc('player');
				unitCalc('opponent');
				forceEndCheck(who);

				if (conn) conn.send( { 
					'func':'specialCombo', 
					'card' : card, 
					'who' : 'opponent', 
					'var' : unit
				});
			}

			if (document.querySelectorAll('.player .unit').length === 0) {
				notify('red','No units on field to play this on!');
				window.setTimeout( function() { 
					buoy.removeClass(document.querySelector('.hand'),'disable'); 
				}, 500);
				return false;
			}

			if (who==='player') {
				document.getElementById(card.id).remove();

				// Make all cards active
				[].forEach.call(document.querySelectorAll('.'+who+' .unit'), function(unit) {
					var slot = unit.parentNode;
					buoy.addClass(slot,'active');
					// Add listener to redeck whatever card is clicked
					slot.addEventListener('click', retreat);
				});

				notify('yellow','Select a unit to retreat! (Booster attached to unit will be discarded)', true);
			} else if (who!='player' && v) {
				// Remove unit
				console.log(v);
				var unit = document.getElementById(v);
				var slot = unit.parentNode;
				
				// Check if combo is support first, and clear those supplies
				if (slot.getAttribute('data-type')==='support') {
					var currentSup = parseInt(document.querySelector('.opponent .sup').getAttribute('data-sup'));
					document.querySelector('.opponent .sup').setAttribute('data-sup', currentSup-2);
				}

				// Check if unit was APC
				if (unit.getAttribute('data-type')==='apc') {
					var currentSup = parseInt(document.querySelector('.opponent .sup').getAttribute('data-sup'));
					document.querySelector('.opponent .sup').setAttribute('data-sup', currentSup-1);
				}

				// Clear stuff
				clearCombo(unit.parentNode);
				unit.remove();
				slot.parentNode.appendChild( slot );
				// Recalc
				unitCalc('player');
				unitCalc('opponent');
				forceEndCheck(who);
			}
			break;
		case "shift":
			if (who==='player') {
				document.getElementById(card.id).remove();
				document.querySelector('.turn').setAttribute('disabled','true');
				var moves = [];

				function dirListener(e) {
					var btnClass = ( buoy.hasClass(e.target,'up') ) ?  'up' : 'down';
					var field = e.target.parentNode.parentNode;
					var li = e.target.parentNode;
					var liPrev = e.target.parentNode.previousElementSibling;
					var liNext = e.target.parentNode.nextElementSibling;

					if (btnClass === 'up') {
						if ( liPrev && liPrev.querySelector('.unit') ) {
							field.insertBefore(li,liPrev);
							moves.push( {'btn' : btnClass, 'id' : e.target.unitID} );
						}
					} else {
						if ( liNext && liNext.querySelector('.unit') ) {
							field.insertBefore(liNext,li);
							moves.push( {'btn' : btnClass, 'id' : e.target.unitID} );
						}
					}
				}

				function finishShift(e) {
					console.log(moves)
					e.target.removeEventListener('click', dirListener);
					e.target.remove();

					// Done button iterates through all units and removes
					// the up/down buttons, then sends command to opponent
					[].forEach.call(document.querySelectorAll('.'+who+' li button'), function(btn) {
						btn.removeEventListener('click', dirListener);
						btn.remove();
					});

					document.querySelector('.turn').removeAttribute('disabled');
					if (who==='player') {
						conn.send( { 'func':'specialCombo', 'card' : card, 'who' : 'opponent', 'var' : moves } );
						forceEndCheck(who);
					}
				}

				// Iterate through each unit and add up/down buttons
				[].forEach.call(document.querySelectorAll('.'+who+' .unit'), function(el) {
					var up = el.parentNode.appendChild( document.createElement('button') );
					buoy.addClass(up,'up');
					var down = el.parentNode.appendChild( document.createElement('button') );
					buoy.addClass(down,'down');

					up.unitID = el.parentNode.querySelector('.unit').cardProps.id;
					down.unitID = el.parentNode.querySelector('.unit').cardProps.id;

					up.addEventListener('click', dirListener);
					down.addEventListener('click', dirListener);
				});
				
				// Add button for "DONE"
				var done = document.querySelector('.'+who).appendChild( document.createElement('button') );
				done.textContent = 'Done';
				done.addEventListener('click', finishShift);
			} else if (who==='opponent' && v) {
				// Replays moves
				var moves = v;
				for (var i=0;i<moves.length;i++) {
					var u = document.getElementById(moves[i].id).parentNode;
					var uP = document.getElementById(moves[i].id).parentNode.parentNode;

					if (moves[i].btn === 'up') {
						uP.insertBefore(u,u.previousElementSibling);
					} else {
						uP.insertBefore(u.nextElementSibling,u);
					}
				}
			}

			break;
		case "reinforce":
			if (who==='player') {
				document.getElementById(card.id).remove();

				if (!tutDeck) { drawCard(playerDeck,3); } else {
					window.setTimeout( function() { 
						buoy.removeClass(document.querySelector('.hand'),'disable'); 
					}, 1000);
					
					drawCardConfirmed(tutDeck.pop(),100);
					drawCardConfirmed(tutDeck.pop(),200);
					drawCardConfirmed(tutDeck.pop(),300);
				}

				forceEndCheck(who);
				if (conn) conn.send( { 
					'func':'specialCombo', 
					'card' : card, 
					'who' : 'opponent'
				});
			}
			break;
		// 2 Star Combo
		case "intel":
			// Use notification to display all of opponent's units
			if (who==='player') {
				//conn.send( { 'func':'specialCombo', 'card' : card, 'who' : 'opponent' } );
			} else {
				var cards = "";

				[].forEach.call(document.querySelectorAll('.hand .card'), function(card) {
					var pre = '';
					if ( cardType.unit[card.type] ) { pre = 'unit_'; }
					else if ( cardType.co[card.type] ) { pre = 'co_'; }

					cards+= "<img src='images/cards/"+pre+card.cardProps.type+".png'>";
				});

				conn.send( { 'func' : 'notify', 'type': 'green', 'msg' : cards });
			}
			break;
		case "stealth":
			extraUnit('infantry',who);
			break;
		// 3 Star Combo
		case "barrier":
			// Apparently it's automatic?
			break;
		case "squad":
			multiplier(card, 1,'atk','player','inf');
			if (who==='player') forceEndCheck(who);
			break;
		case "acover":
			multiplier(card, 2,'def','opponent','air');
			if (who==='player') forceEndCheck(who);
			break;
		case "bigguns":
			extraUnit('tank',who);
			break;
		case "tstrike":
			// Add listener to kill
			if (who==='player') {
				[].forEach.call(document.querySelectorAll('aside:not(.'+who+') .unit'), function(u) {
					if ( cardType.unit[ u.cardProps.type ].trait.indexOf('grd') != -1 ) {
						buoy.addClass(u.parentNode,'active');
						u.killUnit = true;
						u.parentNode.addEventListener('click', snipe);
					}
				});
				notify('yellow', 'Select an enemy ground unit to strike and remove from play!', true);
			} else {
				if (v) {
					clearCombo( document.getElementById(v).parentNode );
					document.getElementById(v).remove();
					gapShift( document.getElementById(v).parentNode );
				}
				// Recalc
				unitCalc('player');
				unitCalc('opponent');
			}
			addHistory('ccc',who,card.type);
			break;
	}

	if (who==='player' && document.querySelector('.hand .cancel')) document.querySelector('.hand .cancel').remove();
	if (card.type != 'sniper' && card.type != 'tstrike') addHistory('ccc',who,card.type);
	if (who!='player') notify('red', "<img src='images/cards/"+card.type+".png'> Combo was played");
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
	var unitAtk = 0;
	var unitDef = 0;
	var currentSupUse = 0;
	var currentSup = parseInt( supSpan.getAttribute('data-supplayed') );
	var supBonus = 0;

	// Add bonus supplies (APC/Support)
	[].forEach.call(document.querySelectorAll('.'+who+' div[data-supadd], .'+who+' li[data-supadd]'), function(sEl) {
		supBonus += parseInt( sEl.getAttribute('data-supadd') );
	});

	// Checks every unit on field
	[].forEach.call(document.querySelectorAll('.'+who+' .unit'), function(el) {
		// Add attack
		if ( cardType.unit[el.getAttribute('data-type')].atk ) {
			unitAtk += parseInt( cardType.unit[el.getAttribute('data-type')].atk );
		}
		// Add defense
		if ( cardType.unit[el.getAttribute('data-type')].def ) {
			unitDef += parseInt( cardType.unit[el.getAttribute('data-type')].def );
		}
		
		// If unit has a bonus
		if ( cardType.unit[el.getAttribute('data-type')].bonus ) {
			var bonusTrait = cardType.unit[el.getAttribute('data-type')].bonus;
			var thisBonus = 0;
			// Check all enemy units...
			[].forEach.call(document.querySelectorAll('aside:not(.'+who+') .unit'), function(em) {
				// ...and see if they have a trait matching the bonus trait
				if ( cardType.unit[em.getAttribute('data-type')].trait.indexOf( bonusTrait[1] ) != -1  ) {
					thisBonus = parseInt(bonusTrait[0]);
				}
			});

			if (thisBonus > 0 && !buoy.hasClass(el,'bonus') ) buoy.addClass(el,'bonus');
			bonusTotal += thisBonus;
		}

		// If unit has combo attached
		if ( buoy.hasClass(el.parentNode,'combo') ) {
			if (el.parentNode.getAttribute('data-atk')) { 
				// If combo does not require specific enemy
				if (!el.parentNode.getAttribute('data-vs')) {
					comboAtkTotal += parseInt(el.parentNode.getAttribute('data-atk'));
				} else {
					// If it does, only add if that enemy is present
					var vsPresent = false;
					var vsVar = el.parentNode.getAttribute('data-vs');
					[].forEach.call(document.querySelectorAll('aside:not(.'+who+') .unit'), function(eUnit) {
						if (cardType.unit[eUnit.getAttribute('data-type')].trait.indexOf(vsVar) != -1) vsPresent = true;
					});

					if (vsPresent) comboAtkTotal += parseInt(el.parentNode.getAttribute('data-atk'));
				}
			}
			if (el.parentNode.getAttribute('data-def')) comboDefTotal += parseInt(el.parentNode.getAttribute('data-def'))

			currentSupUse += parseInt(el.parentNode.getAttribute('data-sup'));

			// Check for special combos with multiplier bonuses
			if (el.parentNode.mBonus) {
				var bonus = 0;
				var realwho = (el.parentNode.mBonus.who === 'player' && who === 'player') ? 'player' : 'opponent' ;
				// Check each unit of "who" ...
				[].forEach.call(document.querySelectorAll('.'+realwho+' .formation .unit'), function(u) {
					// ...for the "vs" trait, and if so, add by count amount
					if (cardType.unit[u.cardProps.type].trait.indexOf( el.parentNode.mBonus.vs ) != -1) bonus += el.parentNode.mBonus.count;
				});

				if (el.parentNode.mBonus.stat === 'atk') {
					comboAtkTotal += bonus;
				} else { comboDefTotal += bonus; }
			}
		}

		unitTraits.push(cardType.unit[el.getAttribute('data-type')].trait);
	});

	[].forEach.call(document.querySelectorAll('.'+who+' .formation .unit'), function(el) {
		// Add supply cost
		currentSupUse += parseInt(cardType.unit[el.getAttribute('data-type')].sup);
	});

	// Add in the Commander bonus
	if (document.querySelector('.'+who+' .commander')) {
		var comm = document.querySelector('.'+who+' .commander');

		for (var i=0;i<unitTraits.length;i++) {
			if ( unitTraits[i].indexOf( comm.bonus[1] ) != -1 || comm.bonus[1] === "any" ) {
				if ( comm.bonus[2] === 'atk') commAtkBonus += comm.bonus[0]
				if ( comm.bonus[2] === 'def') commDefBonus += comm.bonus[0]

				if (comm.bonus2) {
					if (unitTraits[i].indexOf( comm.bonus2[1] ) != -1 || comm.bonus2[1] === "any") {
						if ( comm.bonus2[2] === 'atk') commAtkBonus += comm.bonus2[0]
						if ( comm.bonus2[2] === 'def') commDefBonus += comm.bonus2[0]
						if ( comm.bonus2[2] === 'sup') supBonus += comm.bonus2[0]
					}
				}
			} 
		}
	}

	//console.log('Bonus Total: '+bonusTotal);
	var unitBonus = bonusTotal+parseInt(atkSpan.getAttribute('data-bonus') );

	atkSpan.innerHTML = unitAtk + unitBonus + comboAtkTotal + commAtkBonus;
	atkSpan.setAttribute('data-unit', unitAtk);

	defSpan.innerHTML = unitDef + comboDefTotal + commDefBonus;
	defSpan.setAttribute('data-unit', unitDef);
	
	currentSup += supBonus;
	supSpan.setAttribute('data-supuse', currentSupUse);
	supSpan.setAttribute('data-sup', currentSup);
	supSpan.textContent = supSpan.getAttribute('data-supuse')+'/'+currentSup;
}

// =================================
// --------- UI FUNCTIONS ----------
// =================================

//Activate Overlay
function overlayOn() {
	var o = document.querySelector('.overlay');
	buoy.addClass(o,'active');
}

// Add to history

function addHistory(v,who,type) {
	var block = document.createElement('div');
	document.querySelector('.history').prependChild(block);
	buoy.addClass(block,v);

	switch (v) {
		case 'sup':
			block.style.backgroundImage = "url('images/cards/supply.png')";
			break;
		case 'u':
			block.style.backgroundImage = "url('images/units/"+type+".png')";
			break;
		case 'ccc':
			block.style.backgroundImage = "url('images/cards/"+type+".png')";
			break;
		case 'comm':
			block.style.backgroundImage = "url('images/misc/"+type+".png')";
			break;
		case 'endt':
			block.textContent = 'End Turn';
			break;
		case 'endr':
			block.textContent = type;
			var txt = (type==="Won Round") ? "win" : "loss";
			buoy.addClass(block,txt);
			break;
		case 'expand':
			break;
		case 'counter':
			block.textContent = 'Counter Attack';
			break;
		case 'swap':
			block.textContent = 'Swap 3';
			break;
	}

	block.setAttribute('data-who',who);
	if (attacker && who === "player" || !attacker && who === "opponent") { 
		block.setAttribute('data-atk','yes'); 
	} else { block.setAttribute('data-atk','no'); }
}

// Places a second+ unit on the field after choosing formation spot
function placeUnit(pos, card, who, id) {
	var newUnit;

	if (pos === 'prev') {
		var firstUnit = document.querySelectorAll('.opponent .formation .unit')[0];
		newUnit = firstUnit.parentNode.previousElementSibling.appendChild( document.createElement('div') );
	} else {
		var lastUnit = document.querySelectorAll('.opponent .formation .unit')[document.querySelectorAll('.opponent .formation .unit').length-1];
		newUnit = lastUnit.parentNode.nextElementSibling.appendChild( document.createElement('div') );
	}
	
	unitCard(newUnit, card, who, id);
	smartShift('opponent');
}

// Shifts unit formation up or down depending if close to the edge
function smartShift(who) {
	if (document.querySelectorAll('.'+who+' .formation .unit').length === 3) {
		// Unit was added on the top side, bring bottom, empty li to top to center formation
		if ( document.querySelector('.'+who+' .formation > li:first-child').children.length > 1 ) {
			var lastLi = document.querySelector('.'+who+' .formation > li:last-child');
			document.querySelector('.'+who+' ul.formation').prependChild(lastLi);
		} 
		// or do the opposite for bottom
		else if ( document.querySelector('.'+who+' .formation > li:last-child').children.length > 1 ) {
			var firstLi = document.querySelector('.'+who+' .formation > li:first-child');
			document.querySelector('.'+who+' ul.formation').appendChild(firstLi);
		}
	} 
	// Add empty li to opposite side of end with unit
	else if (document.querySelectorAll('.'+who+' .formation .unit').length === 4 && document.querySelectorAll('.'+who+' .formation > li').length<6) {
		var li = document.createElement('li');
		if ( document.querySelector('.'+who+' .formation > li:first-child').children.length > 1 ) {
			console.log('Prepending...', li);
			document.querySelector('.'+who+' ul.formation').prependChild( li );
		}
		else if ( document.querySelector('.'+who+' .formation > li:last-child').children.length > 1 ) {
			console.log('Appending...', li);
			document.querySelector('.'+who+' ul.formation').appendChild( li );
		}
		li.appendChild( document.createElement('span') );

	} else if (document.querySelectorAll('.'+who+' .formation .unit').length === 5 && document.querySelector('.'+who+' .formation > li span:only-child')) {
		var emptyLi = document.querySelector('.'+who+' .formation > li span:only-child').parentNode;
		emptyLi.parentNode.removeChild(emptyLi);
	}
}

// Shifts units if gap created in the middle
function gapShift(slot) {
	slot.parentNode.appendChild(slot);
}

// Notification messages within the game
function notify(type, msg, sticky) {
	var bubble = document.querySelector('.notifyList').appendChild( document.createElement('div') );
	bubble.innerHTML = msg;
	buoy.addClass(bubble, 'notify');
	buoy.addClass(bubble, type);

	if (!sticky) { window.setTimeout( function() { bubble.remove(); }, 4200); }
	else { buoy.addClass(bubble, 'sticky'); }
}

// Clear a slot of its combo
function clearCombo(el) {
	el.setAttribute('class','');
	el.removeAttribute('data-atk');
	el.removeAttribute('data-def');
	el.removeAttribute('data-sup');
	el.removeAttribute('data-supadd');
	el.removeAttribute('data-type');
	el.removeAttribute('id');
	if (el.getAttribute('data-type2')) el.removeAttribute('data-type2');
	if (el.mBonus) el.mBonus = null;

	if (el.querySelector('span').firstElementChild) el.querySelector('span').firstElementChild.remove();
	// Double check for a 2nd combo (Barrier)
	if (el.querySelector('span').firstElementChild) el.querySelector('span').firstElementChild.remove();
}


// -------------------
// Card Animations
// -------------------

// Animate a redecked card
function cardToDeck(card) {
	if (card.nodeName != 'DIV') return false;
	buoy.addClass(card,'toDeck');
	window.setTimeout( function() { card.remove(); }, 1500);
}

// Animate a discarded card
function cardToDiscard(card) {
	buoy.addClass(card,'toDiscard');
	window.setTimeout( function() { card.remove(); }, 500);
}

function addSupply(who) {
	var h1 = document.querySelector('.'+who+' > h1');
	h1.offsetWidth = h1.offsetWidth; 

	window.requestAnimationFrame( function() {
		buoy.addClass(h1,'addSup');
	}); 

	window.setTimeout( function() { 
		buoy.removeClass(h1,'addSup');
		h1.offsetWidth = h1.offsetWidth; 
	}, 1300);
}

// -------------------

// Use at the end of the round to wipe/add scores and reset field
function resetField(points,loser,retreat) {
	// Remove extra side units?
	if (document.querySelector('.player ul.extra')) document.querySelector('.player ul.extra').remove();
	if (document.querySelector('.opponent ul.extra')) document.querySelector('.opponent ul.extra').remove()

	// Reset units, auto save if one unit
	if (document.querySelectorAll('.player .unit').length === 1) {
		redeckCard(playerDeck,[document.querySelector('.player .unit').cardProps],false);
		// Redeck combo if it exists
		if (!loser && document.querySelector('.player .combo')) {
			var pCombo = document.querySelector('.player .combo');
			redeckCard(playerDeck,[pCombo.cardProps],false);
			clearCombo(pCombo);
		}

		if (loser) {
			[].forEach.call(document.querySelectorAll('.player .combo'), function(el) {
				clearCombo(el);
			});
		}

		window.setTimeout( function() {
			unitCalc('player');
			unitCalc('opponent');
		}, 1600);
	} 
	// More than one unit
	else {
		function chooseListener(e) {
			buoy.addClass( document.querySelector('.sticky'), 'un');
			window.setTimeout( function() { document.querySelector('.un.sticky').remove(); }, 500);

			var o = e.target;
			var objType;
			buoy.removeClass( document.querySelector('.hand'), 'disable');
			if (o.nodeName==='DIV') { objType = 'unit' } else { objType = 'combo' }

			redeckCard(playerDeck,[o.cardProps],false);

			[].forEach.call(document.querySelectorAll('.player .active.'+objType), function(obj) {
				// Kill Listeners
				obj.removeEventListener('click', chooseListener);
				if(objType === 'unit' && obj != o) {
					obj.remove();
				} else if(objType === 'combo') {
					clearCombo(obj);
				}
			});

			window.setTimeout( function() {
				unitCalc('player');
				unitCalc('opponent');
			}, 1600);
		}

		// Loser gets to save one
		if (loser && !retreat) {
			buoy.addClass( document.querySelector('.hand'), 'disable');
			if (document.querySelectorAll('.player .unit').length > 1) notify('yellow',"Choose <strong>1</strong> of your units to retreat into your deck", true);

			// Choose unit
			[].forEach.call(document.querySelectorAll('.player .unit'), function(unit) {
				buoy.addClass(unit, 'active');
				unit.addEventListener('click', chooseListener);
			});

			// Discard all combos
			[].forEach.call(document.querySelectorAll('.player .combo'), function(el) {
				clearCombo(el);
			});
		} 
		// Winner saves all
		else if (!loser || retreat) { 
			var saveUnits = [];

			[].forEach.call(document.querySelectorAll('.player .unit'), function(el) {
				saveUnits.push(el.cardProps);
			});

			if (!tutDeck) redeckCard(playerDeck,saveUnits,false);
			if (tutDeck) redeckCard(tutDeck,saveUnits,false);

			window.setTimeout( function() {
				unitCalc('player');
				unitCalc('opponent');
			}, 1600);
		}

		// Auto save 1 combo, if not, also add selectors
		if (!loser && document.querySelectorAll('.player .combo').length === 1) {
			//console.log('2+ Units, 1 Combo');

			var onlyCombo = document.querySelector('.player .combo');
			if (!tutDeck) redeckCard(playerDeck,[onlyCombo.cardProps],false);

			clearCombo(onlyCombo);

			window.setTimeout( function() {
				unitCalc('player');
				unitCalc('opponent');
			}, 1600);
		} 
		else if (!loser && document.querySelectorAll('.player .combo').length > 1) {
			//console.log('Multiple units, 1+ Combo');

			notify('yellow',"Choose <strong>1</strong> of your combos to retreat into your deck", true);

			[].forEach.call(document.querySelectorAll('.player .combo'), function(combo) {
				buoy.addClass(combo, 'active');
				combo.addEventListener('click', chooseListener);
			});
		} 
	}

	if (document.querySelectorAll('.player .formation > li').length>5) {
		document.querySelector('.player .formation > li:first-child').remove();
	}

	if (document.querySelectorAll('.opponent .formation > li').length>5) {
		document.querySelector('.opponent .formation > li:first-child').remove();
	}

	// Reset stats
	function wipeStats(who) {
		if (who==="opponent") {
			[].forEach.call(document.querySelectorAll('.opponent .unit'), function(unit) {
				unit.remove();
			});

			[].forEach.call(document.querySelectorAll('.opponent .combo'), function(combo) {
				clearCombo(combo);
			});

			unitCalc('opponent');
		}

		document.querySelector('.'+who+' .atk').setAttribute('data-unit','0');
		document.querySelector('.'+who+' .def').setAttribute('data-bonus','0');

		document.querySelector('.'+who+' .def').setAttribute('data-unit','0');
		document.querySelector('.'+who+' .atk').setAttribute('data-bonus','0');

		document.querySelector('.'+who+' .sup').setAttribute('data-sup','0');
		document.querySelector('.'+who+' .sup').setAttribute('data-supuse','0');
		document.querySelector('.'+who+' .sup').setAttribute('data-supplayed','0');
		if (document.querySelector('.'+who+' .commander')) document.querySelector('.'+who+' .commander').remove();
	}

	// Declare Loss
	if (loser) {
		console.log('Lost');
		var a = parseInt(document.querySelector('.opponent .atk').textContent);
		var d = parseInt(document.querySelector('.player .def').textContent);

		var winMsg;
		if (attacker && a > d) {
			'<img src="images/cards/outpost.png"> You win round AND counter-attacked! You take points!'; }
		else if (attacker && a <= d) { 
			'You defended successfully, you win round'; 
		} else { 'You won round'; }

		conn.send({ 'func':'notify', 'type':'green', 'msg': winMsg });
		conn.send({ 'func':'win', 'points': points });

		if (!attacker || (attacker && a > d) ) {
			if (attacker && a>d) { 
				notify('red', 'Lost Round AND Counter-attacked! Opponent gets points!'); 
				addHistory('counter','opponent');
			} else { notify('red', 'Lost Round'); }
			var currentPts = (document.querySelector('.opponent .outpost').textContent) ? parseInt(document.querySelector('.opponent .outpost').textContent) : 0;
			document.querySelector('.opponent .outpost').textContent = currentPts + points;
		}

		// Check if 6 outposts were captured by opponent
		if (parseInt(document.querySelector('.opponent .outpost').textContent) >= 6) { endGame('loser'); }
	}

	wipeStats('player');
	wipeStats('opponent');
	expanded = 0;

	// Auto draw cards
	if (document.querySelectorAll('.hand .card').length<8) {
		if (!tutDeck) drawCard(playerDeck,8-document.querySelectorAll('.hand .card').length);
	} else { if (!tutDeck) drawCard(playerDeck,1); }

	// Check hand
	reshuffleCheck();

	// Swap attacker status
	if (!attacker) {
		attacker = true;
		buoy.addClass(document.querySelector('.player'), 'attacker');
		buoy.removeClass(document.querySelector('.opponent'), 'attacker');
	} else { 
		buoy.removeClass(document.querySelector('.player'), 'attacker');
		buoy.addClass(document.querySelector('.opponent'), 'attacker');
		attacker = false;
		notify('yellow', "Opponent's Turn as Attacker");
		if ( document.querySelector('.turn') ) document.querySelector('.turn').setAttribute('disabled','true');
		if ( document.querySelector('.end') ) document.querySelector('.end').setAttribute('disabled','true');

		// Tell opponent it's his turn
		if (conn) conn.send( { 'func':'yourTurn', 'var' : true } );
		myTurn = false;
		if (loser) addHistory('endr','player','Lost Round');
		buoy.removeClass(document.querySelector('.player'),'myturn');
		buoy.addClass(document.querySelector('.hand'),'disable');
	}
}

// Swap 3 cards at the beginning of your turn
function swapThree(dontdoit) {
	if (document.querySelector('.turn')) document.querySelector('.turn').setAttribute('disabled','true');
	if (document.querySelector('.end')) document.querySelector('.end').setAttribute('disabled','true');
	forceEnd = false;

	if (dontdoit) return false;
	var count = 0;
	var noUnit = (buoy.hasClass(document.querySelector('.hand'),'noUnit')) ? true : false;

	function chooseThree(e) {
		if (count<= 3) {
			if ( buoy.hasClass(e.target, 'active') ) {
				buoy.removeClass(e.target, 'active');
				count = document.querySelectorAll('.card.active').length;
			} 
			else if ( !buoy.hasClass(e.target, 'active') && count<3 ) { 
				buoy.addClass(e.target, 'active');
				count = document.querySelectorAll('.card.active').length;
			}
		}
	}

	function finishSwap() {
		if (count === 3 || count === 0) {
			buoy.addClass( document.querySelector('.sticky'), 'un');
			window.setTimeout( function() { document.querySelector('.un.sticky').remove(); }, 500);
			if (count === 3) addHistory('swap','player');
			forceEnd = 0;
		} else {
			notify('yellow', 'Choose 3 cards (or none), then hit done.');
			return false;
		}

		[].forEach.call(document.querySelectorAll('.game .card'), function(card) {
			card.removeEventListener('click', chooseThree);
			buoy.removeClass(card, 'choose');

			// Swap cards
			if (count === 3 || count === 0) {
				if ( buoy.hasClass(card, 'active') ) {
					if (!tutDeck) redeckCard(playerDeck, [card.cardProps], true);
					if (tutDeck) simpleRedeck(tutDeck, [card.cardProps], true);
					cardToDiscard(card);
				} else {
					card.addEventListener('click', playListener);
				}
			} else {
				card.addEventListener('click', playListener);
			}
		});	

		//document.querySelector('.turn').removeAttribute('disabled');
		if (document.querySelector('.end')) document.querySelector('.end').removeAttribute('disabled');
		if (count===3 && conn) {
			conn.send( { 'func':'notify', 'type' : 'yellow', 'msg' : 'Opponent swapped 3 cards' } );
			conn.send( { 'func':'log', 'type' : 'swap', 'who' : 'player' })
		}

		done.removeEventListener('click', finishSwap);
		done.remove();
		done = null;

		if (noUnit) { buoy.addClass(document.querySelector('.hand'),'noUnit') }
	}

	[].forEach.call(document.querySelectorAll('.game .card'), function(card) {
		buoy.addClass(card, 'choose');
		card.removeEventListener('click', playListener);
		card.addEventListener('click', chooseThree);
	});

	// Add button for "DONE"
	var done = document.querySelector('.player').appendChild( document.createElement('button') );
	done.textContent = 'Done';
	buoy.removeClass(document.querySelector('.hand'),'noUnit')
	done.addEventListener('click', finishSwap);

	notify('yellow', 'Choose 3 cards to swap out, or choose none, and hit done.', true)
}

 // Swaps player's turn
function endTurnListener(e) {
	console.log('Ending Turn');
	buoy.addClass( document.querySelector('.sticky'), 'un');
	window.setTimeout( function() { document.querySelector('.un.sticky').remove(); }, 500);

	var endTurn = document.querySelector('.turn');
	if (myTurn){
		// If it is your turn, disable buttons and turn
		myTurn = false;
		buoy.removeClass( document.querySelector('.player'), 'myturn');
		endTurn.setAttribute('disabled','true');
		document.querySelector('.end').setAttribute('disabled','true');

		// Auto draw cards
		if (document.querySelectorAll('.hand .card').length<8) {
			drawCard(playerDeck,8-document.querySelectorAll('.hand .card').length);
		} else { drawCard(playerDeck,1); }

		// Add to history
		addHistory('endt','player');

		// Tell opponent it's his turn
		conn.send( { 'func':'yourTurn', 'var' : false } );
		buoy.addClass(document.querySelector('.hand'),'disable');
		notify('red', 'Ended Turn');
		forceEnd = 0;
	}
}

// Check if match/surpass, if so play 1 more card (or auto end turn if already played)
function forceEndCheck(who) {
	window.setTimeout( function(){
		if (myTurn) {
			console.log('Checking if end needs to be force...');
			console.log('Player ATK/DEF: '+document.querySelector('.player .atk').textContent+'/'+document.querySelector('.player .def').textContent);
			console.log('Opponent ATK/DEF: '+document.querySelector('.opponent .atk').textContent+'/'+document.querySelector('.opponent .def').textContent);
			if (attacker) {
				// Attacker's atk is greater than Defenders def
				if (parseInt(document.querySelector('.'+who+' .atk').textContent) > parseInt(document.querySelector('aside:not(.'+who+') .def').textContent)) {
					forceEnd += 1;
					if (forceEnd===1) { 
						notify('red', 'Enemy defense surpassed! Play 1 more card & your turn will end (or end it now)', true);
						window.setTimeout( function() { sfx_explode2.play(); }, 400 );
						buoy.addClass(document.querySelector('aside:not(.'+who+')'), 'rumbleHard');
						window.setTimeout( function() { buoy.removeClass(document.querySelector('aside:not(.'+who+')'), 'rumbleHard'); },600);
						document.querySelector('.turn').removeAttribute('disabled');
					}
				}
			} else {
				// Defenders def is greater than or equal to Attacker's atk
				if (parseInt(document.querySelector('.'+who+' .def').textContent) >= parseInt(document.querySelector('aside:not(.'+who+') .atk').textContent)) {
					forceEnd += 1;
					if (forceEnd===1) { 
						notify('blue', 'Enemy attack matched/surpassed! Play 1 more card & your turn will end (or end it now)', true);
						window.setTimeout( function() { sfx_explode2.play(); }, 400 );
						buoy.addClass(document.querySelector('aside:not(.'+who+')'), 'rumbleHard');
						window.setTimeout( function() { buoy.removeClass(document.querySelector('aside:not(.'+who+')'), 'rumbleHard'); },600);
						document.querySelector('.turn').removeAttribute('disabled');
					}
				}
			}
			//console.log('Force End now at: '+forceEnd);
			if (forceEnd===1) {
				if (document.querySelector('.end')) document.querySelector('.end').setAttribute('disabled','true');
			} else if (forceEnd>1) { 
				if (!tutDeck) endTurnListener(); 
				if (tutDeck) endTutTurnListener();
			} 
		}
	}, 350);
}

// Call out winner/loser
function endGame(who,sup) {
	overlayOn();
	var m = document.querySelector('.overlay .modal');
	var x = (sup===1) ? "Ran out of supplies. " : "";

	if (who === 'loser') {
		m.innerHTML = "<img src='images/misc/loss.png' style='display:block;margin:0 auto 10px;' /> <h2>"+x+"</h2> <button disabled>Quit Game</button>"
		// Tell opponent they won
		conn.send({ 'func': 'endgame', 'who': 'winner' });
	} else {
		m.innerHTML = "<img src='images/misc/win.png' style='display:block;margin:0 auto 10px;' /> <button disabled>Quit Game</button>"
	}

	window.setTimeout( function () { m.querySelector('button').removeAttribute('disabled') }, 2000);

	m.querySelector('button').addEventListener( 'click', function() {
		peer.destroy();
	});
}

// Manually wipe everything
function wipeGame() {
	// Reset Stats
	document.querySelector('.player .atk').textContent = '0';
	document.querySelector('.player .def').textContent = '0';
	document.querySelector('.player .sup').textContent = '0';
	document.querySelector('.player .outpost').textContent = '';

	document.querySelector('.opponent .atk').textContent = '0';
	document.querySelector('.opponent .def').textContent = '0';
	document.querySelector('.opponent .sup').textContent = '0';
	document.querySelector('.opponent .outpost').textContent = '';

	myTurn = null;

	[].forEach.call(document.querySelectorAll('span[data-unit]'), function(span) {
		span.setAttribute('data-unit', 0);
	});

	[].forEach.call(document.querySelectorAll('span[data-bonus]'), function(span) {
		span.setAttribute('data-bonus', 0);
	});

	[].forEach.call(document.querySelectorAll('span[data-sup]'), function(span) {
		span.setAttribute('data-sup', 0);
	});

	[].forEach.call(document.querySelectorAll('span[data-supuse]'), function(span) {
		span.setAttribute('data-supuse', 0);
	});

	[].forEach.call(document.querySelectorAll('span[data-supadd]'), function(span) {
		span.setAttribute('data-supadd', 0);
	});

	[].forEach.call(document.querySelectorAll('span[data-supplayed]'), function(span) {
		span.setAttribute('data-supplayed', 0);
	});

	[].forEach.call(document.querySelectorAll('.history div'), function(div) {
		div.remove();
	});

	// Clear game variables
	document.querySelector('.game').setAttribute('class', 'game');
	document.querySelector('.player').setAttribute('class', 'player');
	document.querySelector('.opponent').setAttribute('class', 'opponent');
	document.querySelector('.hand').setAttribute('class', 'hand');

	// Remove units, cards, combos, etc.
	[].forEach.call(document.querySelectorAll('.game .card'), function(card) {
		card.remove();
	});

	[].forEach.call(document.querySelectorAll('.game .unit'), function(unit) {
		unit.remove();
	});

	[].forEach.call(document.querySelectorAll('.game .combo'), function(slot) {
		slot.setAttribute('class','');
		slot.removeAttribute('id');
		if (slot.mBonus) slot.mBonus = null;
		slot.querySelector('img').remove();
	});

	if (document.querySelector('.commander')) document.querySelector('.commander').remove();
	if (document.querySelector('.sticky')) document.querySelector('.sticky').remove();
	if (document.querySelector('.bubble')) document.querySelector('.bubble').remove();
	if (document.querySelector('.end')) document.querySelector('.end').remove();
	if (document.querySelector('.turn')) document.querySelector('.turn').remove();
	if (document.querySelector('.player button')) document.querySelector('.player button').remove();
	// Remove extra side units?
	if (document.querySelector('.player ul.extra')) document.querySelector('.player ul.extra').remove();
	if (document.querySelector('.opponent ul.extra')) document.querySelector('.opponent ul.extra').remove();
}
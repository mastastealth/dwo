var conn;
var opponentDeck;
var playerDeck;
var myTurn;
var attacker;
var forceEnd = 0;

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
		'a2g' : { 'atk': 2, 'def': 4, 'sup': 3, 'bonus' : [2,'arm'], 'trait' : ['air', 'as'] },
		'jet' : { 'atk': 1, 'def': 4, 'sup': 3, 'bonus' : [3,'air'], 'trait' : ['air', 'aa'] },
		'bomber' : { 'atk': 1, 'def': 3, 'sup': 4, 'bonus' : [3,'arm'], 'trait' : ['air', 'as', 'lr'] },
		'hbomber' : { 'atk': 1, 'def': 4, 'sup': 5, 'bonus' : [4,'grd'], 'trait' : ['air', 'as', 'lr'] }
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
		'sniper' : { 'special' : true, 'sup': 2, 'canuse' : ['inf'] },
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
		'coverage' : { 'def' : 3, 'atk' : 0, 'sup' : 1, 'vs': 'as', 'canuse' : ['grd','air'] },
		'wingman' : { 'def' : 2, 'atk' : 0, 'sup' : 0, 'vs': 'air', 'canuse' : ['air','air'] },
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
	// Attacker/Defebder
	var attacker = atkr;

	if (attacker) {
		buoy.addClass(document.querySelector('.player'), 'attacker');
	} else { buoy.addClass(document.querySelector('.opponent'), 'attacker'); }

	conn = connection;
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

			if (document.querySelectorAll('.opponent .unit').length <= 3) {
				points = 1;
			} else if (document.querySelectorAll('.opponent .unit').length===4) {
				points = 2;
			} else { points = 3; }

			// Discard units (& combos)
			resetField(points,true);
		}
	});
}

// Play a card
function playCard(card,who) {
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
					// This is meant to limit defender to attacker's count
					// var theirUnitCount = document.querySelectorAll('.opponent .unit').length;
					// if (unitCount >= 3 && unitCount >= theirUnitCount) return false;
					
					// Get first and last positioned units
					var firstUnit = document.querySelectorAll('.'+who+' .formation .unit')[0];
					var lastUnit = document.querySelectorAll('.'+who+' .formation .unit')[document.querySelectorAll('.'+who+' .formation .unit').length-1];
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
		else if (cardType.unit[card.type] && document.querySelectorAll('.'+who+' .formation .unit').length >= 5) {
			notify('yellow', "Can't play any more units, your field is full!");
		} else if (cardType.unit[card.type] && unitCount < 5 && !fieldOfPlayCheck) {
			notify('yellow', "Can't play any more units, only attacker can expand field count!");
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
				if (who === 'player') cardEl.remove();

				unitCalc('opponent');
				unitCalc('player');

				forceEndCheck(who);

				if (who != 'player') notify('purple', "<img src='images/cards/co_"+card.type+".png'> Commander was played");
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

						conn.send( { 
							'func':'comboPos', 
							'pos' : slot.querySelector('.unit').getAttribute('id'), 
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
						if (field[i].t.indexOf(comboStars[0]) != -1 && !buoy.hasClass(document.getElementById(field[i].id).parentNode,'combo') ) {
							comboMatch = true;
							// Remove card from hand
							if (cardEl) cardEl.remove();

							var unit = document.getElementById(field[i].id);
							// Make unit slot combo-attachable
							buoy.addClass(unit.parentNode,'active');
							unit.parentNode.addEventListener('click', clickListener);
							unit.parentNode.arg = [card,who];
						}
					}
				} else if (comboStars.length === 2) {
					// Check for 2 matches
					for (var i=0;i<field.length;i++) {
						if (field[i].t.indexOf(comboStars[0]) != -1) {
							if (field[i+1]) {
								if ( field[i+1].t.indexOf(comboStars[1]) != -1 ) {
									comboMatch = true;
									if (cardEl) cardEl.remove();

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
									comboMatch = true;
									if (cardEl) cardEl.remove();

									var unit = document.getElementById(field[i].id);
									var unit2 = document.getElementById(field[i+1].id);
									var unit3 = document.getElementById(field[i+2].id);

									if (!buoy.hasClass(unit.parentNode,'combo')) buoy.addClass(unit.parentNode,'active');
									if (!buoy.hasClass(unit2.parentNode,'combo')) buoy.addClass(unit2.parentNode,'active');
									if (!buoy.hasClass(unit3.parentNode,'combo')) buoy.addClass(unit3.parentNode,'active');

									[].forEach.call(document.querySelectorAll('.'+who+' li.active'), function(slot) {
										slot.addEventListener('click', clickListener);
										slot.arg = [card,who];
									});
								}
							} else { break; }
						}
					}
				} else if (comboStars === 0) {
					comboMatch = true;
					specialCombo(card,who);
				}

				if (!comboMatch) notify('red',"Combo doesn't match any units in play! Check stars for formation/required traits.");
			}
		} else if (card.type === "supply") {
			// If supplies, then just add to current supply count
			currentSup = parseInt(document.querySelector('.'+who+' .sup').getAttribute('data-sup'));
			document.querySelector('.'+who+' .sup').setAttribute('data-sup', currentSup+3);
			if (who === 'player') {
				drawCard(playerDeck,1);
				cardEl.remove();
			}

			unitCalc('opponent');
			unitCalc('player');

			forceEndCheck(who);

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
	var cards = [];
	var supCount = 0;
	var unitCount = 0;

	// AUto draw cards
	if (document.querySelectorAll('.card').length<8) {
		drawCard(playerDeck,8-document.querySelectorAll('.card').length);
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
		else if (n===8 && i===1 && indexOfAttr(deck,'unit',1) != -1) {
			wannaplay = deck.splice( indexOfAttr(deck,'unit',1), 1)[0];
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
	var count = 0;
	for (var i=0;i<cards.length;i++) {
		deck.push( cards[i] );
		console.log('Redecking: ',cards[i]);
		count++;
		// Delete unit/cards and not li.combo's
		if (document.getElementById(cards[i].id)) {
			document.getElementById(cards[i].id).remove();
		}

		// Last card, do something
		if (i===cards.length-1) {
			deck = shuffle(deck);
			if (redraw && cards.length<8) { drawCard(playerDeck,cards.length) }
			else if (redraw && cards.length>=8) { drawCard(playerDeck,8) }
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
	var newcard = document.querySelector('.hand .cardContainer').appendChild( document.createElement('div') );
	var img = newcard.appendChild( document.createElement('img') );
	img.setAttribute('src','images/cards/'+pre+card.type+'.png');
	buoy.addClass(newcard, 'card');
	buoy.addClass(newcard, 'new');
	window.setTimeout( function() { buoy.removeClass(newcard, 'new'); },300);
	newcard.cardProps = card;
	newcard.setAttribute('id', card.id);
	newcard.setAttribute('data-type',card.type);

	newcard.addEventListener('click', playListener);
}

function playListener(e) {
	var card = e.target.cardProps;

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
		} else { 
			notify('red', 'Not Enough Supplies');
			return false; 
		}
	}

	if (myTurn && canAfford(e.target) ) {
		conn.send({ 
			'func'  : 'testCard', 
			'card'  : card,
			'who'   : 'origin',
			'action': 'play'
		});
	}
}

// Discard a card
function discardCard(card) {

}

// Zoom on card
function zoomCard() {
	// Scrolling is weird
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
	
	addUnit(newUnit,who,card.type);

	unitCalc('opponent');
	unitCalc('player');

	forceEndCheck(who);

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
	var unitAtk = 0;
	var unitDef = 0;
	var currentSupUse = 0;
	var currentSup = parseInt( supSpan.getAttribute('data-sup') );

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

			bonusTotal += thisBonus;
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
	atkSpan.setAttribute('data-unit', unitAtk);

	defSpan.innerHTML = unitDef + comboDefTotal + commDefBonus;
	defSpan.setAttribute('data-unit', unitDef);
	
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
	slot.querySelector('span').appendChild(img);

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

	if (cardType.combo[card.type].special) {
		specialCombo(card,who);

		// Special combo color slots
		if (card.type==='support') buoy.addClass(slot,'sup');
		if (card.type==='sniper' || card.type==='tstrike') buoy.addClass(slot,'atk');
		if (card.type==='intel' || card.type==='stealth') { 
			buoy.addClass(slot,'atk'); 
			buoy.addClass(slot,'def'); 
		}
	} else {
		unitCalc('opponent');
		unitCalc('player');
	}

	forceEndCheck(who);

	if (who!='player' && !cardType.combo[card.type].special) notify('red', "<img src='images/cards/"+card.type+".png'> Combo was played");
}

function specialCombo(card,who,v) {
	function extraUnit(u) {
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
		var uid = document.querySelector('.'+who+' ul.extra li').length;
		unit.cardProps = { 'id' : u+'_extra'+uid, 'type' : u };
		unit.setAttribute('id',u+'_extra'+uid);
		buoy.addClass(unit,'unit');
		unit.setAttribute('data-type', u);

		// Image
		var img = unit.appendChild( document.createElement('img') );
		img.setAttribute('src','images/cards/unit_'+u+'.png');

		addUnit(unit,who,u);

		unitCalc('opponent');
		unitCalc('player');

		forceEndCheck(who);
	}

	function snipe(e) {
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
		if (forceEnd!=1) forceEndCheck(who);

		// Send kill
		conn.send( { 
			'func':'specialCombo', 
			'card' : card, 
			'who' : 'opponent', 
			'var' : uid
		});
	}

	console.log('Special Combo!');
	switch (card.type) {
		// One Star Combos
		case "support":
			currentSup = parseInt(document.querySelector('.'+who+' .sup').getAttribute('data-sup'));
			document.querySelector('.'+who+' .sup').setAttribute('data-sup', currentSup+2);

			unitCalc('opponent');
			unitCalc('player');

			break;
		case "sniper":
			// Add listener to kill
			if (who==='player') {
				[].forEach.call(document.querySelectorAll('aside:not(.'+who+') .combo .unit'), function(u) {
					if ( cardType.unit[ u.cardProps.type ].trait.indexOf('inf') != -1 ) {
						buoy.addClass(u.parentNode,'active');
						u.killUnit = true;
						u.parentNode.addEventListener('click', snipe);
					}
				});
			} else {
				if (v) clearCombo( document.getElementById(v).parentNode );
				// Recalc
				unitCalc('player');
				unitCalc('opponent');
				forceEndCheck(who);
			}
			break;
		case "retreat":
			document.getElementById(card.id).remove()
			function retreat(e) {
				// Remove unit
				var unit = e.target.querySelector('.unit').cardProps.id
				e.target.querySelector('.unit').remove();

				// Check if combo is support first, and clear those supplies
				if (e.target.getAttribute('data-type')==='support') {
					currentSup = parseInt(document.querySelector('.'+who+' .sup').getAttribute('data-sup'));
					document.querySelector('.'+who+' .sup').setAttribute('data-sup', currentSup-2);
				}
				// Clear combo out
				clearCombo(e.target);

				// Collapse formation
				e.target.parentNode.appendChild( e.target );

				// Reset junk
				[].forEach.call(document.querySelectorAll('.'+who+' li'), function(slot) {
					if (buoy.hasClass(slot,'active')) buoy.removeClass(slot,'active');
					slot.removeEventListener('click', retreat);
				});

				// Recalc and send
				unitCalc('player');
				unitCalc('opponent');
				forceEndCheck(who);

				conn.send( { 
					'func':'specialCombo', 
					'card' : card, 
					'who' : 'opponent', 
					'var' : unit
				});
			}

			if (who==='player') {
				// Make all cards active
				[].forEach.call(document.querySelectorAll('.'+who+' .unit'), function(unit) {
					var slot = unit.parentNode;
					buoy.addClass(slot,'active');
					// Add listener to redeck whatever card is clicked
					slot.addEventListener('click', retreat);
				});

				notify('yellow','Select a unit to retreat! (Combo will be discarded)');
			} else if (who!='player' && v) {
				// Remove unit
				console.log(v);
				var unit = document.getElementById(v);
				var slot = unit.parentNode;
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
				drawCard(playerDeck,3);
			}
			break;
		// 2 Star Combo
		case "intel":
			// Use notification to display all of opponent's units
			if (who==='player') {
				//conn.send( { 'func':'specialCombo', 'card' : card, 'who' : 'opponent' } );
			} else {
				var cards = "";

				[].forEach.call(document.querySelectorAll('.card'), function(card) {
					var pre = '';
					if ( cardType.unit[card.type] ) { pre = 'unit_'; }
					else if ( cardType.co[card.type] ) { pre = 'co_'; }

					cards+= "<img src='images/cards/"+pre+card.cardProps.type+".png'>";
				});

				conn.send( { 'func' : 'notify', 'type': 'green', 'msg' : cards });
			}
			break;
		case "stealth":
			extraUnit('infantry');
			break;
		// 3 Star Combo
		case "barrier":
			// GOOD QUESTION
			break;
		case "acover":
			// Might need to rework this card to just extra def...
			break;
		case "bigguns":
			extraUnit('tank');
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
			} else {
				if (v) {
					clearCombo( document.getElementById(v).parentNode );
					document.getElementById(v).remove();
				}
				// Recalc
				unitCalc('player');
				unitCalc('opponent');
				forceEndCheck(who);
			}
			break;
	}

	if (who!='player') notify('red', "<img src='images/cards/"+card.type+".png'> Combo was played");
}

// =================================
// --------- UI FUNCTIONS ----------
// =================================

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
		if ( document.querySelector('.'+who+' .formation li:first-child').children.length > 1 ) {
			var lastLi = document.querySelector('.'+who+' .formation li:last-child');
			document.querySelector('.'+who+' ul.formation').prependChild(lastLi);
		} 
		// or do the opposite for bottom
		else if ( document.querySelector('.'+who+' .formation li:last-child').children.length > 1 ) {
			var firstLi = document.querySelector('.'+who+' .formation li:first-child');
			document.querySelector('.'+who+' ul.formation').appendChild(firstLi);
		}
	} 
	// Add empty li to opposite side of end with unit
	else if (document.querySelectorAll('.'+who+' .formation .unit').length === 4) {
		var li = document.createElement('li');
		if ( document.querySelector('.'+who+' .formation li:first-child').children.length > 1 ) {
			console.log('Prepending...', li);
			document.querySelector('.'+who+' ul.formation').prependChild( li );
		}
		else if ( document.querySelector('.'+who+' .formation li:last-child').children.length > 1 ) {
			console.log('Appending...', li);
			document.querySelector('.'+who+' ul.formation').appendChild( li );
		}
		li.appendChild( document.createElement('span') );

	} else if (document.querySelectorAll('.'+who+' .formation .unit').length === 5) {
		var emptyLi = document.querySelector('.'+who+' .formation li span:only-child').parentNode;
		emptyLi.parentNode.removeChild(emptyLi);
	}
}

// Notification messages within the game
function notify(type, msg) {
	var bubble = document.querySelector('body').appendChild( document.createElement('div') );
	bubble.innerHTML = msg;
	buoy.addClass(bubble, 'notify');
	buoy.addClass(bubble, type);

	var notCount = document.querySelectorAll('.notify:not(.bubble)').length;
	if (notCount > 1) bubble.style.top = (((notCount-1)*80)+(10*(notCount)))+'px';

	window.setTimeout( function() { bubble.remove(); }, 5000);
}

// Clear a slot of its combo
function clearCombo(el) {
	el.setAttribute('class','');
	el.removeAttribute('data-atk');
	el.removeAttribute('data-def');
	el.removeAttribute('data-sup');
	el.removeAttribute('data-type');
	if (el.querySelector('span').firstElementChild) el.querySelector('span').firstElementChild.remove();
	if (document.querySelector('.player ul.extra')) document.querySelector('.player ul.extra').remove();
	if (document.querySelector('.opponent ul.extra')) document.querySelector('.opponent ul.extra').remove();
}

// Use at the end of the round to wipe/add scores and reset field
function resetField(points,loser) {
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
					clearCombo(obj);
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
				clearCombo(el);
			});
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
			console.log('2+ Units, 1 Combo');

			var onlyCombo = document.querySelector('.player .combo');
			redeckCard(playerDeck,[onlyCombo.cardProps],false);

			clearCombo(onlyCombo);

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

	if (document.querySelectorAll('.player .formation li').length>5) {
		document.querySelector('.player .formation li:first-child').remove();
	}

	if (document.querySelectorAll('.opponent .formation li').length>5) {
		document.querySelector('.opponent .formation li:first-child').remove();
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
		if (document.querySelector('.'+who+' .commander')) document.querySelector('.'+who+' .commander').remove();
	}

	// Declare Loss
	if (loser) {
		var a = parseInt(document.querySelector('.opponent .atk').textContent);
		var d = parseInt(document.querySelector('.player .def').textContent);
		var winMsg = (attacker && a > d) ? '<img src="images/cards/outpost.png"> You win round AND counter-attacked! You take points!' : 'You win round';

		conn.send({ 'func':'notify', 'type':'green', 'msg': winMsg });
		conn.send({ 'func':'win', 'points': points });

		if (!attacker || (attacker && a > d) ) {
			console.log('lost');
			if (attacker && a>d) { notify('red', 'Lost Round AND Counter-attacked! Opponent gets points!'); }
			else { notify('red', 'Lost Round'); }
			var currentPts = (document.querySelector('.opponent .outpost').textContent) ? parseInt(document.querySelector('.opponent .outpost').textContent) : 0;
			document.querySelector('.opponent .outpost').textContent = currentPts + points;
		}
	}

	wipeStats('player');
	wipeStats('opponent');

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
		document.querySelector('.turn').setAttribute('disabled','true');
		document.querySelector('.end').setAttribute('disabled','true');
		//document.querySelector('.shuf').setAttribute('disabled','true');
		// Tell opponent it's his turn
		conn.send( { 'func':'yourTurn', 'var' : true } );
		myTurn = false;
		buoy.addClass(document.querySelector('.hand'),'disable');
	}
}

// Swap 3 cards at the beginning of your turn
function swapThree(dontdoit) {
	document.querySelector('.turn').setAttribute('disabled','true');
	document.querySelector('.end').setAttribute('disabled','true');
	forceEnd = false;

	if (dontdoit) return false;
	var count = 0;

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
		[].forEach.call(document.querySelectorAll('.card'), function(card) {
			card.removeEventListener('click', chooseThree);
			buoy.removeClass(card, 'choose');
			forceEnd = 0;

			// Swap cards
			if (count === 3 || count === 0) {
				if ( buoy.hasClass(card, 'active') ) {
					redeckCard(playerDeck, [card.cardProps], true);
					card.remove();
				} else {
					card.addEventListener('click', playListener);
				}
			} else {
				card.addEventListener('click', playListener);
			}
		});	

		//document.querySelector('.turn').removeAttribute('disabled');
		document.querySelector('.end').removeAttribute('disabled');
		if (count===3) conn.send( { 'func':'notify', 'type' : 'yellow', 'msg' : 'Opponent swapped 3 cards' } );

		done.removeEventListener('click', finishSwap);
		done.remove();
		done = null;
	}

	[].forEach.call(document.querySelectorAll('.card'), function(card) {
		buoy.addClass(card, 'choose');
		card.removeEventListener('click', playListener);
		card.addEventListener('click', chooseThree);
	});

	// Add button for "DONE"
	var done = document.querySelector('.player').appendChild( document.createElement('button') );
	done.textContent = 'Done';
	done.addEventListener('click', finishSwap);

	notify('yellow', 'Choose 3 cards to swap out, or choose none, and hit done.')
}

function endTurnListener(e) {
	var endTurn = document.querySelector('.turn');
	if (myTurn){
		// If it is your turn, disable buttons and turn
		myTurn = false;
		endTurn.setAttribute('disabled','true');
		document.querySelector('.end').setAttribute('disabled','true');
		// AUto draw cards
		if (document.querySelectorAll('.hand .card').length<8) {
			drawCard(playerDeck,8-document.querySelectorAll('.hand .card').length);
		} else { drawCard(playerDeck,1); }
		// Tell opponent it's his turn
		conn.send( { 'func':'yourTurn', 'var' : false } );
		buoy.addClass(document.querySelector('.hand'),'disable');
		notify('red', 'Ended Turn');
		forceEnd = 0;
	}
}

function forceEndCheck(who) {
	window.setTimeout( function(){
		if (attacker && myTurn) {
			// Attacker's atk is greater than Defenders def
			if (parseInt(document.querySelector('.'+who+' .atk').textContent) > parseInt(document.querySelector('aside:not(.'+who+') .def').textContent)) {
				forceEnd += 1;
				if (forceEnd===1) notify('red', 'You surpassed their defense! Play 1 more card & your turn will end (or end it now)');
			}
		} else if (!attacker && myTurn) {
			// Defenders def is greater than or equal to Attacker's atk
			if (parseInt(document.querySelector('.'+who+' .def').textContent) >= parseInt(document.querySelector('aside:not(.'+who+') .atk').textContent)) {
				forceEnd += 1;
				if (forceEnd===1) notify('blue', 'You matched/surpassed their attack! Play 1 more card & your turn will end (or end it now)');
			}
		}
		//console.log(forceEnd);
		if (forceEnd===1) {
			document.querySelector('.turn').removeAttribute('disabled');
			document.querySelector('.end').setAttribute('disabled','true');
		} else if (forceEnd>1) { endTurnListener(); } 
	}, 300);
}
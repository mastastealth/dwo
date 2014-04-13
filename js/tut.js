// Make .game active
buoy.addClass(document.querySelector('.game'), 'active');
buoy.addClass(document.querySelector('.player'), 'attacker');

// Explain Bubble Function

// Add Saptiva to field
var comm = document.querySelector('.player').appendChild( document.createElement('div') );
buoy.addClass(comm,'commander');
comm.style.backgroundImage = 'url(images/misc/saptiva.png)';

// Create Bubble + Intro Text
var bubble = document.querySelector('.game').appendChild( document.createElement('div') );
buoy.addClass(bubble,'bubble');
buoy.addClass(bubble,'notify');
var bubbleP = bubble.appendChild( document.createElement('p') );
var bubbleBtn = bubble.appendChild( document.createElement('button') );

window.setTimeout( function() {
	bubbleP.textContent = "Welcome to Deck Wars Online! This is a web prototype for what will hopefully be an awesome game in the future. \
		For now, let's learn how to play the game so you can do some alpha testing! I'm your Commander, Saptiva, and I'll be guiding you through this tutorial. Let's start off with something simple...";
	bubbleBtn.setAttribute('onclick', 'introSupply()') ;
	bubbleBtn.textContent = "Next";
}, 1000);

// Draw Supply Card
function introSupply() {
	drawCardConfirmed( {'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 } );
	bubbleP.textContent = "Here we have a supply card. Supplies are the single resource for Deck Wars, and most other cards require supplies before \
	you're able to play them. Go ahead and play the supply card.";
	bubbleBtn.setAttribute('disabled',true);
	document.querySelector('.hand .card').setAttribute('onclick', 'introSupply2()') ;
}

// Explain + Play Supply
function introSupply2() {
	document.querySelector('.hand .card').remove();
	document.querySelector('.player .sup').textContent = '0/3';

	// Draw Infantry
	drawCardConfirmed( {'type': 'infantry', 'id' : 'inf1', 'unit' : 1 } );
	buoy.addClass( document.querySelector('.hand .card'), 'disable' );

	bubbleP.textContent = "Whenever you play a supply card, you automatically draw a new card. Although this sounds like an easy way to draw cards \
	one thing to remember is supplies ARE limited. Each player only has 25 of them, so you have to play your cards carefully. If you run out of supplies, you lose!";
	bubbleBtn.removeAttribute('disabled',true);
	bubbleBtn.setAttribute('onclick', 'introSupply3()') ;
}

function introSupply3() {
	bubbleP.textContent = "Note that your supplies have been added to the top left corner (the left side is your side, the right is your opponent). \
	You are using 0 of 3 supplies. Now, look at the unit card for a moment...";
	bubbleBtn.setAttribute('onclick', 'introUnit()') ;
}

// Explain Infantry (units)
function introUnit() {
	buoy.removeClass( document.querySelector('.hand .card'), 'disable' );
	bubbleP.textContent = 'Unit cards are always green. They always have 3 stats: Attack Power, Defense, and supply cost. The icons below these stats \
	indicate "traits". Keep this in mind when we come across combo cards. For now, play the unit.'
	bubbleBtn.setAttribute('disabled',true);
	document.querySelector('.hand .card').setAttribute('onclick', 'introUnit2()') ;
}

// Play Infantry
function introUnit2() {
	document.querySelector('.player li:nth-child(3)').appendChild(document.querySelector('.hand .card'));
	buoy.addClass( document.querySelector('li .card'), 'unit' );
	document.querySelector('.player .atk').textContent = '1';
	document.querySelector('.player .def').textContent = '1';

	bubbleP.textContent = "Note that the attack and defense stats on the top have been updated now! However, infantry units don't use up any supplies. \
	We are now at 1/1 vs our opponent's 0/0...";

	document.querySelector('li .card').removeAttribute('onclick');
	bubbleBtn.removeAttribute('disabled');
	bubbleBtn.setAttribute('onclick', 'introUnit3()') ;
}

// Explain Field (Stats, Goal of Round)
function introUnit3() {
	bubbleP.textContent = "So, notice that the attack stat on top is highlighted. This indicates whether you are the attacker or defender. As the \
	attacker, your goal is to surpass your opponent's defense this round. The moment you do, you end your turn. However, right before that you have \
	the option of playing one more card. We won't do that for now, so we'll end our turn.";
	bubbleBtn.textContent = 'End Turn';
	bubbleBtn.setAttribute('onclick', 'opponent()') ;
}

// Explain End of Turn Draw
function opponent() {
	notify('red', 'Ended Turn');
	drawCardConfirmed( {'type': 'at', 'id' : 'combo1', 'combo' : 1 } );
	buoy.addClass( document.querySelector('.hand .card'), 'disable' );

	bubbleP.textContent = "At the end of your turn, you will always auto draw a certain amount of cards (in a normal game, your hand will always \
		have at least 8 cards when you end your turn). We'll check out our new card after our opponent plays though."
	bubbleBtn.textContent = 'Next';
	bubbleBtn.setAttribute('onclick', 'opponent2()') ;
}

// Opponent plays Supply
function opponent2() {
	notify('yellow', "<img src='images/cards/supply.png'> Supply was played");
	document.querySelector('.opponent .sup').textContent = '0/3';
	bubbleP.textContent = "Whenever your opponent plays a card, you'll receive a notification on top. You'll receive notifications for other things as \
	well, so make sure to pay attention! (Particularly when you're very new to the game)";
	bubbleBtn.setAttribute('onclick', 'opponent3()') ;
}

// Play Recon
function opponent3() {
	drawCardConfirmed( {'type': 'recon', 'id' : 'recon', 'combo' : 1 } );
	var rec = document.querySelector('.opponent li:nth-child(3)').appendChild( document.getElementById('recon') );
	buoy.addClass( rec, 'unit' );

	notify('unit', "<img src='images/cards/unit_recon.png'> Unit was played");
	document.querySelector('.opponent .atk').textContent = '3';
	document.querySelector('.opponent .def').textContent = '2';
	document.querySelector('.opponent .sup').textContent = '1/3';

	// Explain Unit Bonus
	bubbleP.textContent = "If you hover over your opponent's card, you will notice a bar along the bottom. This unit has a bonus. What this means is \
	that when the unit the bonus is against (in this case, an infantry) is present on the opponsing field, the bonus is activated. In this case, his \
	attack has been raised from 1 to 3."
	bubbleBtn.setAttribute('onclick', 'opponent4()') ;
}

// End Opponent Turn
function opponent4() {
	bubbleP.textContent = "However, as the defender, your opponent's goal is to surpass OR match your attack with his defense (which he has highlighted). He has done this, and will choose not to \
	play another card, so get ready for your turn!";
	bubbleBtn.setAttribute('onclick', 'newturn()') ;
}

// Play Combo
function newturn() {
	notify('green', 'Your Turn');
	bubbleP.textContent = "Back to our new combo card. Combos are attached to units to enhance certain stats. You can easily tell which stat they enhance at a glance: \
	Red cards enhance attack, blue cards enhance defense. You might notice the star and icon on the left. Remember about unit traits?";
	bubbleBtn.setAttribute('onclick', 'newturn2()') ;
}

// Explain Combo Attach/Enhancements
function newturn2() {
	bubbleP.textContent = "Well, as you might see, this combo requires a trait from 1 unit (since it only has 1 star). It just so happens that this combo \
	perfectly matches your current unit, so go ahead and play it! (You will have to choose which unit to play it on, that shouldn't be too hard)";
	buoy.removeClass( document.querySelector('.hand .card'), 'disable' );
	document.querySelector('.hand .card').setAttribute('onclick', 'newturn3()') ;
	bubbleBtn.setAttribute('disabled',true);
}

// End Turn
function newturn3() {
	document.querySelector('.hand .card').remove();
	var slot = document.querySelector('.player li:nth-child(3)');
	buoy.addClass( slot, 'active' );
	slot.setAttribute('onclick', 'opponent5()');
}

// Draw 3 This time (Sup/Infantry/Some Def 2* Combo)
function opponent5() {
	bubbleP.textContent = "Now that you've played the combo, you've once again surpassed your opponent's defense. Once more, we will also auto end our turn \
	without playing anything else. (However this time, we'll auto draw a couple more cards we'll be using to finish up this round)";

	document.querySelector('.player .atk').textContent = '3';
	notify('red', 'Ended Turn');
	
	bubbleBtn.removeAttribute('disabled');
	
	var slot = document.querySelector('.player li.active');
	buoy.addClass( slot, 'combo' );
	buoy.addClass( slot, 'atk' );
	slot.appendChild( document.createElement('span') );

	window.requestAnimationFrame( function() {
		var img = document.createElement("img");
		img.setAttribute('src','images/cards/at.png');
		slot.querySelector('.combo span').appendChild(img);
		buoy.removeClass( slot, 'active' );
		slot.removeAttribute('onclick');
		document.querySelector('.player .sup').textContent = '1/3';
		bubbleBtn.setAttribute('onclick', 'opponent6()');

		drawCardConfirmed( {'type': 'supply', 'id' : 'supply', 'supply' : 1 } );
		drawCardConfirmed( {'type': 'coverage', 'id' : 'coverage', 'unit' : 1 } );
		drawCardConfirmed( {'type': 'infantry', 'id' : 'infantry2', 'combo' : 1 } );

		[].forEach.call(document.querySelectorAll('.card'), function(card) {
			buoy.addClass(card, 'disable');
		});
	});
}

// Opponent plays Helo
function opponent6() {
	drawCardConfirmed( {'type': 'helo', 'id' : 'helo', 'combo' : 1 } );

	var helo = document.querySelector('.opponent li:nth-child(2)').appendChild( document.getElementById('helo') );
	buoy.addClass( helo, 'unit' );

	notify('unit', "<img src='images/cards/unit_helo.png'> Unit was played");
	document.querySelector('.opponent .atk').textContent = '5';
	document.querySelector('.opponent .def').textContent = '4';
	document.querySelector('.opponent .sup').textContent = '3/3';

	// Explain Unit Bonus
	bubbleP.textContent = "Your opponent has played a helicopter. Just a reminder, but check out the new traits on this one. Also, you can see \
	your opponent has now reached his current supply limit, he'll have to play a 2nd one on his next turn to continue playing units."
	bubbleBtn.setAttribute('onclick', 'swapTime()') ;
}

// Enable Swap 3
function swapTime() {
	[].forEach.call(document.querySelectorAll('.card'), function(card) {
		buoy.removeClass(card, 'disable');
		buoy.addClass(card, 'choose');
	});

	notify('green', 'Your Turn');
	notify('yellow', 'Choose 3 cards to swap out, or choose none, and hit done.');
	// Explain Swap 3
	bubbleP.textContent = "All right, one more mechanic you'll encounter in a real match is that at the start of your turn you are given the chance to \
	swap out 3 cards for new ones. This can either help you out win this round, be used to set up a hand for the next! You can of course opt to keep your current \
	hand. In this case though, select all 3 cards and then hit Done.";
	bubbleBtn.textContent = "Done";
	bubbleBtn.setAttribute('onclick', 'swapTime2()') ;

	document.querySelector('#supply').setAttribute('onclick', 'buoy.toggleClass(this,"active")') ;
	document.querySelector('#coverage').setAttribute('onclick', 'buoy.toggleClass(this,"active")') ;
	document.querySelector('#infantry2').setAttribute('onclick', 'buoy.toggleClass(this,"active")') ;
}

// Make User Swap All 3
function swapTime2() {
	if (document.querySelectorAll('.hand .card.active').length===3) {
		[].forEach.call(document.querySelectorAll('.hand .card'), function(card) {
			card.remove();
		});

		// Draw AA/Supply/Tank
		drawCardConfirmed( {'type': 'aa', 'id' : 'aa', 'unit' : 1 } );
		drawCardConfirmed( {'type': 'supply', 'id' : 'supply', 'supply' : 1 } );
		drawCardConfirmed( {'type': 'tank', 'id' : 'tank', 'combo' : 1 } );

		bubbleP.textContent = "Sweet, we got some new cards, and these are actually useful! Thanks to the opponent's helo, your AA unit's bonus will activate \
		when played. However, look at your cards carefully. We want to play ALL 3 for maximum power (make your opponent feel threatened), can you figure out the correct order?";

		document.querySelector('#supply').setAttribute('onclick', 'swapTime3("s")') ;
		document.querySelector('#aa').setAttribute('onclick', 'swapTime3("a")') ;
		document.querySelector('#tank').setAttribute('onclick', 'swapTime3("t")') ;

		bubbleBtn.setAttribute('disabled', true) ;
	} else {
		notify('yellow', 'Choose 3 cards to swap out, or choose none, and hit done.');
	}
}

// Play Sup + AA
function swapTime3(e) {
	if (e==="s") {
		document.querySelector('#supply').remove();
		document.querySelector('.player .sup').textContent = '1/6';

		bubbleP.textContent = "Good choice. By playing supplies first, you can avoid having to end your turn right now. Playing either unit right now means \
		you would surpass their defense, and only have 1 card left to play. Also, by playing the supply now, you get that free draw which gives the chance for \
		an even better card to join your hand!"

		drawCardConfirmed( {'type': 'shell', 'id' : 'shell', 'combo' : 1 } );

		document.querySelector('#aa').setAttribute('onclick', 'swapTime4("aa")') ;
		document.querySelector('#tank').setAttribute('onclick', 'swapTime4("tank")') ;
		document.querySelector('#shell').setAttribute('onclick', 'notify("red","Combo doesn\'t match any units in play! Check stars for formation/required traits.")') ;
	} else if (e==="a") {
		bubbleP.textContent = "Nope! Look carefully. The AA costs 1 supplies to play. If you play this now, your attack will go up to 6 (thanks to bonus), which means you'll \
		have to end your turn. You can't play the tank since you lack supplies, so you'd be left playing the supplies and waiting your next turn to play tank! Choose again.";
	} else if (e==="t") {
		bubbleP.textContent = "Nope! Look carefully. A tank costs 2 supplies to play. If you play this now, your attack will go up to 5, which means you'll \
		have to end your turn. You can't play the AA since you lack supplies, so you'd be left playing the supplies and waiting your next turn to play AA! Choose again.";
	}
}

// Explain Formations
function swapTime4(e) {
	bubbleP.textContent = "Whoa! When playing your second unit (or beyond) you have to decide where to place your units. Did you see that new \
	combo you got when you played your supply? It requires 2 armor units side by side. This is why formation planning is important. \
	I'll go ahead and make thing simple for you by only allowing to place new units on the top...";

	[].forEach.call(document.querySelectorAll('.hand .card'), function(el) {
		buoy.addClass(el, 'disable');
	});

	// Get first and last positioned units
	var firstUnit = document.querySelectorAll('.player .formation .unit')[0];
	var lastUnit = document.querySelectorAll('.player .formation .unit')[document.querySelectorAll('.player .formation .unit').length-1];
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
		addNext.setAttribute('disabled',true);
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
				newUnit = el.parentNode.appendChild( document.getElementById(e) );
				document.getElementById(e).removeAttribute('onclick');
				buoy.addClass(newUnit,'unit');

				if (e==="tank") {
					document.querySelector('.player .atk').textContent = parseInt(document.querySelector('.player .atk').textContent)+2;
					document.querySelector('.player .def').textContent = parseInt(document.querySelector('.player .def').textContent)+2;
					document.querySelector('.player .sup').textContent = parseInt(document.querySelector('.player .sup').textContent)+2+"/6";
				} else {
					document.querySelector('.player .atk').textContent = parseInt(document.querySelector('.player .atk').textContent)+3;
					document.querySelector('.player .def').textContent = parseInt(document.querySelector('.player .def').textContent)+2;
					document.querySelector('.player .sup').textContent = parseInt(document.querySelector('.player .sup').textContent)+1+"/6";
				}

				// Cleanup
				addPrev.parentNode.removeChild(addPrev);
				addNext.parentNode.removeChild(addNext);
				addPrev = null;
				addNext = null;

				[].forEach.call(document.querySelectorAll('.hand .card'), function(el) {
					buoy.removeClass(el, 'disable');
				});

				// Smart shift
				smartShift('player');

				// Play 1 More / End Turn
				if (document.querySelectorAll('.player .unit').length===2) {
					notify('red', 'You surpassed their defense! Play 1 more card & your turn will end (or end it now)');
					bubbleP.textContent = "All right, one more to play and our turn will automatically end. The standard formation size is 3, only the attacker \
					can opt to expand the field to play a 4th or (max) 5th unit, but this comes with some risks...(go ahead and play your last unit)";
				}
				if (document.querySelectorAll('.player .unit').length===3) {
					notify('red', 'Ended Turn');
					opponent7();
				}
			}
		});
	});
}

// Draw 3 (Sap/Frontline)
function opponent7() {
	drawCardConfirmed( {'type': 'saptiva', 'id' : 'saptiva', 'co' : 1 } );

	[].forEach.call(document.querySelectorAll('.hand .card'), function(el) {
		buoy.addClass(el, 'disable');
	});

	bubbleBtn.setAttribute('onclick', 'opponent8()') ;
	bubbleBtn.removeAttribute('disabled') ;
	bubbleBtn.textContent = 'Next';

	// Explain Slot Limit
	bubbleP.textContent = "So why wouldn't the attacker want to expand the field? For 1, it means using up more supplies. Maybe you have a weak \
	hand & are better off losing this 1 point? For every extra unit on the field, the points up for grab for a successful win are also raised, so stakes are higher. \
	Lastly, by limiting to 3 we also know our opponent can only play 1 more unit, limiting his options.";

	window.setTimeout( function() { 
		notify('yellow', "<img src='images/cards/supply.png'> Supply was played") ;
		document.querySelector('.opponent .sup').textContent = "3/6";
	}, 600 );
}

// Opp. plays A2G
function opponent8() {
	bubbleP.textContent = "Your opponent has got you in a bind! Not only has he matched your attack, he is also surpassing YOUR defense with HIS attack. Normally \
	only the attacker will win points for winning, but if the defender pulls of this trick (a counterattack), he will win the point at the end of this round! (and had \
		you expanded the field, he could of won 1 extra per unit!) But you got this...";

	bubbleBtn.setAttribute('onclick', 'finalPlay()') ;

	drawCardConfirmed( {'type': 'a2g', 'id' : 'a2g', 'combo' : 1 } );
	var a2g = document.querySelector('.opponent li:nth-child(4)').appendChild( document.getElementById('a2g') );
	buoy.addClass( a2g, 'unit' );

	notify('unit', "<img src='images/cards/unit_a2g.png'> Unit was played");
	document.querySelector('.opponent .atk').textContent = '9';
	document.querySelector('.opponent .def').textContent = '8';
	document.querySelector('.opponent .sup').textContent = '6/6';
}

// Play Sap + Explain Commanders
function finalPlay() {
	notify('green', 'Your Turn');
	bubbleP.textContent = "One last card type to explain in this tutorial is the commander card. Commander cards are similar to combos, in that they provide units \
	with stat boosts, except commanders apply across your whole field (not just 1 unit). Click my card to activate my bonus!";
	
	bubbleBtn.setAttribute('disabled', true) ;
	var sap = document.getElementById('saptiva');
	buoy.removeClass(sap, 'disable');
	sap.setAttribute('onclick','finalPlay2()');
}

// Play 1 more, End Turn
function finalPlay2() {
	document.getElementById('saptiva').remove();
	notify('red', 'You surpassed their defense! Play 1 more card & your turn will end (or end it now)');
	document.querySelector('.player .atk').textContent = '9';
	document.querySelector('.player .def').textContent = '6';
	bubbleP.textContent = "With only 1 infantry on the field, the boost is small, but it's just enough to put you in the lead again. To really scare your opponent \
	go ahead and play your final card.";

	buoy.removeClass(document.getElementById('shell'), 'disable');
	document.getElementById('shell').setAttribute('onclick','finalPlay3()');
}

// Explain one more bit on formation
function finalPlay3() {
	bubbleP.textContent = "With a 2 star combo (in this case, we need 2 armor units side by side, which we do since we planned our formation earlier) you \
	can choose which of the 2 units to apply it to. This is important to keep in mind for strategies in the future, particularly once you \
	customize decks, so you can purposely leave a specific unit open to other combos.";
	buoy.addClass( document.getElementById('tank').parentNode, 'active');
	buoy.addClass( document.getElementById('aa').parentNode, 'active');
	document.getElementById('tank').parentNode.setAttribute('onclick','finalPlay4("tank")');
	document.getElementById('aa').parentNode.setAttribute('onclick','finalPlay4("aa")');
}

// Win
function finalPlay4(e) {
	notify('red', 'Ended Turn');
	document.querySelector('.player .atk').textContent = '11';
	document.querySelector('.player .sup').textContent = '6/6';

	[].forEach.call(document.querySelectorAll('li.active'), function(el) {
		buoy.removeClass(el, 'active');
		el.removeAttribute('onclick');
	});

	window.requestAnimationFrame( function() {
		var slot = document.getElementById(e).parentNode;
		buoy.addClass(slot, 'combo');
		buoy.addClass(slot, 'atk');
		slot.appendChild( document.createElement('span') );
		var img = document.createElement("img");
		img.setAttribute('src','images/cards/shell.png');
		slot.querySelector('span').appendChild(img);
		document.getElementById('shell').remove();
	});

	bubbleBtn.removeAttribute('disabled');
	bubbleBtn.setAttribute('onclick','finalPlay5()');
	bubbleP.textContent = "POW! With that, your attack is that much higher for your opponent to match. Will he manage to pull off some miracle!?";
}

// Explain redeck of 1 Combo (and for loser redeck of 1 unit)
function finalPlay5() {
	notify('green', 'You win round');

	document.querySelector('.player .def').textContent = '0';
	document.querySelector('.player .atk').textContent = '0';
	document.querySelector('.player .sup').textContent = '0';

	document.querySelector('.opponent .def').textContent = '0';
	document.querySelector('.opponent .atk').textContent = '0';
	document.querySelector('.opponent .sup').textContent = '0';

	[].forEach.call(document.querySelectorAll('.card'), function(el) {
		el.remove();
	});

	bubbleP.textContent = "NOPE! Guess he had nothing left to play (or he's plotting your demise next round). Good job! One final thing for this tutorial: \
	As the winner, you automatically get to keep all your units (they are placed back into your draw deck). You also get to save one combo as well! \
	Meanwhile, the loser discards all his combos & only save one unit. Both players however, discard all their used supplies & any used commanders.";
	
	bubbleBtn.setAttribute('disabled', true);
	[].forEach.call(document.querySelectorAll('.player .combo'), function(el) {
		el.setAttribute('onclick','finalPlay6()');
		buoy.addClass(el,'active')
	});
}

// End
function finalPlay6() {
	[].forEach.call(document.querySelectorAll('.player li'), function(el) {
		if (buoy.hasClass(el,'combo')) buoy.removeClass(el,'combo');
		if (buoy.hasClass(el,'active')) buoy.removeClass(el,'active');
		if (buoy.hasClass(el,'atk')) buoy.removeClass(el,'atk');
		if (el.querySelector('span img')) el.querySelector('span img').remove();
		el.removeAttribute('onclick');
	});

	bubbleBtn.removeAttribute('disabled');
	bubbleP.innerHTML = "Nice job! That wraps up the tutorial. Good luck on the battlefield soldier! Feel free to report any bugs you find ingame on <a href='https://github.com/mastastealth/dwo/issues'>Github</a> \
	or tweet them to <a href='http://twitter.com/brianfranco'>@brianfranco</a>, thanks!";
	bubbleBtn.textContent = "Finish";
	bubbleBtn.setAttribute('onclick','endTut()');
}

function endTut() {
	buoy.removeClass(document.querySelector('.game'), 'active');
	document.querySelector('.commander').remove();
	document.querySelector('.bubble').remove();
}
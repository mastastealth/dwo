// Make .game active
buoy.addClass(document.querySelector('.game'), 'active');
buoy.addClass(document.querySelector('.game'), 'tut');
buoy.addClass(document.querySelector('.player'), 'attacker');
buoy.addClass(document.querySelector('.player'), 'myturn');
buoy.removeClass(document.querySelector('.hand'), 'disable');

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
	bubbleP.textContent = "Welcome to Deck Wars Online! This is a web prototype for a digital/physical hopefully-to-be-released TCG. \
		Let's learn how to play the game! I'm your Commander, Saptiva, and I'll be guiding you through this tutorial. Let's start off with something simple...";
	bubbleBtn.setAttribute('onclick', 'introSupply()') ;
	bubbleBtn.textContent = "Next";
}, 1000);

// Draw Supply Card
function introSupply() {
	drawCardConfirmed( {'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 } );
	bubbleP.innerHTML = "Here we have a <strong>supply</strong> card. Supplies are the single resource for Deck Wars, and most other cards require supplies before \
	you're able to play them. Go ahead and click the supply card to play it.";
	bubbleBtn.setAttribute('disabled',true);
	window.setTimeout( function() {
		document.querySelector('.hand .card').setAttribute('onclick', 'introSupply2()') ;
	},110);
}

// Explain + Play Supply
function introSupply2() {
	sfx_slide.play();
	document.querySelector('.hand .card').remove();
	document.querySelector('.player .sup').textContent = '0/3';

	// Draw Infantry
	drawCardConfirmed( {'type': 'infantry', 'id' : 'inf1', 'unit' : 1 } );
	window.setTimeout( function() {
		buoy.addClass( document.querySelector('.hand .card'), 'disable' );
	},110);

	bubbleP.innerHTML = "Whenever you play a supply card, you automatically draw a new card from your deck. Although this <em>sounds</em> like an easy way to draw infinite cards, \
	one thing to remember is <strong>supplies are limited</strong>. Each player only has <strong>25</strong> of them, so you have to play your cards carefully. <strong>If you run out of supplies, you lose!</strong>";
	bubbleBtn.removeAttribute('disabled',true);
	bubbleBtn.setAttribute('onclick', 'introSupply2pt5()') ;
}

function introSupply2pt5() {
	buoy.addClass(document.querySelector('.game'), 'showDeck');
	bubbleP.textContent = "By the way, in a normal game you'll see this deck on the bottom left of your screen, showing you a (proper) count of how many cards you \
	have left in your deck. We'll just hide that for now though, as it won't be necessary for this tutorial."
	bubbleBtn.setAttribute('onclick', 'introSupply3()') ;
}

function introSupply3() {
	buoy.removeClass(document.querySelector('.game'), 'showDeck');
	bubbleP.innerHTML = "Anyway, note that your supplies have been added to the <strong>top left corner</strong> (the left half of the screen is your side, the right is your opponent). \
	You are using <strong>0 of 3</strong> supplies. Now, look at the <strong>unit card</strong> for a moment...";
	bubbleBtn.setAttribute('onclick', 'introUnit()') ;
}

// Explain Infantry (units)
function introUnit() {
	buoy.removeClass( document.querySelector('.hand .card'), 'disable' );
	bubbleP.innerHTML = 'Unit cards are always green. They always have 3 stats: <span style="color:#E44141">Attack Power</span>, <span style="color:#4178E4">Defense</span>, \
	and <span style="color: #CEB527">supply cost</span>. The icons <em>below</em> these stats \
	indicate <strong>traits</strong>. Keep this in mind when we come across combo cards. For now, click to play the unit.'
	bubbleBtn.setAttribute('disabled',true);
	document.querySelector('.hand .card').setAttribute('onclick', 'introUnit2()') ;
}

// Play Infantry
function introUnit2() {
	sfx_slide.play();
	document.querySelector('.player li:nth-child(3)').appendChild(document.querySelector('.hand .card'));
	buoy.addClass( document.querySelector('li .card'), 'unit' );
	document.querySelector('.player .atk').textContent = '1';
	document.querySelector('.player .def').textContent = '1';

	bubbleP.innerHTML = "Note that the <span style='color:#E44141'>attack</span> and <span style='color:#4178E4'>defense</span> stats on the top have been updated now! \
	However, infantry units don't use up any supplies (as you can see in its stats). We are now at 1 <span style='color:#E44141'>ATK</span>/1 <span style='color:#4178E4'>DEF</span> vs our opponent's 0/0...";

	document.querySelector('li .card').removeAttribute('onclick');
	bubbleBtn.removeAttribute('disabled');
	bubbleBtn.setAttribute('onclick', 'introUnit3()') ;
}

// Explain Field (Stats, Goal of Round)
function introUnit3() {
	bubbleP.innerHTML = "So, notice that the <span style='color:#E44141'>attack</span> stat on top is highlighted. This indicates whether you are the <strong>attacker or defender</strong> for <em>this</em> round. As the \
	attacker, your goal is to <strong>surpass</strong> your opponent's <span style='color:#4178E4'>defense</span> with <em>your</em> <span style='color:#E44141'>attack</span> this round. \
	The moment you do, your turn is over. However, right before it ends, you have the <strong>option</strong> of playing 1 more card. We won't do that for now, so go ahead end your turn.";
	bubbleBtn.textContent = 'End Turn';
	bubbleBtn.setAttribute('onclick', 'opponent()') ;
}

// Explain End of Turn Draw
function opponent() {
	notify('red', 'Ended Turn');
	buoy.removeClass(document.querySelector('.player'), 'myturn');
	drawCardConfirmed( {'type': 'at', 'id' : 'combo1', 'combo' : 1 } );
	window.setTimeout( function() {
		buoy.addClass( document.querySelector('.hand .card'), 'disable' );
	},110);

	bubbleP.textContent = "At the end of your turn, you will always auto draw a certain amount of cards; in a normal game, your hand will always \
		have at least 8 cards when you end your turn. We'll check out our new card after our opponent plays though. (Note how your left half has faded, to indicate it's no longer your turn)"
	bubbleBtn.textContent = 'Next';
	bubbleBtn.setAttribute('onclick', 'opponent2()') ;
}

// Opponent plays Supply
function opponent2() {
	sfx_slide.play();
	notify('yellow', "<img src='images/cards/supply.png'> Supply was played");
	document.querySelector('.opponent .sup').textContent = '0/3';
	bubbleP.innerHTML = "Whenever your opponent plays a card, you'll receive a notification on top showing that card. You'll receive notifications for other things as \
	well (as you may have noticed already). Some notifications will <strong>stick</strong> on top until you perform the action it's asking you to do, so pay attention!";
	bubbleBtn.setAttribute('onclick', 'opponent3()') ;
}

// Play Recon
function opponent3() {
	sfx_slide.play();
	drawCardConfirmed( {'type': 'recon', 'id' : 'recon', 'combo' : 1 } );

	window.setTimeout( function() {
		var rec = document.querySelector('.opponent li:nth-child(3)').appendChild( document.getElementById('recon') );
		buoy.addClass( rec, 'unit' );
	},110);

	notify('u', "<img src='images/cards/unit_recon.png'> Unit was played");
	document.querySelector('.opponent .atk').textContent = '3';
	document.querySelector('.opponent .def').textContent = '2';
	document.querySelector('.opponent .sup').textContent = '1/3';

	// Explain Unit Bonus
	bubbleP.innerHTML = "If you hover over your opponent's unit, you will notice some extra text along the bottom. This unit has a <strong>bonus</strong>. What this means is \
	that when the unit the bonus is against (in this case, a <strong>foot</strong> denotes an infantry-type unit) is <em>present on the opponsing field</em>, the bonus is activated. In this case, his \
	attack has been raised from 1 to 3."
	bubbleBtn.setAttribute('onclick', 'opponent4()') ;
}

// End Opponent Turn
function opponent4() {
	bubbleP.innerHTML = "However, as the <strong>defender</strong>, your opponent's goal is to surpass OR <strong>match</strong> (attackers must always <strong>surpass</strong>) your \
	attack with <em>his</em> defense. He has done this, and will choose not to play another card, so get ready for your turn!";
	bubbleBtn.setAttribute('onclick', 'newturn()') ;
}

// Play Combo
function newturn() {
	buoy.addClass(document.querySelector('.player'), 'myturn');
	notify('green', 'Your Turn');
	bubbleP.innerHTML = "Back to our new combo card. Combos are attached to units to enhance certain stats. You can easily tell which stat they enhance at a glance: \
	Red cards enhance attack, blue cards enhance defense. You might notice the star and icon on the left. Remember about unit <strong>traits</strong>?";
	bubbleBtn.setAttribute('onclick', 'newturn2()') ;
}

// Explain Combo Attach/Enhancements
function newturn2() {
	bubbleP.textContent = "Well, as you might guess, this combo requires a matching trait from 1 unit (since it only has 1 star). It just so happens that this combo \
	perfectly matches your current unit, so go ahead and click your combo! You will then have to choose which unit to play it on, by clicking the appropriate slot it's in.";
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
	buoy.removeClass(document.querySelector('.player'), 'myturn');
	notify('red', 'Ended Turn');
	
	bubbleBtn.removeAttribute('disabled');
	
	var slot = document.querySelector('.player li.active');
	buoy.addClass( slot, 'combo' );
	buoy.addClass( slot, 'atk' );

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

		window.setTimeout( function() {
			[].forEach.call(document.querySelectorAll('.card'), function(card) {
				buoy.addClass(card, 'disable');
			});
		},110);
		
	});
}

// Opponent plays Helo
function opponent6() {
	drawCardConfirmed( {'type': 'helo', 'id' : 'helo', 'combo' : 1 } );
	var helo;

	window.setTimeout( function() {
		helo = document.querySelector('.opponent li:nth-child(2)').appendChild( document.getElementById('helo') );
		buoy.addClass( helo, 'unit' );
	},110);

	notify('u', "<img src='images/cards/unit_helo.png'> Unit was played");
	document.querySelector('.opponent .atk').textContent = '5';
	document.querySelector('.opponent .def').textContent = '4';
	document.querySelector('.opponent .sup').textContent = '3/3';

	// Explain Unit Bonus
	bubbleP.innerHTML = "Your opponent has played a helicopter. Just a reminder, but check out the new <strong>traits</strong> on this one. Also, you can see \
	your opponent has now reached his current supply limit, he'll have to play a 2nd one on his next turn to continue playing units. Keeping your opponent's supply \
	usage in mind will help you come up with better strategies."
	bubbleBtn.setAttribute('onclick', 'swapTime()') ;
}

// Enable Swap 3
function swapTime() {
	[].forEach.call(document.querySelectorAll('.card'), function(card) {
		buoy.removeClass(card, 'disable');
		buoy.addClass(card, 'choose');
	});

	buoy.addClass(document.querySelector('.player'), 'myturn');
	notify('green', 'Your Turn');
	notify('yellow', 'Choose 3 cards to swap out and hit done.', 1);
	// Explain Swap 3
	bubbleP.textContent = "All right, one more mechanic you'll encounter in a real match is that at the start of your turn you are given the chance to \
	swap out 3 cards for new ones. This can either help you out win this round or be used to set up a hand for the next! You can of course opt to keep your current \
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
		document.querySelector('.sticky').remove();
		if (document.querySelector('.notify:not(.bubble)')) document.querySelector('.notify:not(.bubble)').remove();
		[].forEach.call(document.querySelectorAll('.hand .card'), function(card) {
			card.remove();
		});

		// Draw AA/Supply/Tank
		drawCardConfirmed( {'type': 'aa', 'id' : 'aa', 'unit' : 1 } );
		drawCardConfirmed( {'type': 'supply', 'id' : 'supply', 'supply' : 1 } );
		drawCardConfirmed( {'type': 'tank', 'id' : 'tank', 'combo' : 1 } );

		bubbleP.textContent = "Sweet, we got some new cards, and these are actually useful! Thanks to the opponent's helo, your AA unit's bonus will activate \
		when played. However, look at your cards carefully. We want to play ALL 3 this turn for maximum power. Keeping your attack and supply count in mind, can you figure out the correct order?";

		window.setTimeout( function() {
			document.querySelector('#supply').setAttribute('onclick', 'swapTime3("s")') ;
			document.querySelector('#aa').setAttribute('onclick', 'swapTime3("a")') ;
			document.querySelector('#tank').setAttribute('onclick', 'swapTime3("t")') ;
		},110);
		
		bubbleBtn.setAttribute('disabled', true) ;
	} else {
		notify('yellow', 'Choose 3 cards to swap out and hit done.');
	}
}

// Play Sup + AA
function swapTime3(e) {
	if (e==="s") {
		document.querySelector('#supply').remove();
		document.querySelector('.player .sup').textContent = '1/6';

		bubbleP.textContent = "Good choice. By playing supplies first, you can avoid having to end your turn right now. Playing either unit first means \
		you would surpass their defense, and only have 1 card left to play. Also, by playing the supply first, you get that free draw which gives the chance for \
		an even better card to join your hand!"

		drawCardConfirmed( {'type': 'shell', 'id' : 'shell', 'combo' : 1 } );

		document.querySelector('#aa').setAttribute('onclick', 'swapTime4("aa")') ;
		document.querySelector('#tank').setAttribute('onclick', 'swapTime4("tank")') ;

		window.setTimeout( function() {
			document.querySelector('#shell').setAttribute('onclick', 'notify("red","Combo doesn\'t match any units in play! Check stars for formation/required traits.")') ;
		},110);
		
	} else if (e==="a") {
		bubbleP.textContent = "Nope! Look carefully. The AA costs 1 supply to play. If you play this now, your attack will go up to 6 (thanks to bonus), which means you'll \
		have to end your turn. You can't play the tank as your final card since you lack supplies, so you'd be left playing the supplies and waiting your next turn to play the tank! Choose again.";
	} else if (e==="t") {
		bubbleP.textContent = "Nope! Look carefully. A tank costs 2 supplies to play. If you play this now, your attack will go up to 5, which means you'll \
		have to end your turn. You can't play the AA as your final card since you lack supplies, so you'd be left playing the supplies and waiting your next turn to play AA! Choose again.";
	}
}

// Explain Formations
function swapTime4(e) {
	bubbleP.innerHTML = "Whoa! What are these new buttons you ask? When playing your second unit (or beyond) you have to decide where to place your units. \
	Did you see that new combo you got when you played your supply? It requires 2 armor units side by side. This is why you must plan your <strong>formations</strong> (the order of your units on the field). \
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
				sfx_slide.play();

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
					bubbleP.textContent = "All right, one more card to play and our turn will automatically end. The standard formation size is 3 units, only the attacker \
					can opt to expand the field to play a 4th or (max) 5th unit, but this comes with some risks...(go ahead and play your last unit)";
				}
				if (document.querySelectorAll('.player .unit').length===3) {
					buoy.removeClass(document.querySelector('.player'), 'myturn');
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

	window.setTimeout( function() {
		[].forEach.call(document.querySelectorAll('.hand .card'), function(el) {
			buoy.addClass(el, 'disable');
		});
	},110);
	

	bubbleBtn.setAttribute('onclick', 'opponent8()') ;
	bubbleBtn.removeAttribute('disabled') ;
	bubbleBtn.textContent = 'Next';

	// Explain Slot Limit
	bubbleP.textContent = "What risks come with an extra unit? For starters, it means using up more previous supplies. Maybe you have a weak \
	hand & are better off losing this 1 point? Also, for every extra unit on the field, the strongest attacker will win an extra point too (So 4 units means 2 points). \
	Lastly, by staying with 3 units we also know our opponent can only play 1 more unit, limiting his options.";

	window.setTimeout( function() { 
		sfx_slide.play();
		notify('yellow', "<img src='images/cards/supply.png'> Supply was played") ;
		document.querySelector('.opponent .sup').textContent = "3/6";
	}, 600 );
}

// Opp. plays A2G
function opponent8() {
	bubbleP.innerHTML = "Your opponent still has you in a bind though! Not only has he matched your attack, he is also surpassing YOUR defense with HIS attack. Normally \
	only the attacker will win points for winning, but if the defender pulls of this trick (a <strong>counterattack</strong>), he will win the point at the end of this round! (and had \
		you expanded the field, then he'll win the bonus points too)";

	bubbleBtn.setAttribute('onclick', 'finalPlay()') ;

	drawCardConfirmed( {'type': 'a2g', 'id' : 'a2g', 'combo' : 1 } );
	var a2g;
	window.setTimeout( function() {
		a2g = document.querySelector('.opponent li:nth-child(4)').appendChild( document.getElementById('a2g') );
		buoy.addClass( a2g, 'unit' );
	},110);
	

	notify('u', "<img src='images/cards/unit_a2g.png'> Unit was played");
	document.querySelector('.opponent .atk').textContent = '9';
	document.querySelector('.opponent .def').textContent = '8';
	document.querySelector('.opponent .sup').textContent = '6/6';
}

// Play Sap + Explain Commanders
function finalPlay() {
	buoy.addClass(document.querySelector('.player'), 'myturn');
	notify('green', 'Your Turn');
	bubbleP.innerHTML = "No worries though. we can handle it. One last card type to explain in this tutorial is the <strong>commander card</strong>. Commander cards are similar to combos, in that they provide units \
	with stat boosts, except commander boosts apply across your whole field (they don't attach to just 1 unit). Click my card to activate my bonus!";
	
	bubbleBtn.setAttribute('disabled', true) ;
	var sap = document.getElementById('saptiva');
	buoy.removeClass(sap, 'disable');
	sap.setAttribute('onclick','finalPlay2()');
}

// Play 1 more, End Turn
function finalPlay2() {
	sfx_slide.play();
	document.getElementById('saptiva').remove();
	notify('red', 'You surpassed their defense! Play 1 more card & your turn will end (or end it now)');
	document.querySelector('.player .atk').textContent = '9';
	document.querySelector('.player .def').textContent = '6';
	bubbleP.textContent = "With only 1 infantry on the field, the boost is small, but it's just enough to put you in the lead again. \
	To really scare your opponent go ahead and play your final card.";

	buoy.removeClass(document.getElementById('shell'), 'disable');
	document.getElementById('shell').setAttribute('onclick','finalPlay3()');
}

// Explain one more bit on formation
function finalPlay3() {
	bubbleP.innerHTML = "With a <strong>2 star</strong> combo (in this case, we need 2 <strong>armor-type</strong> units side by side, which we do since we planned our formation earlier) you \
	can choose either of the matching 2 units to apply it to. This is important to keep in mind for strategies in the future, particularly once you \
	customize decks, so you can purposely leave a specific unit open to other combos.";
	buoy.addClass( document.getElementById('tank').parentNode, 'active');
	buoy.addClass( document.getElementById('aa').parentNode, 'active');
	document.getElementById('tank').parentNode.setAttribute('onclick','finalPlay4("tank")');
	document.getElementById('aa').parentNode.setAttribute('onclick','finalPlay4("aa")');
}

// Win
function finalPlay4(e) {
	buoy.removeClass(document.querySelector('.player'), 'myturn');
	notify('red', 'Ended Turn');
	document.querySelector('.player .atk').textContent = '11';
	document.querySelector('.player .sup').textContent = '6/6';

	[].forEach.call(document.querySelectorAll('li.active'), function(el) {
		buoy.removeClass(el, 'active');
		el.removeAttribute('onclick');
	});

	sfx_slide.play();
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
	bubbleP.textContent = "POW! With that, your attack is much higher (and more difficult) for your opponent to match. Will he manage to pull off some miracle in the end!?";
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

	bubbleP.innerHTML = "NOPE! Guess he had nothing left to play (or he's plotting your demise next round). Good job! One final thing for this tutorial: \
	As the winner, you automatically get to <strong>keep all your units</strong> (they are placed back into your draw pile). You also get to <strong>choose</strong> 1 combo to save! \
	Meanwhile, the loser <strong>discards all his combos</strong> & can only save <strong>one unit</strong>. Both players however, <strong>discard all their used supplies & any used commanders.</strong>";
	
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
	bubbleP.innerHTML = "Nice job! That wraps up the tutorial. Good luck on the battlefield soldier! Feel free to report any bugs you find (this is an alpha prototype after all) on <a href='https://github.com/mastastealth/dwo/issues'>Github</a> \
	or tweet them to <a href='http://twitter.com/brianfranco'>@brianfranco</a>, thanks!";
	bubbleBtn.textContent = "Finish";
	bubbleBtn.setAttribute('onclick','wipeGame()');
}
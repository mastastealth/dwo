// Make .game active
buoy.addClass(document.querySelector('.game'), 'active');
buoy.addClass(document.querySelector('.game'), 'tut');
buoy.addClass(document.querySelector('.player'), 'attacker');
buoy.addClass(document.querySelector('.player'), 'myturn');
buoy.removeClass(document.querySelector('.hand'), 'disable');

var opponentDeck = [
	{'0' : '0'}
];

// Listed bottom to top
var tutDeck = [
	{'type': 'tankgirl', 'id' : 'tankgirl', 'hash' : 0, 'co' : 1 },
	{'type': 'stinger', 'id' : 'stinger', 'hash' : 0, 'combo' : 1 },
	{'type': 'htank', 'id' : 'htank2', 'hash' : 0, 'unit' : 1 },
	{'type': 'supply', 'id' : 'sup2', 'hash' : 0, 'supply' : 1 },
	{'type': 'supply', 'id' : 'sup2', 'hash' : 0, 'supply' : 1 },
	{'type': 'htank', 'id' : 'htank', 'hash' : 0, 'unit' : 1 },
	{'type': 'supply', 'id' : 'sup2', 'hash' : 0, 'supply' : 1 },
	{'type': 'shell', 'id' : 'c1', 'hash' : 0, 'combo' : 1 },
	{'type': 'aa', 'id' : 'aa', 'hash' : 0, 'unit' : 1 },
	{'type': 'supply', 'id' : 'sup1', 'hash' : 0, 'supply' : 1 },
	{'type': 'tank', 'id' : 'tank', 'hash' : 0, 'unit' : 1 } // This is drawn FIRST
];

// Set up a fake game state
myTurn = true;
properCards = md5(cardType);
attacker = true;
document.querySelector('.hand').setAttribute('data-count',tutDeck.length);
var tutStep = 0;

// End Turn
var endTurn = document.querySelector('.hand').appendChild( document.createElement('button') );
endTurn.innerHTML = "End Turn";
buoy.addClass(endTurn,'turn');
endTurn.setAttribute('disabled','true');

endTurn.addEventListener('click', endTutTurnListener);

function endTutTurnListener() {
	buoy.addClass( document.querySelector('.sticky'), 'un');
	window.setTimeout( function() { document.querySelector('.un.sticky').remove(); }, 500);

	myTurn = false;
	buoy.removeClass( document.querySelector('.player'), 'myturn');
	endTurn.setAttribute('disabled','true');

	// Add to history
	addHistory('endt','player');

	buoy.addClass(document.querySelector('.hand'),'disable');
	notify('red', 'Ended Turn');
	forceEnd = 0;

	switch (tutStep) {
		case 2:
			oppPlay1();
			break;
		case 6:
			oppPlay2();
			break;
		case 7:
			oppPlay3();
			break;
		case 9:
			oppPlay4();
			break;
		case 11:
			window.setTimeout( function() { oppPlay5(); }, 1000);
			break;
	}
}

// Create Bubble + Intro Text
var bubble = document.querySelector('.game').appendChild( document.createElement('div') );
buoy.addClass(bubble,'bubble');
buoy.addClass(bubble,'hide');
buoy.addClass(bubble,'notify');
var bubbleP = bubble.appendChild( document.createElement('p') );
var bubbleBtn = bubble.appendChild( document.createElement('button') );

window.setTimeout( function() {
	bubbleP.innerHTML = "<span>Welcome to Deck Wars Online (web prototype)! \
	Battle with units & surpass your enemy's <span style='color:#4178E4'>defense</span> to win points! \
	Click cards in your hand to play them.</span> <aside><img src='images/misc/tut1.png'></aside>";
	bubbleBtn.setAttribute('onclick', 'intro()') ;
	bubbleBtn.textContent = "Continue";

	buoy.removeClass(bubble,'hide');
	buoy.addClass( document.querySelector('.hand'), 'disable' );
},1000);

document.querySelector('.hand').addEventListener('click', tutClickCheck );

function tutClickCheck(e) {
	if (!buoy.hasClass(e.target,'card')) return false;
	switch (tutStep) {
		case 1:
			if (document.querySelector('h1 .sup').getAttribute('data-sup') === "3") {
				bubbleP.innerHTML = "<span><span style='color: #CEB527'>Supplies</span> are needed to fuel your army. \
				You only get <strong>25</strong> supply cards in a deck, \
				so use them wisely!</span> <aside><img src='images/misc/tut2.png'></aside>";
				bubbleBtn.setAttribute('onclick', 'intro2()') ;
				buoy.removeClass(bubble,'hide');
				buoy.addClass( document.querySelector('.hand'), 'disable' );

				window.setTimeout( function() { buoy.addClass( document.getElementById('aa'), 'disable' ); },110 );
			}
			break;
		case 2:
			bubbleP.innerHTML = "<span>Whenever an attacker's <span style='color:#E44141'>attack</span> <em>surpasses</em> a defender's <span style='color:#4178E4'>defense</span>, they'll get \
			one last chance to play a card (if they can afford it) before the turn ends and the defender begins his.</span> <aside><img src='images/misc/tut2.png'></aside>";
				bubbleBtn.setAttribute('onclick', 'killInfo()') ;
				buoy.removeClass(bubble,'hide');
			break;
		case 5:
			if (e.target.getAttribute('data-type') === 'aa') {
				bubbleP.innerHTML = "<span>Some cards have bonus stats against others! You can hover over an enemy unit at any time to check \
				it's traits (the row of icons along the bottom) & see if it matches the bonus on your card.</span> <aside><img src='images/misc/tut4.png'></aside>";
				bubbleBtn.setAttribute('onclick','killInfo()') ;
				buoy.removeClass(bubble,'hide');
				buoy.addClass( document.querySelector('.hand'), 'disable' );
				tutStep = 6;
			}
			break;
		case 7:
			if (document.querySelector('h1 .sup').getAttribute('data-sup') === "6" && e.target.getAttribute('data-type') === 'shell') {
				bubbleP.innerHTML = "<span>Boosters require specific formations to be played. Read the stars \
				on the card to know what units you need, in what order. Units that meet requirements are highlighted to \
				attach the booster to.</span> <aside><img src='images/misc/tut5.png'></aside>";
				bubbleBtn.setAttribute('onclick','killInfo()') ;
				buoy.removeClass(bubble,'hide');
				buoy.addClass( document.querySelector('.hand'), 'disable' );
			}
			break;
		case 8:
			if (document.querySelector('h1 .sup').getAttribute('data-sup') === "12") tutStep = 9;
			break;
		case 10:
			if (e.target.getAttribute('data-type') === 'tankgirl') {
				bubbleP.innerHTML = "<span>Generals are like global booster cards. You can only have 1 during a round, but they'll \
				enhance all matching cards on the field! Onward to victory!</span> <aside><img src='images/misc/tut7.png'></aside>";
				bubbleBtn.setAttribute('onclick','killInfo()') ;
				buoy.removeClass(bubble,'hide');
				buoy.addClass( document.querySelector('.hand'), 'disable' );
				tutStep = 11;
			}
			break;
	}
}

function tutOppEndTurn() {
	myTurn = true;
	buoy.addClass( document.querySelector('.player'), 'myturn');

	// Add to history
	addHistory('endt','opponent');
	buoy.removeClass(document.querySelector('.hand'),'disable');
	notify('green', 'Your Turn');
}

// Disable intructions
function killInfo() {
	buoy.addClass(bubble,'hide');
	buoy.removeClass( document.querySelector('.hand'),'disable');
}

// Draw Supply Card (or *try* to play Tank)
function intro() {
	killInfo();
	drawCardConfirmed(tutDeck.pop(),100);
	drawCardConfirmed(tutDeck.pop(),200);
	tutStep = 1;
}


// Finish Turn (play Tank)
function intro2() {
	killInfo();
	tutStep = 2;
}

// Opponent Plays
function oppPlay1() {
	tutStep = 3;
	drawCardConfirmed(tutDeck.pop(),100);

	window.setTimeout( function() { playCard({'type': 'supply', 'id' : 'esup1', 'hash' : 0, 'supply' : 1 },'opponent'); }, 1200);
	window.setTimeout( function() { playCard({'type': 'helo', 'id' : 'eu1', 'hash' : 0, 'unit' : 1 },'opponent'); }, 3000);
	window.setTimeout( function() { tutOppEndTurn(); }, 3600);
	window.setTimeout( function() { intro3(); }, 4500);
}

// Explains roles
function intro3() {
	tutStep = 5;
	bubbleP.innerHTML = "<span>Similarly, when a <span style='color:#4178E4'>defender</span> surpasses <strong>or</strong> \
	<em>matches</em> their opponent's <span style='color:#E44141'>attack</span>, they too will end their turn. \
	Make sure to attack harder!</span> <aside><img src='images/misc/tut3.png'></aside>";
	bubbleBtn.setAttribute('onclick', 'killInfo()') ;
	buoy.removeClass(bubble,'hide');
	buoy.addClass( document.querySelector('.hand'), 'disable' );
	buoy.removeClass( document.getElementById('aa'), 'disable' );
}

// Enemy plays A2G
function oppPlay2() {
	tutStep = 7;
	drawCardConfirmed(tutDeck.pop(),100);

	window.setTimeout( function() { playCard({'type': 'supply', 'id' : 'esup2', 'hash' : 0, 'supply' : 1 },'opponent'); }, 1200);
	window.setTimeout( function() { placeUnit('next',{'type': 'a2g', 'id' : 'eu2', 'hash' : 0, 'unit' : 1 },'opponent','eu2'); }, 3000);
	window.setTimeout( function() { tutOppEndTurn(); }, 4500);
}

// Enemy plays Wingman
function oppPlay3() {
	tutStep = 8;
	drawCardConfirmed(tutDeck.pop(),100);
	window.setTimeout( function() { comboCard('eu2',{'type': 'wingman', 'id' : 'eu2', 'hash' : 0, 'unit' : 1 },'opponent'); }, 1500);
	window.setTimeout( function() { tutOppEndTurn(); }, 3500);
}

// Enemy plays Wingman
function oppPlay4() {
	tutStep = 10;
	drawCardConfirmed(tutDeck.pop(),100);
	drawCardConfirmed(tutDeck.pop(),200);
	window.setTimeout( function() { playCard({'type': 'supply', 'id' : 'esup3', 'hash' : 0, 'supply' : 1 },'opponent'); }, 1000);
	window.setTimeout( function() { playCard({'type': 'supply', 'id' : 'esup4', 'hash' : 0, 'supply' : 1 },'opponent'); }, 1900);
	window.setTimeout( function() { placeUnit('next',{'type': 'harty', 'id' : 'esup2', 'eu3' : 0, 'unit' : 1 },'opponent'); }, 4000);
	window.setTimeout( function() { tutOppEndTurn(); }, 6000);
	window.setTimeout( function() { intro5(); }, 7500);
}

function intro5() {
	bubbleP.innerHTML = "<span>Defenders can't play anymore units (max is 3) <em>unless</em> the attacker expands the field \
	with a 4th (or 5th) unit. Now's your chance to finish him!</span> <aside><img src='images/misc/tut6.png'></aside>";
	bubbleBtn.setAttribute('onclick', 'killInfo()') ;
	buoy.removeClass(bubble,'hide');
	buoy.addClass( document.querySelector('.hand'), 'disable' );
}

function oppPlay5() {
	resetField(1,false,false);
	bubbleP.innerHTML = "<span>Your opponent has surrendered! You win this round and 1 point for surpassing his defense. After \
	every round players swap the attacker/defender role and the game continues until someone reaches 6 points \
	(or runs out of supplies)!</span> <aside><img src='images/misc/tut8.png'></aside>";
	bubbleBtn.setAttribute('onclick','outro()') ;
	buoy.removeClass(bubble,'hide');
	buoy.addClass( document.querySelector('.hand'), 'disable' );
	tutStep = 12;
}

function outro() {
	bubbleP.innerHTML = "<span>And now you know the basics. You're now ready \
	to battle against your friends. Feel free to report any bugs you find (this is a \
	prototype after all) on <a href='https://github.com/mastastealth/dwo/issues'>Github</a> \
	or tweet them to <a href='http://twitter.com/brianfranco'>@brianfranco</a>, thanks and enjoy!</span> \
	<aside><img src='images/misc/tut9.png'></aside>";
	bubbleBtn.textContent = "Finish";
	buoy.removeClass(bubble,'hide');
	bubbleBtn.setAttribute('onclick','finishTut()') ;
}

function finishTut() {
	document.querySelector('.hand').removeEventListener('click', tutClickCheck );
	myTurn = false; attacker = false;
	wipeGame();

	// Clear all this stuff
	endTutTurnListener = null;
	tutClickCheck = null;
	tutOppEndTurn = null;
	killInfo = null;
	intro = null;
	intro2 = null;
	intro3 = null;
	intro4 = null;
	intro5 = null;
	oppPlay = null;
	oppPlay2 = null;
	oppPlay3 = null;
	oppPlay4 = null;
	oppPlay5 = null;
	outro = null;
}
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
	{'type': 'retreat', 'id' : 'retreat3', 'hash' : 0, 'combo' : 1 },
	{'type': 'reactive', 'id' : 'reactive2', 'hash' : 0, 'combo' : 1 },
	{'type': 'supply', 'id' : 'sup9', 'hash' : 0, 'supply' : 1 },
	{'type': 'supply', 'id' : 'sup8', 'hash' : 0, 'supply' : 1 },
	{'type': 'aa', 'id' : 'aa', 'hash' : 0, 'unit' : 1 },
	{'type': 'retreat', 'id' : 'retreat2', 'hash' : 0, 'combo' : 1 },
	{'type': 'supply', 'id' : 'sup7', 'hash' : 0, 'supply' : 1 },
	{'type': 'a2g', 'id' : 'a2g', 'hash' : 0, 'unit' : 1 },
	{'type': 'reinforce', 'id' : 'reinforce', 'hash' : 0, 'combo' : 1 },
	{'type': 'tank', 'id' : 'tank', 'hash' : 0, 'unit' : 1 },
	{'type': 'drone', 'id' : 'drone', 'hash' : 0, 'unit' : 1 },
	{'type': 'supply', 'id' : 'sup6', 'hash' : 0, 'supply' : 1 },
	{'type': 'infantry', 'id' : 'infantry1', 'hash' : 0, 'unit' : 1 },
	{'type': 'patrol', 'id' : 'patrol', 'hash' : 0, 'combo' : 1 },
	{'type': 'retreat', 'id' : 'retreat', 'hash' : 0, 'combo' : 1 },
	{'type': 'reactive', 'id' : 'reactive', 'hash' : 0, 'combo' : 1 },
	{'type': 'tstrike', 'id' : 'tstrike', 'hash' : 0, 'combo' : 1 },
	{'type': 'squad', 'id' : 'squad', 'hash' : 0, 'combo' : 1 },
	{'type': 'supply', 'id' : 'sup5', 'hash' : 0, 'supply' : 1 },
	{'type': 'tank', 'id' : 'tank2', 'hash' : 0, 'unit' : 1 },
	{'type': 'supply', 'id' : 'sup4', 'hash' : 0, 'supply' : 1 },
	{'type': 'tankgirl', 'id' : 'tankgirl', 'hash' : 0, 'co' : 1 },
	{'type': 'stinger', 'id' : 'stinger', 'hash' : 0, 'combo' : 1 },
	{'type': 'htank', 'id' : 'htank2', 'hash' : 0, 'unit' : 1 },
	{'type': 'supply', 'id' : 'sup3', 'hash' : 0, 'supply' : 1 },
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
var endRound;

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
			oppPlay(1);
			break;
		case 6:
			oppPlay(2);
			break;
		case 7:
			oppPlay(3);
			break;
		case 9:
			oppPlay(4);
			break;
		case 11:
			window.setTimeout( function() { oppPlay(5); }, 2000);
			break;
		case 12:
			oppPlay(6);
			break;
		case 13:
			oppPlay(7);
			break;
		case 14:
			oppPlay(8);
			break;
		case 15:
			oppPlay(9);
			break;
		case 16:
			oppPlay(10);
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
var bubbleBtn2;

// Starter function
window.setTimeout( function() {
	bubbleP.innerHTML = "<span>Welcome to Deck Wars Online (web prototype)! \
	Battle with units & surpass your enemy's <span style='color:#4178E4'>defense</span> to win points! \
	Click cards in your hand to play them.</span> <aside><img src='images/misc/tut1.png'></aside>";
	bubbleBtn.setAttribute('onclick', 'intro()') ;
	bubbleBtn.textContent = "Continue";

	buoy.removeClass(bubble,'hide');
	buoy.addClass( document.querySelector('.hand'), 'disable' );
},1000);

// Temp Defense Testing Starter
// window.setTimeout( function() {
// 	myTurn = false;
// 	attacker = false;
// 	tutWin(1);
// 	tutStep = 12;
// 	buoy.addClass(document.querySelector('.opponent'), 'attacker');
// 	buoy.removeClass(document.querySelector('.player'), 'attacker');
// 	buoy.removeClass(document.querySelector('.player'), 'myturn');
// 	tutDeck = tutDeck.slice(0,tutDeck.length-8);
// 	drawCardConfirmed(tutDeck.pop(),100);
// 	drawCardConfirmed(tutDeck.pop(),200);
// 	tutDeck.pop();
// 	window.setTimeout( function() { defTut(1); },300);
// },1000);

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
	if (document.querySelector('.end')) document.querySelector('.end').removeAttribute('disable');

	// Add to history
	addHistory('endt','opponent');
	buoy.removeClass(document.querySelector('.hand'),'disable');
	notify('green', 'Your Turn');
}

function tutWin(p) { 
	//var victoryPts += parseInt(p); 
	document.querySelector('.player .outpost').textContent = p;
	// Add to history
	addHistory('endr','player','Won Round');
	//if (!atkr && a > d) { addHistory('counter','player'); }
}

// Disable intructions
function killInfo() {
	buoy.addClass(bubble,'hide');
	if (myTurn) buoy.removeClass( document.querySelector('.hand'),'disable');
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
function oppPlay(n) {
	switch (n) {
		case 1:
			tutStep = 3;
			drawCardConfirmed(tutDeck.pop(),100);

			window.setTimeout( function() { playCard({'type': 'supply', 'id' : 'esup1', 'hash' : 0, 'supply' : 1 },'opponent'); }, 1200);
			window.setTimeout( function() { playCard({'type': 'helo', 'id' : 'eu1', 'hash' : 0, 'unit' : 1 },'opponent'); }, 3000);
			window.setTimeout( function() { tutOppEndTurn(); }, 3600);
			window.setTimeout( function() { intro3(); }, 4500);
			break;
		case 2:	// Enemy plays A2G
			tutStep = 7;
			drawCardConfirmed(tutDeck.pop(),100);

			window.setTimeout( function() { playCard({'type': 'supply', 'id' : 'esup2', 'hash' : 0, 'supply' : 1 },'opponent'); }, 1200);
			window.setTimeout( function() { placeUnit('next',{'type': 'a2g', 'id' : 'eu2', 'hash' : 0, 'unit' : 1 },'opponent','eu2'); }, 3000);
			window.setTimeout( function() { tutOppEndTurn(); }, 4500);
			break;
		case 3: // Enemy plays Wingman
			tutStep = 8;
			drawCardConfirmed(tutDeck.pop(),100);
			window.setTimeout( function() { comboCard('eu2',{'type': 'wingman', 'id' : 'eu2', 'hash' : 0, 'combo' : 1 },'opponent'); }, 1500);
			window.setTimeout( function() { tutOppEndTurn(); }, 3500);
			break;
		case 4: // Enemy plays Wingman
			tutStep = 10;
			drawCardConfirmed(tutDeck.pop(),100);
			drawCardConfirmed(tutDeck.pop(),200);
			window.setTimeout( function() { playCard({'type': 'supply', 'id' : 'esup3', 'hash' : 0, 'supply' : 1 },'opponent'); }, 1000);
			window.setTimeout( function() { playCard({'type': 'supply', 'id' : 'esup4', 'hash' : 0, 'supply' : 1 },'opponent'); }, 1900);
			window.setTimeout( function() { placeUnit('next',{'type': 'harty', 'id' : 'eharty2', 'hash' : 0, 'unit' : 1 },'opponent','eu3'); }, 4000);
			window.setTimeout( function() { tutOppEndTurn(); }, 6000);
			window.setTimeout( function() { intro5(); }, 7500);
			break;
		case 5:
			resetField(1,false,false);
			tutWin(1);
			bubbleP.innerHTML = "<span>Your opponent has surrendered! You win this round and 1 point for surpassing his defense. After \
			every round players swap the attacker/defender role and the game continues until someone reaches 6 points \
			(or runs out of supplies)!</span> <aside><img src='images/misc/tut8.png'></aside>";
			bubbleBtn.setAttribute('onclick','outro()') ;
			buoy.removeClass(bubble,'hide');
			buoy.addClass( document.querySelector('.hand'), 'disable' );
			tutStep = 12;
			break;
		case 6:
			window.setTimeout( function() { playCard({'type': 'supply', 'id' : 'esup5', 'hash' : 0, 'supply' : 1 },'opponent'); }, 1000);
			window.setTimeout( function() { placeUnit('next',{'type': 'drone', 'id' : 'eu5', 'hash' : 0, 'unit' : 1 },'opponent','eu5'); }, 2000);
			window.setTimeout( function() { comboCard('eu4',{'type': 'cstrike', 'id' : 'strike', 'hash' : 0, 'combo' : 1 },'opponent'); }, 3500);
			if ( parseInt(document.querySelector('.player h1 .def').textContent)<7 ) {
				window.setTimeout( function() { tutOppEndTurn(); }, 4000);
				window.setTimeout( function() { defTut(3); }, 4500);
			} else {
				window.setTimeout( function() { placeUnit('prev',{'type': 'arty', 'id' : 'eu6', 'hash' : 0, 'unit' : 1 },'opponent','eu5'); }, 4000);
				window.setTimeout( function() { tutOppEndTurn(); }, 4700);
				window.setTimeout( function() { defTut(3); }, 5500);
			}
			break;
		case 7:
			window.setTimeout( function() { playCard({'type': 'supply', 'id' : 'esup6', 'hash' : 0, 'supply' : 1 },'opponent'); }, 1100);

			if ( document.querySelector('.player .unit[data-type=htank]') || document.querySelector('.player .unit[data-type=tank]') ) {
				window.setTimeout( function() { comboCard('eu5',{'type': 'at', 'id' : 'at', 'hash' : 0, 'combo' : 1 },'opponent'); }, 3500);
			} else if ( document.querySelector('.player .unit[data-type=a2g]') ) {
				window.setTimeout( function() { comboCard('eu5',{'type': 'stinger', 'id' : 'stngr', 'hash' : 0, 'combo' : 1 },'opponent'); }, 3500);
			} else {
				window.setTimeout( function() { comboCard('eu5',{'type': 'cstrike', 'id' : 'cstr', 'hash' : 0, 'combo' : 1 },'opponent'); }, 3500);
			}

			window.setTimeout( function() { tutOppEndTurn(); }, 4200);
			window.setTimeout( function() { defTut(4); }, 5300);
			break;
		case 8:
			drawCardConfirmed(tutDeck.pop(),100);
			drawCardConfirmed(tutDeck.pop(),200);
			window.setTimeout( function() { 
				playCard({'type': 'supply', 'id' : 'esup7', 'hash' : 0, 'supply' : 1 },'opponent'); 
			}, 800);
			window.setTimeout( function() { 
				placeUnit('prev',{'type': 'arty', 'id' : 'eu6', 'hash' : 0, 'unit' : 1 },'opponent','eu6'); 
			}, 3600);
			window.setTimeout( function() { tutOppEndTurn(); }, 4200);
			window.setTimeout( function() { defTut(5); }, 5300);
			break;
		case 9:
			// If he messed up with patrol
			if ( parseInt(document.querySelector('.player h1 .def').textContent)<=13 ) {
				window.setTimeout( function() { comboCard('eu6',{'type': 'shell', 'id' : 'eshl', 'hash' : 0, 'combo' : 1 },'opponent'); }, 1500);
			} else {
				window.setTimeout( function() { comboCard('eu6',{'type': 'shell', 'id' : 'eshl', 'hash' : 0, 'combo' : 1 },'opponent'); }, 1500);
				window.setTimeout( function() { placeUnit('prev',{'type': 'helo', 'id' : 'eu7', 'hash' : 0, 'unit' : 1 },'opponent','eu7'); }, 3200);
			}
			window.setTimeout( function() { tutOppEndTurn(); }, 4200);
			window.setTimeout( function() { defTut(6); }, 5300);
			break;
		case 10:
			resetField(1,false,false);
			tutWin(3);
			bubbleP.innerHTML = "<span>Your opponent has surrendered again! Normally defenders don't win points, however if you \
			manage to surpass the attacker's defense <em>as</em> a defender, you pull off a <strong>counter-attack</strong> and earn \
			the points for that round!</span> <aside><img src='images/misc/tut16.png'></aside>";
			bubbleBtn.setAttribute('onclick','outro(1)') ;
			buoy.removeClass(bubble,'hide');
	}
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

function intro5() {
	bubbleP.innerHTML = "<span>Defenders can't play anymore units (max is 3) <em>unless</em> the attacker expands the field \
	with a 4th (or 5th) unit. Now's your chance to finish him!</span> <aside><img src='images/misc/tut6.png'></aside>";
	bubbleBtn.setAttribute('onclick', 'killInfo()') ;
	buoy.removeClass(bubble,'hide');
	buoy.addClass( document.querySelector('.hand'), 'disable' );
}

function outro(n) {
	bubbleP.innerHTML = "<span>And now you know the basics. You're now ready \
	to battle against your friends. Feel free to report any bugs you find (this is a \
	prototype after all) on <a href='https://github.com/mastastealth/dwo/issues'>Github</a> \
	or tweet them to <a href='http://twitter.com/brianfranco'>@brianfranco</a>, thanks and enjoy!</span> \
	<aside><img src='images/misc/tut9.png'></aside>";
	bubbleBtn.textContent = "Finish";
	bubbleBtn.style.display = 'inline-block';
	bubbleBtn2 = bubble.appendChild( document.createElement('button') );
	bubbleBtn2.textContent = "Continue with Defender Tutorial";
	bubbleBtn2.style.display = 'inline-block';
	bubbleBtn2.style.marginLeft = '10px';
	buoy.removeClass(bubble,'hide');
	bubbleBtn.setAttribute('onclick','finishTut()') ;
	bubbleBtn2.setAttribute('onclick','defTut(1)') ;

	if (n===1) { bubbleBtn.style.display = 'block'; bubbleBtn2.remove(); }
}

function defTut(n) {
	switch (n) {
		case 1:
			// Remove the saved 3, throw em at start
			tutDeck.unshift( tutDeck.pop() );
			tutDeck.unshift( tutDeck.pop() ); //DISABLE FOR TESTING
			tutDeck.unshift( tutDeck.pop() );
			// Now draw
			drawCardConfirmed(tutDeck.pop(),100);
			drawCardConfirmed(tutDeck.pop(),200);
			drawCardConfirmed(tutDeck.pop(),300);
			drawCardConfirmed(tutDeck.pop(),400);
			drawCardConfirmed(tutDeck.pop(),500);
			drawCardConfirmed(tutDeck.pop(),600);
			killInfo();

			window.setTimeout( function() { playCard({'type': 'supply', 'id' : 'esup5', 'hash' : 0, 'supply' : 1 },'opponent'); }, 1200);
			window.setTimeout( function() { playCard({'type': 'arty', 'id' : 'eu4', 'hash' : 0, 'unit' : 1 },'opponent'); }, 3000);
			window.setTimeout( function() { tutOppEndTurn(); defTut(2); }, 5000);
			break;
		case 2:
			swapThree();
			bubbleP.innerHTML = "<span>Normally at the start of your turn, you'll get the \
			chance to swap out 3 cards. You currently have 3 red (attack enhancing) booster cards \
			that you won't really need this round as defender...</span> \
			<aside><img src='images/misc/tut11.png'></aside>";
			bubbleBtn.style.display = 'block';
			if (bubbleBtn2) bubbleBtn2.remove();
			bubbleBtn.textContent = "Continue";
			bubbleBtn.setAttribute('onclick','killInfo()') ;
			buoy.removeClass(bubble,'hide');
			break;
		case 3:
			swapThree();
			bubbleP.innerHTML = "<span>The 2 bright blue cards are special, <em>action</em> boosters. \
			These are slightly different from regular boosters in that they are played to allow an action and are discarded immediately. \
			Retreat any units you've played that will block the Patrol booster.</span> \
			<aside><img src='images/misc/tut12.png'></aside>";
			buoy.removeClass(bubble,'hide');
			tutStep = 13;
			break;
		case 4:
			swapThree();
			bubbleP.innerHTML = "<span>Hopefully by now you're only missing 1 air unit to complete the Patrol booster \
			requirements. Swap any other cards to try and draw that needed plane!</span> \
			<aside><img src='images/misc/tut13.png'></aside>";
			buoy.removeClass(bubble,'hide');
			tutStep = 14;
			break;
		case 5:
			swapThree();
			var endRound = document.querySelector('.hand').appendChild( document.createElement('button') );
			endRound.innerHTML = "End Round";
			buoy.addClass(endRound,'end');
			endRound.setAttribute('disabled','true');

			endRound.addEventListener( 'click', function() {
				bubbleP.innerHTML = "<span>Welp, I guess you messed that one up. Feel free to try the tutorial again, or go ahead and \
				get some real practice against a friend! Good luck!</span> \
				<aside><img src='images/misc/tut17.png'></aside>";
				buoy.removeClass(bubble,'hide');
				bubbleBtn.textContent = "Finish";
				bubbleBtn.setAttribute('onclick','finishTut()') ;
				bubbleBtn.style.display = 'block';
				if (bubbleBtn2) bubbleBtn2.remove();
			});

			bubbleP.innerHTML = "<span>If you played your cards right, you should be able to use the Patrol booster now! If not, \
			you still might have a chance, but you better keep that new <strong>End Round</strong> button handy. When you run out of plays, you use \
			this button to admit defeat for that round.</span> \
			<aside><img src='images/misc/tut14.png'></aside>";
			buoy.removeClass(bubble,'hide');
			tutStep = 15;
			break;
		case 6:
			bubbleP.innerHTML = "<span>Normally when attackers expand the field, you can choose to retreat ALL your units back to your deck \
			and surrender the point OR continue the battle but risk the stakes of playing for extra points. You can do it!</span> \
			<aside><img src='images/misc/tut15.png'></aside>";
			buoy.removeClass(bubble,'hide');
			tutStep = 16;
			break;
	}
	console.log(tutStep);
}

function simpleRedeck() {
	drawCardConfirmed(tutDeck.pop(),100);
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
	defTut = null;
	simpleRedeck = null;
	outro = null;
	bubble = null;
	bubbleBtn = null;
	bubbleBtn2 = null;
	bubbleP = null;
}
/*jslint browser: true*/
/*global $, jQuery, alert*/
/*jslint plusplus: true */
/*jslint vars: true */


var sequence = [],
    seqCopy = [],
    userGood = true,
    buttonsPressable = false,
    firstTimeOnly = false,
    userSound,
    roundCounter = 0;


//will return a random number from 1-4 representing colors of the simon game.
function randomNumber() {
    "use strict";
    return (Math.floor(Math.random() * 4) + 1);
}

//simple way to get back a double digit for round
function getRound() {
    "use strict";
    roundCounter += 1;
    if (roundCounter < 10) {
        document.getElementById("digNum").textContent = ("0" + roundCounter);
    } else if (roundCounter >= 100) {
        roundCounter = 0;
        getRound();
    } else {
        document.getElementById("digNum").textContent = roundCounter;
    }
}

//CREATE SEQUENCE INFO//
//AUDO CREATION//

function whichAudio(num) {
    "use strict";
    switch (num) {
    case 1:
        return 250;
    case 2:
        return 300;
    case 3:
        return 350;
    case 4:
        return 400;
    case 5:
        return 200;
    }
}

function setupAudio(num) {
    "use strict";
    var context, oscillator, freqValue, gainNode;
    context = "";
    context = new (window.AudioContext || window.webkitAudioContext  || false)();
    if (context) {
        oscillator = context.createOscillator();
        gainNode = context.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        freqValue = whichAudio(num);
        oscillator.frequency.value = freqValue;
        oscillator.start();
        return function turnOff() {
//            if (oscillator) {
//            oscillator.stop();
//            oscillator.disconnect();
//            context.close().catch(function() {});
//            }
            oscillator.stop();
            oscillator.disconnect();
            context.close();
        };
    } else {
        alert('Audio Not Supported In Current Browser');
    }
}


//VISUAL CREATION//
//used in showSequence, this returns what class will be added.
function whichToLight(num) {
    "use strict";
    switch (num) {
    case 1:
        return 'blueLit';
    case 2:
        return 'redLit';
    case 3:
        return 'yellowLit';
    case 4:
        return 'greenLit';
    }
}

//This shows the sequence. Timing is important to make sure things aren't to fast and that the correct sequence is shown in order.
function showSequence() {
    "use strict";
    var i = 0,
        interval = setInterval(function () {
            var lightUp = whichToLight(sequence[i]),
                $wedge = $('[data-wedge=' + sequence[i] + ']').addClass(lightUp),
                soundOn = setupAudio(sequence[i]);
            window.setTimeout(function () {
                $wedge.removeClass(lightUp);
                soundOn();
            }, 300);
            i++;
            if (i >= sequence.length) {
                clearInterval(interval);
            }
        }, 700);
}

// used to create the array, the numbers represent the colors.
function createSequence() {
    "use strict";
    sequence.push(randomNumber());
    seqCopy = sequence.slice(0);  //gets entire sequence by leaving out the 2nd number makes it grab all
    showSequence();
}

function liteAll() {
    "use strict";
    var lightIt;
    for (var i = 1; i <= 4; i++) {
        lightIt = whichToLight(i);
        $('[data-wedge=' + i + ']').addClass(lightIt);
    }
}

function unliteAll() {
    "use strict";
    var lightIt;
    for (var i = 1; i <= 4; i++) {
        lightIt = whichToLight(i);
        $('[data-wedge=' + i + ']').removeClass(lightIt);
    }
}

//GAMEOVER AREA//
//following two functions are separate to make digital numbers flash, called in gameOver function
function showNum() {
    "use strict";
    document.getElementById('digNum').style.visibility = "visible";
}

function hideNum() {
    "use strict";
    document.getElementById('digNum').style.visibility = "hidden";
}

function gameOver() {
    "use strict";
    var lostSound;
    buttonsPressable = false; 
    lostSound = setupAudio(5);
    setTimeout(lostSound, 800);
    //this will make digital numbers blink
    for (var i = 900; i < 3600; i += 900) {
        setTimeout(hideNum, i);
        setTimeout(liteAll, i);
        setTimeout(showNum, i + 450);     
        setTimeout(unliteAll, i + 450); 
    }
}

//TEST CLICK AND CONTROL MOUSE UP/DOWN//
//this tests for the user inputs to see if they match the sequence.
function testClick(e) {
    "use strict";
    if (buttonsPressable) {
        var correctResponse = seqCopy.shift(),
            userResponse = $(e.target).data('wedge');
        userGood = (correctResponse === userResponse);
        if (seqCopy.length === 0 && userGood) {
            newRound();
        } else if (!userGood) {
            gameOver();
        }
    }
}

//this is for the mouse down event, it adds the class to make the area appear to light up.
function makeLit(e) {
    "use strict";
    if (buttonsPressable) {
        var userResponse = $(e.target).data('wedge'),
            $wedge,
            lightUp = whichToLight(userResponse);
        $wedge = $(e.target).addClass(lightUp);
        userSound = setupAudio(userResponse);
    }
}

//this is for the mouse up event, it removes the class to go back to normal state
function removeLit(e) {
    "use strict";
    if (buttonsPressable) {
        var userResponse = $(e.target).data('wedge'),
            $wedge,
            lightUp = whichToLight(userResponse);
        $wedge = $(e.target).removeClass(lightUp);
        userSound();
    }
}

//STARTUP GAME//
//used to both start game and to create the next round in the game
function newRound() {
    "use strict";
    getRound();
    createSequence();
}

//when start button is pushed we clean things up and call newRound to begin game
function startGame() {
    "use strict";
    sequence = [];
    seqCopy = [];
    userGood = true;
    roundCounter = 0;
    buttonsPressable = true;
    if (!firstTimeOnly) {
        enableButtons();
    }
    newRound();
}

//this function deals with user input, on click/mouse down/mouse up
function enableButtons() {
    "use strict";
    firstTimeOnly = true;
    if (buttonsPressable) {
        $('.simon').on('click', '[data-wedge]', function (e) {
            testClick(e);
        });
        $('.simon').on('mousedown', '[data-wedge]', function (e) {
            makeLit(e);
        });
        $('.simon').on('mouseup', '[data-wedge]', function (e) {
            removeLit(e);
        });
    } 
}

document.getElementById("startButton").addEventListener("click", startGame);

var footerDate = (function() {
    var today = new Date(),
        year = today.getFullYear(),
        el = document.getElementById('footer');
    el.innerHTML = "<p>&copy;" + year + " Erik Nuber";
    
}());
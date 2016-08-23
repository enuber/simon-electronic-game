# simon-electronic-game
recreation of Simon Electronic Game

Created a version of the classic Simon Electronic game. The creation of sound for each button push and sequence shown was 
the biggest challenge. This wasn't something I was familiar with so had to figure out how to use it. It wasn't just about having 
the oscillator to create the noise but, to use a gainNode and ultimately for different noise I set the frequency to different levels 
based on which button was being pushed or, if the game was over.

In order to keep the sound turning on and off within the same function, I used closure to return a function that turned off the 
oscillator.

An enjoyable little project espeically designing the look of the simon game with CSS. I used shadowing to differentiate a resting state and when the button is pressed. I also gave the area holding the round count a red inner glow using shadow as well. 

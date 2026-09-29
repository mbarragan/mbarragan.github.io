var timePerCycle = 45; //33
var generalDelay = 8*timePerCycle; // for doors and shot on actors animations
var timerGeneral = 60*timePerCycle; // the time the doors keep totally open
var delay = timerGeneral;
var score = 0;
var lives = 3;
const doorsPerLevel = 15;
const shotSound = new sound("resources/shot.mp3");
const moneySound = new sound("resources/money.mp3");
const killedSound = new sound("resources/killed.mp3");
var doorsLeft = doorsPerLevel;
var level = 1;
// modes are: 0: intro, 1: game, 2: game over
var mode = 0;

// create a canvas to work with
var canvas = document.createElement("canvas");
document.body.appendChild(canvas);

// style canvas
canvas.id     = "canvas";
canvas.width  = 598;
canvas.height = 320;
canvas.y = 0;
canvas.setAttribute("style", "border: 1px solid #d8d837;");

// get 2D context
var context = canvas.getContext("2d");

const door1 = {x:60, y:65, width: 126, height: 198 };
const door2 = {x:257, y:65, width: 126, height: 198 };
const door3 = {x:453, y:65, width: 126, height: 198 };
var doors = [ door1, door2, door3];
const capitel1 = {x:100, y:4, width: 45, height: 42 };
const capitel2 = {x:300, y:4, width: 45, height: 42 };
const capitel3 = {x:495, y:4, width: 45, height: 42 };
var capitels = [capitel1, capitel2, capitel3];

//0: Empty, 1:charging animation 1, 2:charging, 3: charging animation 2,
//4: Player dead.
var capitelsStatus = [0, 0, 0];
var doorsStatus = [0,0,0]; //All doors are closed
//Actors are: 1:lady, 2:banditSlow, 3:hatter, 4:tallCustomer, 5: ,
//6:fatBandit, 7:gamblerCustomer, 8:gamblerRobber
var actors = [0,0,0]; // no actors chosen yet.
//basic values are: 0:alive, 1:shot, 2:lying,
var actorsStatus = [0,0,0]; //All actors are alive

var actorsTimers = [0,0,0]; // delays for actors when door is fully open. Not set yet.
var actorsSubTimers = [ generalDelay, generalDelay, generalDelay]; // delays for actors actions like being shot.
var actorsAnimationTimers = [ generalDelay*.5, generalDelay*.5, generalDelay*.5];
var doorsTimers = [ generalDelay, generalDelay, generalDelay]; // delays for doors.
var collisions = [false, false, false];

// place holders for mouse x,y and shots position
var mouseX = 0;
var mouseY = 0;
var posShotX = -1;
var posShotY = -1;

var hijacked;

// update mouse position
canvas.onclick = function(e) {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
};

// test for collision between an object and a point
function contains(target, x, y) {
  return (x >= target.x && x <= target.x + target.width && y >= target.y && y <= target.y + target.height);
}

// loop
var interval = setInterval(onTimerTick, timePerCycle);

///////////////////////////////////////////// main loop //////////////////////////////////////////////
function onTimerTick() {
  // clear the canvas
  canvas.width = canvas.width;

  if( mode === 0) { // Intro
    if( delay - timePerCycle > 0) {
      delay -= timePerCycle;
      showIntroScreen();
    } else {
      delay = generalDelay;
      mode = 1;
    }
  } else if( mode === 2) { // game over
    showGameoverScreen();
  } else {

    // see if a collision happened
    collisions[0] = contains(doors[0], mouseX, mouseY);
    collisions[1] = contains(doors[1], mouseX, mouseY);
    collisions[2] = contains(doors[2], mouseX, mouseY);

    if(collisions[0]) {
      posShotX = doors[0].x + doors[0].width*.5 - 13;
      posShotY = doors[0].y + doors[0].height*.5 + 12;
    } else if(collisions[1]) {
      posShotX = doors[1].x + doors[1].width*.5 - 13;
      posShotY = doors[1].y + doors[1].height*.5 + 12;
    } else if(collisions[2]) {
      posShotX = doors[2].x + doors[2].width*.5 - 13;
      posShotY = doors[2].y + doors[2].height*.5 + 12;
    }

    for( let i= 0; i < 3; i++) {
      if( doorsStatus[i] === 0) { //door is closed
        let shouldOpen = Math.floor(Math.random() * 20); // 0 to 19
        if( shouldOpen < 1) { //door will open. Let's chose who is behind the door.
          let choseActor = Math.floor(Math.random() * 10);
          initializeActor( i, choseActor);
          doorsStatus[i] = 1;
        }
      } else { // door is openning or closing
        if (doorsStatus[i] !== 3) { // not totally open
          doorsTimers[i] -= timePerCycle;
          if( doorsTimers[i] < 0) {
            doorsStatus[i] ++;
            if( doorsStatus[i] === 6) { //door is closed again
              doorsStatus[i] = 0;
              actors[i] = 0;
              actorsTimers[i] = 0;
              // TODO Aquí se ingresa
            }
            doorsTimers[i] = generalDelay;
          }
        } else { //Door is open.
          if( actorsTimers[i] - timePerCycle > 0) {
            actorsTimers[i] -= timePerCycle;
          } else {
            doorsStatus[i] ++;
            if( doorsStatus[i] !== 3 && doorsTimers[i] > generalDelay) {
              doorsTimers[i] = generalDelay;
            }
          }
        }
      }
    }

    context.drawImage(imgBackground, 25, 49, 568, 231);

    for( let i = 0; i < 3; i++) {
      if( doorsStatus[i] === 0) {
        context.drawImage( imgDoor, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
        if( doorsLeft !== 0) {
          context.drawImage( imgChargeEmpty, capitels[i].x, capitels[i].y, capitels[i].width, capitels[i].height);
        }
      } else {
        paintActor( i, actors[i]);
        paintDoor( i, doorsStatus[i]);
        paintCapitels( i, capitelsStatus[i]);
      }
    }

    context.fillStyle = "black";
    context.font="22px sans-serif";
    context.fillText("*", posShotX , posShotY);
    context.fillStyle = "white";
    context.font="9px sans-serif";
    context.fillText("+", posShotX + 2 , posShotY - 10);
    context.font="18px sans-serif";
    context.fillStyle = "white";
    if(posShotX !== -1) {
      shotSound.play();
    }
    paintScoreBoard();

    mouseX = 0;
    mouseY = 0;
    posShotX = -1;
    posShotY = -1;
  }
} // end of game loop


function initializeActor(i, randomActor) {
  actorsStatus[i] = 0; //alive
  capitelsStatus[i] = 0;
  if( randomActor <= 2) { //is lady
    actors[i] = 1;
    actorsTimers[i] = timerGeneral;
    actorsSubTimers[i] = generalDelay;
  } else if( randomActor > 2 && randomActor < 6) { //bandit
    actors[i] = 2;
    actorsTimers[i] = timerGeneral;
    actorsSubTimers[i] = generalDelay;
  } else if( randomActor > 5 && randomActor < 9){ //hatter
    actors[i] = 3;
    actorsTimers[i] = timerGeneral;
  } else if( randomActor === 9) { // tall customer
    actors[i] = 4;
    actorsTimers[i] = timerGeneral;
    actorsSubTimers[i] = generalDelay;
    actorsAnimationTimers[i] = generalDelay*.5;
    hijacked = Math.floor(Math.random() * 2); // 0 to 1
  }
}

function paintActor( i, actor) {
  // lady *****************************************
  if( actor === 1) {
    if( !collisions[i] && actorsStatus[i] != 1) { // No shot
      if( actorsStatus[i] === 0) {
        context.drawImage( imgLady, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
        if( doorsStatus[i] === 3 && (actorsTimers[i] - timePerCycle <= 0)) {
          capitelsStatus[i] = 1;
          increaseScore(50);
        } else {
          if( doorsStatus[i] === 4) {
            capitelsStatus[i] = 2;
          } else if( doorsStatus[i] === 6) {
            capitelsStatus[i] = 3;
          }
        }
      } else {
        context.drawImage( imgLadyDead, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
      }
    } else { // SHOT
      if( doorsStatus[i] === 3) { //door fully open
        capitelsStatus[i] = 4;
        if( actorsStatus[i] === 0) {
          actorsStatus[i] ++;
        }
        if( actorsStatus[i] === 1) {
          if( actorsSubTimers[i] - timePerCycle > 0) {
            actorsSubTimers[i] -= timePerCycle;
            context.drawImage( imgLadyShot, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
          } else {
            actorsStatus[i] ++;
            context.drawImage( imgLadyDead, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
            increaseLives(-1);
          }
        } else {
          context.drawImage( imgLadyDead, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
        }
      } else { //lady was shot but hit the door. It removes black lag bug.
        if( actorsStatus[i] === 0) { //alive
          context.drawImage( imgLady, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
        } else { //was shot and is dead. We show his lying body
          context.drawImage( imgLadyDead, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
        }
      }
    }

    // slow bandit ************************************
  } else if( actor === 2) {
    if( !collisions[i] && actorsStatus[i] !== 1) { // No shot
      if( actorsStatus[i] === 0) {
        context.drawImage( imgSlowBandit, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
        if( doorsStatus[i] === 3 && (actorsTimers[i] - timePerCycle <= 0)) {
          capitelsStatus[i] = 4;
          increaseLives(-1);
        }
      } else {
        context.drawImage( imgSlowBanditDead, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
      }
    } else { // SHOT
      if( doorsStatus[i] === 3){ //door fully open
        if( actorsStatus[i] === 0) { // alive
          actorsStatus[i] ++;
          increaseScore(100);
        }
        if( actorsStatus[i] === 1) {
          if( actorsSubTimers[i] - timePerCycle > 0) {
            actorsSubTimers[i] -= timePerCycle;
            context.drawImage( imgSlowBanditShot, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
          } else {
            actorsStatus[i] ++;
            context.drawImage( imgSlowBanditDead, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
          }
        } else {
          context.drawImage( imgSlowBanditDead, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
        }
      } else { //slow bandit was shot but hit the door. It removes black lag bug.
        if( actorsStatus[i] === 0) { //alive
          context.drawImage( imgSlowBandit, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
        } else { //was shot and is dead. We show his lying body
          context.drawImage( imgSlowBanditDead, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
        }
      }
    }

  // hatter ******************************************
  } else if( actor === 3) {
    if( !collisions[i]) { // No shot
      paintHatter(i);
      if( actorsStatus[i] === 9) {
        //if(doorsStatus[i] === 4) {
          capitelsStatus[i] = 2;
        //} else
        if( doorsStatus[i] === 6) {
          capitelsStatus[i] = 3;
        }
      }
    }
    else { // SHOT
      if( doorsStatus[i] === 3){ //door fully open
        if( actorsStatus[i] >= 0 && actorsStatus[i] <= 5) { // alive
          actorsStatus[i] ++;
          increaseScore(10);
        } else if( actorsStatus[i] === 6) {
          let bombOrMoney = Math.floor(Math.random() * 2) + 1; // 1 to 2
          actorsStatus[i] += bombOrMoney;
          increaseScore(10);
        } else if( actorsStatus[i] === 8) { // money
          capitelsStatus[i] = 1;
          increaseScore(50);
          actorsStatus[i] ++; //one only payment
        } else if( actorsStatus[i] === 7) { //this is a bomb
          capitelsStatus[i] = 4;
          increaseLives(-1);
        }
        paintHatter(i);
      } else { //hatter was shot but hit the door. It removes black lag bug.
        paintHatter(i);
      }
    }

  // tall customer *********************************************
  } else if( actor === 4) {

    if( actorsStatus[i] === 3) { //Shot or not
      if( doorsStatus[i] === 4) {
        doorsStatus[i] = 3;
        actorsTimers[i] = timerGeneral;
      }
      if( actorsAnimationTimers[i] - timePerCycle <= 0) {
        actorsStatus[i] = 4;
        actorsAnimationTimers[i] = generalDelay*.5;
        context.drawImage( imgTallCustomer, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
      } else {
        actorsAnimationTimers[i] -= timePerCycle;
        context.drawImage( imgTallCustomerExchange1, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
      }
    } else if( actorsStatus[i] === 4) {
        if( actorsAnimationTimers[i] - timePerCycle <= 0) {
          actors[i] = 2;
          actorsStatus[i] = 0;
          actorsAnimationTimers[i] = generalDelay*.5;
          actorsTimers[i] = timerGeneral;
          doorsTimers[i] = timerGeneral;
          context.drawImage( imgSlowBandit, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
        } else {
          actorsAnimationTimers[i] -= timePerCycle;
          context.drawImage( imgTallCustomerExchange2, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
        }
    } else if( !collisions[i] && (actorsStatus[i] === 0 || actorsStatus[i] === 2)) { // No shot
      if( actorsStatus[i] === 0) { // 0

        if( doorsStatus[i] === 3 && (actorsTimers[i] - timePerCycle <= actorsTimers[i] * .5)) { // actor hijacked? We need multiplo of timePerCycle!!
          actorsAnimationTimers[i] = generalDelay*.5;
          if( hijacked === 1) {
            actorsStatus[i] = 3;
            doorsStatus[i] = 3;
            doorsTimers[i] = timerGeneral; // door keep open another 3 seconds
          }
        } else {
          actorsTimers[i] -= timePerCycle;
        }
        context.drawImage( imgTallCustomer, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
        if( doorsStatus[i] === 3 && (actorsTimers[i] - timePerCycle <= 0)) {
          capitelsStatus[i] = 1;
          increaseScore(50);
        } else {
          if( doorsStatus[i] === 4) {
            capitelsStatus[i] = 2;
          } else if( doorsStatus[i] === 6) {
            capitelsStatus[i] = 3;
          }
        }
      } else if( actorsStatus[i] === 2){ // 2
        context.drawImage( imgTallCustomerDead, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
      }
    }
    else { // SHOT
     if( doorsStatus[i] === 3) { //door fully open
       if( actorsStatus[i] === 0) {
         actorsStatus[i] ++;
       }
       capitelsStatus[i] = 4;
       if( actorsStatus[i] === 1) {
         if( actorsSubTimers[i] - timePerCycle > 0) {
           actorsSubTimers[i] -= timePerCycle;
           context.drawImage( imgTallCustomerShot, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
         } else {
           actorsStatus[i] ++;
           context.drawImage( imgTallCustomerDead, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
           increaseLives(-1);
         }
       } else {
         context.drawImage( imgTallCustomerDead, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
       }
     } else { // It removes black lag bug.
       if( actorsStatus[i] === 0) { //alive
         context.drawImage( imgTallCustomer, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
       } else { //was shot and is dead. We show his lying body
         context.drawImage( imgTallCustomerDead, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
       }
     }

   } // end of SHOT tall customer

  }
}

function paintDoor( i, status) {
  if( status === 1 || status === 5) {
    context.drawImage( imgDoorSemiClosed, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
  } else if( status === 2 || status === 4) {
    context.drawImage( imgDoorSemiOpen, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
  }
}

function paintCapitels( i, status) {
  if( status === 0) {
    context.drawImage( imgChargeEmpty, capitels[i].x,capitels[i].y, capitels[i].width, capitels[i].height);
  } else if( status === 1) {
    context.drawImage( imgCharge1, capitels[i].x, capitels[i].y, capitels[i].width, capitels[i].height);
  } else if( status === 2) {
    context.drawImage( imgCharge2, capitels[i].x, capitels[i].y, capitels[i].width, capitels[i].height);
  } else if( status === 3) {
    context.drawImage( imgCharge3, capitels[i].x, capitels[i].y, capitels[i].width, capitels[i].height);
  } else if( status === 4) {
    context.drawImage( imgChargeDead, capitels[i].x, capitels[i].y, capitels[i].width, capitels[i].height);
  }
}

function paintHatter(i) {
  if( actorsStatus[i] === 0) {
    context.drawImage( imgHatter, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
  } else if( actorsStatus[i] === 1) {
    context.drawImage( imgHatter31, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
  } else if( actorsStatus[i] === 2) {
    context.drawImage( imgHatter32, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
  } else if( actorsStatus[i] === 3) {
    context.drawImage( imgHatter33, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
  } else if( actorsStatus[i] === 4) {
    context.drawImage( imgHatter34, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
  } else if( actorsStatus[i] === 5) {
    context.drawImage( imgHatter35, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
  } else if( actorsStatus[i] === 6) {
    context.drawImage( imgHatter36, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
  } else if( actorsStatus[i] === 7) {
    context.drawImage( imgHatter37, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
  } else {
    context.drawImage( imgHatter38, doors[i].x,doors[i].y, doors[i].width, doors[i].height);
  }
}

function paintScoreBoard() {
  context.font="18px sans-serif";
  context.fillText("Score:", 50, 310);
  context.fillStyle = "#d8d837";
  context.fillText(score, 107, 310);
  context.fillStyle = "white";
  context.fillText("Doors left:", 200, 310);
  context.fillStyle = "#d8d837";
  context.fillText(doorsLeft, 290, 310);
  context.fillStyle = "white";
  context.fillText("Level:", 360, 310);
  context.fillStyle = "#d8d837";
  context.fillText(level, 415, 310);
  context.fillStyle = "white";
  context.fillText("Lives:", 480, 310);
  context.fillStyle = "#d8d837";
  context.fillText(lives, 532, 310);
}

function printArrays() {
  console.log( actors + " | " + doorsStatus + " | " + actorsStatus + " | " + actorsTimers);
}


////////////////////////////////////// Score and lives //////////////////////////////////
function increaseScore(amount) {
  score += amount;
  if( amount === 50) {
    moneySound.play();
    doorsLeft --;
    if( doorsLeft === 0) {
      capitelsStatus = [2,2,2];
      for( let i = 0; i < 3; i++) {
        paintCapitels(i, 2);
      }
      increaseLives(0); //5 seconds pause and reset
    }
  }
}

function increaseLives(i) {
  lives += i;
  if( i !== 0) {
    killedSound.play();
  }
  if( lives <= 0) {
    clearInterval(interval);
    interval = null;
    timePerCycle = 45;
    generalDelay = 8*timePerCycle; // for doors and shot on actors animations
    timerGeneral = 60*timePerCycle;
    var millisecondsToWait = 3500;
    setTimeout(function() {
      mouseX = 0;
      mouseY = 0;
      posShotX = -1;
      posShotY = -1;
      reset();
      mode = 2;
      interval = setInterval(onTimerTick, timePerCycle);
    }, millisecondsToWait);

  } else {
    //Pause
    clearInterval(interval);
    interval = null;
    var millisecondsToWait = 5000;
    if( doorsLeft === 0) {
      millisecondsToWait = 7000;
    }
    setTimeout(function() {
      reset();
      if( doorsLeft === 0) {
        level ++;
        doorsLeft = doorsPerLevel;
        if(timePerCycle > 20) {
          timePerCycle -= 5;
          setTiming( timePerCycle);
        }
      }
      interval = setInterval(onTimerTick, timePerCycle);
    }, millisecondsToWait);
  }
}

function setTiming( cycle) {
  generalDelay = 8*cycle;
  timerGeneral = 60*cycle;
}

function reset() {
  delay = timerGeneral;
  doorsStatus = [0,0,0];
  actors = [0,0,0];
  actorsStatus = [0,0,0];
  actorsTimers = [0,0,0];
  actorsSubTimers = [ generalDelay, generalDelay, generalDelay];
  doorsTimers = [ generalDelay, generalDelay, generalDelay];
  collisions = [false, false, false];
  capitelsStatus = [0,0,0];
  mouseX, mouseY = 0;
  posShotX, posShotY = -1;
}

//////////////////////////////////// Intro message ///////////////////////////
function showIntroScreen() {
  context.font="26px sans-serif";
  context.fillStyle = "#d8d837";
  context.fillText("ManuBank",245, 130);
  context.font="16px sans-serif";
  context.fillStyle = "white";
  context.fillText("By Manuel Barragan", 350, 270);
}

//////////////////////////////////// Game over message ///////////////////////////
function showGameoverScreen() {
  collisions[1] = contains(doors[1], mouseX, mouseY);
  if(collisions[1]) {
    reset();
    mode = 1;
    lives = 3;
    doorsLeft = doorsPerLevel;
    score = 0;
    level = 1;
  }
  context.font="26px sans-serif";
  context.fillStyle = "#d8d837";
  context.fillText("Game  Over",245, 30);
  context.font="22px sans-serif";
  context.fillStyle = "white";
  context.fillText("Play again? ", 100, 150);
  paintScoreBoard();
  actorsStatus[1] = 0;
  paintActor(1,2);
  let imgDoorFrame = new Image();
  imgDoorFrame.src = "img/doorFrame.gif";
  context.drawImage( imgDoorFrame, doors[1].x - 13, doors[1].y - 15, 152, 228);
}



///////////////////////////////////// Load images ////////////////////////////////////////
var imgBackground = new Image();
var imgDoor = new Image();
var imgDoorSemiOpen = new Image();
var imgDoorSemiClosed = new Image();
var imgLady = new Image();
var imgLadyShot = new Image();
var imgLadyDead = new Image();
var imgSlowBandit = new Image();
var imgSlowBanditShot = new Image();
var imgSlowBanditDead = new Image();
var imgHatter = new Image();
var imgHatter31 = new Image();
var imgHatter32 = new Image();
var imgHatter33 = new Image();
var imgHatter34 = new Image();
var imgHatter35 = new Image();
var imgHatter36 = new Image();
var imgHatter37 = new Image(); //bomb
var imgHatter38 = new Image(); //money
var imgTallCustomer = new Image();
var imgTallCustomerShot = new Image();
var imgTallCustomerDead = new Image();
var imgTallCustomerExchange1 = new Image();
var imgTallCustomerExchange2 = new Image();
var imgCharge1 = new Image();
var imgCharge2 = new Image();
var imgCharge3 = new Image();
var imgChargeDead = new Image();
var imgChargeEmpty = new Image();


function preloader() {
	if (document.images) {
    imgBackground.src = "img/imgBackground.gif";
		imgDoor.src = "img/door.gif";
		imgDoorSemiOpen.src = "img/doorSemiOpen.gif";
		imgDoorSemiClosed.src = "img/doorSemiClosed.gif";
    imgLady.src = "img/lady.gif";
    imgLadyShot.src = "img/ladyShot.gif";
    imgLadyDead.src = "img/ladyDead.gif";
    imgSlowBandit.src = "img/slowBandit.gif";
    imgSlowBanditShot.src = "img/slowBanditShot.gif";
    imgSlowBanditDead.src = "img/slowBanditDead.gif";
    imgHatter.src = "img/hatter.gif";
    imgHatter31.src = "img/hatter31.gif";
    imgHatter32.src = "img/hatter32.gif";
    imgHatter33.src = "img/hatter33.gif";
    imgHatter34.src = "img/hatter34.gif";
    imgHatter35.src = "img/hatter35.gif";
    imgHatter36.src = "img/hatter36.gif";
    imgHatter37.src = "img/hatter37.gif";
    imgHatter38.src = "img/hatter38.gif";
    imgTallCustomer.src = "img/tallCustomer.gif";
    imgTallCustomerShot.src = "img/tallCustomerShot.gif";
    imgTallCustomerDead.src = "img/tallCustomerDead.gif";
    imgTallCustomerExchange1.src = "img/tallCustomerExchange1.gif";
    imgTallCustomerExchange2.src = "img/tallCustomerExchange2.gif";
    imgCharge1.src = "img/imgCharge1.gif";
    imgCharge2.src = "img/imgCharge2.gif";
    imgCharge3.src = "img/imgCharge3.gif";
    imgChargeDead.src = "img/imgChargeDead.gif";
    imgChargeEmpty.src = "img/imgChargeEmpty.gif";

	}
}
function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != "function") {
		window.onload = func;
	} else {
		window.onload = function() {
			if (oldonload) {
				oldonload();
			}
			func();
		};
	}
}
addLoadEvent(preloader);

/////////////////////////////// Sounds ///////////////////////////////
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

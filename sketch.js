/****Enemy defintions (STAR) */
let smartX = 1; //starting smart enemy X position on refresh
let smartY = 1; //starting smart enemy Y position on refresh
let dumbX1;  //starting dumb enemy X position on refresh
let dumbY1; //starting dumb enemy Y position on refresh
let dumbX2;  //starting dumb enemy X position on refresh
let dumbY2; //starting dumb enemy Y position on refresh
let dumbSpeed = 2.8; // speed of the dumb enemy
let dumbX1Direction = 1; // left or right
let dumbY1Direction = -1; // up or down
let dumbX2Direction = -1; // left or right
let dumbY2Direction = 1; // up or down
let outerRadius = 34;
let innerRadius = 30;
let numberOfSpikes = 50; 
let easing = 0.05; //Used to reduce the amount of "acceleration" towards the cursor
/** coins declarations */
let coins = [];
let maxCoins = 10;
let coinWidth = 5;
let coinHeight = 10;

/**Boundaries**/
let edge = 100;
let inner = edge + outerRadius;

/** score variable */
let score = 0;

let fasterBtn = document.querySelector("#faster-btn");
fasterBtn.addEventListener('click', function () {
    dumbSpeed += 1.0;
});
let slowerBtn = document.querySelector("#slower-btn");
slowerBtn.addEventListener('click', function () {
    dumbSpeed -= 1.0;
    if(dumbSpeed < 0) {
        dumbSpeed = 0;
    }
});
let scoreBoard = document.querySelector("#score");
console.log(scoreBoard);

setInterval(autoUpdateCoins, 5000);

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
  

/** updateCoins(), used to draw and remove coins on the screen based on a timeout. This is 
 * not player dependent.
*/
function autoUpdateCoins() {
    //generate a new coin add to beginning of queue with random positioning but constrained
    //within the inner playing field (where only the smart enemy hangs out)
    
    randomX = getRandomInt(inner, width - inner);
    randomY = getRandomInt(inner, height - inner);
    
    const newCoin = { 
        xPos: randomX,
        yPos: randomY
    }; 
    coins.unshift(newCoin);
    // if the number of coins in the queue (and hence on the screen) is more than the max
    // then remove the last one
    if(coins.length > maxCoins) {
        coins.pop();
    }
}

function checkCoinEaten(x, y) {
    //iterate through our coins array, check if x or y of the mouse is close
    for(let i = 0; i < coins.length; i++) {
        if(((x - coins[i].xPos) < 5) && ((y - coins[i].yPos) < 5)) {
            //found a match, remove the coin from the arry and increase the score
            coins.splice(i,1);            
            score++;
            let scoreBoard = document.querySelector("#score");
            scoreBoard.textContent = "Score: " + score;
        }
    }
}


function setup() {
  createCanvas(1000, 800);
  noStroke();
  frameRate(30);
  ellipseMode(RADIUS);
  rectMode(CORNERS);
  dumbX1 = width / 2;
  dumbY1 = height / 2;
  dumbX2 = (width / 2) - 50;
  dumbY2 = height / 2;
}

function draw() {
  background(200);

    
  checkCoinEaten(mouseX, mouseY);
  // Check if our cursor has been 'caught' by the smart enemy
  if((abs(mouseX - smartX) < outerRadius && abs(mouseY - smartY) < outerRadius) || (abs(mouseX - dumbX1) < outerRadius && abs(mouseY - dumbY1) < outerRadius) || (abs(mouseX - dumbX2) < outerRadius && abs(mouseY - dumbY2) < outerRadius)) {
    // we are caught, prompt the user if they want to play again
    if(confirm("You are caught! Play again?")) {
        smartX = 1;
        smartY = 1;
        dumbX1 = width / 2;
        dumbY1 = height / 2;
        dumbX2 = (width / 2) - 50;
        dumbY2 = height / 2;
        score = 0;
        redraw();
    }
  }

  /** calculate the movement of the dumb enemies */
  dumbX1 = dumbX1 + dumbSpeed * dumbX1Direction;
  dumbY1 = dumbY1 + dumbSpeed * dumbY1Direction;
  dumbX2 = dumbX2 + dumbSpeed * dumbX2Direction;
  dumbY2 = dumbY2 + dumbSpeed * dumbY2Direction;

  /** Determine if the dumb enemy exceeds the boundaries
   * if it does, then reverse the direction
   */
  if(dumbX1 > width - outerRadius || dumbX1 < outerRadius) {
    dumbX1Direction *= -1;
  }
  if(dumbY1 > height - outerRadius || dumbY1 < outerRadius) {
    dumbY1Direction *= -1;
  }
  if(dumbX2 > width - outerRadius || dumbX2 < outerRadius) {
    dumbX2Direction *= -1;
  }
  if(dumbY2 > height - outerRadius || dumbY2 < outerRadius) {
    dumbY2Direction *= -1;
  }

  /** calculate movement of the smart enemy */
  if (abs(mouseX - smartX) > 0.1) {
    smartX = smartX + (mouseX - smartX) * easing;
  }
  if (abs(mouseY - smartY) > 0.1) {
    smartY = smartY + (mouseY - smartY) * easing;
  }

  smartX = constrain(smartX, inner, width - inner);
  smartY = constrain(smartY, inner, height - inner);
  fill(63, 139, 206);
  rect(edge, edge, width - edge, height - edge);
  
  /* draw the smart enemy */
  fill(59,235,65);
  star(smartX,smartY,outerRadius,innerRadius,numberOfSpikes);
  /* draw the dumb enemies */
  fill(113,60,193)
  star(dumbX1,dumbY1,outerRadius,innerRadius,numberOfSpikes);
  fill(242,0, 218)
  star(dumbX2,dumbY2,outerRadius,innerRadius,numberOfSpikes);

  /* draw the coins */
  fill(255,255,0);
  for(let i = 0; i < coins.length; i++) {
    ellipse(coins[i].xPos, coins[i].yPos, coinWidth, coinHeight)
  }

}


function star(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius2;
      let sy = y + sin(a) * radius2;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * radius1;
      sy = y + sin(a + halfAngle) * radius1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }


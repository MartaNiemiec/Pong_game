// CANVAS

const canvas = document.querySelector('canvas');
const playerScoreText = document.querySelector('.score__player');
const aiScoreText = document.querySelector('.score__ai');

const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 400;
const cw = canvas.width;
const ch = canvas.height;
const cwHalf = cw/2;
const chHalf = ch/2;
const topCanvas = canvas.offsetTop;

// POPUPS
const welcomePopup = document.querySelector('.welcome')
const winnerPopup = document.querySelector(".winner");
// title in a welcomePopup 
const welcomeTitle = welcomePopup.firstElementChild;   
//resetButton
const resetButton = document.querySelector('.btn-reset');

// BALL SOUNDS
const ballTable = document.querySelector(".audioBallTable");
const ballPaddle = document.querySelector(".audioBallPaddle");
const applause = document.querySelector(".applause");
const lostGame = document.querySelector(".lostGame") 
const winPoint = document.querySelector(".winPoint") 
const lostPoint = document.querySelector(".lostPoint") 

// BALL
const ballRadius = 10;
let ballX = cwHalf;
let ballY = chHalf;
let ballSpeedX = (3.5+Math.random()) * ((3.5+Math.random()) < 4 ? -1 : 1); // between 3.5 and 4.5 ; positive or negative 
let ballSpeedY = ballSpeedX;

//PLAYERS
const playerX = 50;
const aiX = 830;
let playerY = 150;
let aiY = 150;

// PADDLES
const paddleHeight = 90;
const paddleWidth = 15;

// SCORES
let playerScore = 0;
let aiScore = 0;
let playerTotalScore = 0;
let aiTotalScore = 0;

// WINNING SCORE
let winningScore;

//WINNER
let winner;

// INTERVAl function
let int;

// AI paddle acceleration changes depending on the game level
let aiAccelerating = {
    slow: 0,
    medium: 0,
    fast: 0
}

// Ball's max speed changes depending on the game level
let ballMaxSpeed = 0;

// LOCAL STORAGE
let localStorageData = JSON.parse(localStorage.getItem('winnings')) || { 
    // ai: [],
    // player: [] 
    ai: 0,
    player: 0 
}; 


// DRAWING PADDLES
function player() {
    ctx.fillStyle = '#68FF95';
    ctx.fillRect(playerX, playerY, paddleWidth, paddleHeight);
}

function ai() {
    ctx.fillStyle = '#FFF966';
    ctx.fillRect(aiX, aiY, paddleWidth, paddleHeight);
}

// MOVE PADDLES
function playerPosition(e) {
    playerY = e.clientY - topCanvas - paddleHeight / 2;
    
    // prevent paddle from getting outside of the BOTTOM of the canvas 
    if (playerY >= ch - paddleHeight) {
    playerY = ch - paddleHeight;
    }

    // prevent paddle from getting outside of the TOP of the canvas
    if (playerY <= 0) {
    playerY = 0;
    }
}


function aiPosition() {
    const middlePaddle = aiY + paddleHeight / 2 ;
    
    // when the ball is on the ai side 
    if (ballX > cwHalf) {         
        if (middlePaddle - ballY > 180) {

            aiY -= aiAccelerating.fast; 
            // aiY -= 15; 
        } else if (middlePaddle - ballY > 40) {
            aiY -= aiAccelerating.medium;
            // aiY -= 7;
        } else if (middlePaddle - ballY < -180) {
            aiY += aiAccelerating.fast;
            // aiY += 15;
        } else if (middlePaddle - ballY < -40) {
            aiY += aiAccelerating.medium;
            // aiY += 7;

        }
    }

    // when the ball is on the player's side 
    if (ballX <= cwHalf && ballX > 90) {
        if (middlePaddle - ballY > 90) {

            aiY -= aiAccelerating.slow;
            // aiY -= 3;
        } 
        
        if (middlePaddle - ballY < -90) {
            aiY += aiAccelerating.slow;
            // aiY += 3;

        }
    }

    // when the paddle goes outside of the bottom of the canvas
    if (aiY >= ch - paddleHeight) {
        aiY = ch - paddleHeight;
    }

    // when the paddle goes outside of the top of the canvas
    if (aiY <= 0) {
        aiY = 0;
    }
}

// DRAWING TABLE
function table() {
    ctx.fillStyle = '#0E2E3C';
    ctx.fillRect(0, 0, cw, ch);

    // MIDDLE LINE
    const lineWidth = 6;
    const lineHeight = 16;
    
    for (let linePosition = 20; linePosition < ch; linePosition += 30) {
    ctx.fillStyle = "#C9FFD9";
    ctx.fillRect(cwHalf - lineWidth / 2, linePosition, lineWidth, lineHeight);
    }
}


// BALL'S MOVES
function ball() {
// DRAW BALL
    ctx.fillStyle = "#FFF"; 
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2, true);  //context.arc(x,y,r,sAngle,eAngle,counterclockwise);
    ctx.closePath();
    ctx.fill();


// BALL SPEED
    ballSpeed();

// BALL COLLISION WITH TOP AND BOTTOM OF THE CANVAS
    if (ballY - ballRadius < 0 || ballY + ballRadius > ch) {
    ballSpeedY = -ballSpeedY;
    speedUp();
    ballTable.play();
    }
    
// BALL COLLISION WITH PADDLES
    if (ballX - ballRadius <= playerX + paddleWidth && 
        ballY >= playerY - ballRadius && 
        ballY <= playerY + paddleHeight + ballRadius) { 

        ballSpeedX = -ballSpeedX;
        speedUp();
        ballPaddle.play();
    } 
    
    if (ballX + ballRadius  >= aiX && 
        ballY >= aiY - ballRadius && 
        ballY <= aiY + paddleHeight + ballRadius) {

        ballSpeedX = -ballSpeedX;
        speedUp();
        ballPaddle.play();
    } 
};

// BALL SPEED
function ballSpeed() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
}

// START POSITION OF THE BALL
function ballStartPosition() {
    ballY = chHalf;
    ballX = cwHalf;
}

function speedUp() {

    if (ballSpeedX > 0 && ballSpeedX < ballMaxSpeed) {
        ballSpeedX += .4;
        
    } else if (ballSpeedX < 0 && ballSpeedX > -ballMaxSpeed) {
        ballSpeedX -= .4;
        
    }

    if (ballSpeedY > 0 && ballSpeedY < ballMaxSpeed) {
        ballSpeedY += .4;
    } else if (ballSpeedY < 0 && ballSpeedY > -ballMaxSpeed) {

        ballSpeedY -= .4;
    }
}

// SET INTERVAL
function gameInterval() {
    int =  setInterval(() => {
        game();
        addScore();
    }, 1000 / 60);
}

// CLICK TO START THE GAME
function clickToStart() {
    canvas.addEventListener('click', init);
}

// PREVENT FROM CLICKING TO START THE GAME AGAIN AND SET INTERVAL
function init() {
    canvas.removeEventListener('click', init);
    gameInterval();
}

// SHOW SCORE
function schowScore () {
    playerScoreText.textContent = playerScore >= 10 ? playerScore : '0'+playerScore;
    aiScoreText.textContent = aiScore>= 10 ? aiScore : '0' + aiScore;
}

// SET EVERYTHING FOR THE NEW ROUND
function newRound() {

    gameOver();
    schowScore();
    ballSpeed();
    resetRound();

    clickToStart();
}

// ADD SCORE 
function addScore() {


    // add score for the ai
    if (ballX - ballRadius <= 0) {
        lostPoint.play();
        clearInterval(int);
        aiScore++;
        newRound();

    // add score for the player
    } else if (ballX + ballRadius >= cw) {
        winPoint.play();
        clearInterval(int);
        playerScore++;
        newRound();
    }

}

// SET EVERYTHING ON THE CANVAS IN THE INITIAL PLACE
function resetRound() {
    ballSpeedX = (3.5+Math.random()) * ((3.5+Math.random()) < 4 ? -1 : 1);;
    ballSpeedY = ballSpeedX;

    ballStartPosition();
    playerY = 150;
    aiY = 150;
    game();
}

// GAME DRAWING 
function game() {
    table();
    ball();
    player();
    ai();
    aiPosition();
}

// START THE GAME
function start() {
    canvas.addEventListener("mousemove", playerPosition);
    schowScore();
    canvas.removeEventListener('click', start);
    game();
    clickToStart();
}


// WELCOME POPUP
// choosing game level
function gameLevel() {
    const buttons = document.getElementsByClassName('level-btn');

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function() {
        var current = document.getElementsByClassName("btnActive");
        if (current.length > 0) { 
            current[0].className = current[0].className.replace(" btnActive", "");
            }
            this.className += " btnActive";
        });
    }

    document.addEventListener('click', function(e) {
        const target = e.target;
        const level = target.dataset.level;
        
        if ( level == 'easy') { 
            aiAccelerating.slow = 2;
            aiAccelerating.medium = 4;
            aiAccelerating.fast = 10;
            ballMaxSpeed = 6;
        } else if (level == 'medium') {
            aiAccelerating.slow = 3;
            aiAccelerating.medium = 7;
            aiAccelerating.fast = 15;
            ballMaxSpeed = 8;
        } else if (level == 'expert') {
            aiAccelerating.slow = 4;
            aiAccelerating.medium = 9;
            aiAccelerating.fast = 18;
            ballMaxSpeed = 10;
        }
    })
}

// setting up winning score
function points() {
    const input = document.querySelector('input[name=scoring]');
    input.value = "";
    input.addEventListener('input', () => {
        winningScore = input.value; 
    })
}


// starting game on button start click
function startGame() {
    const startButton = document.querySelector('.btn-start'); 

    startButton.addEventListener('click', () => {
        if (aiAccelerating.slow > 0 && winningScore > 0){
            welcomePopup.style.transform = "scale(0,0) rotate(720deg)";
        }
    })
}

function startingWelcomePopup() {
    showWinnings();
    gameLevel();
    points();
    startGame();
    start();
}

function resetGame() {
    resetRound()
    startingWelcomePopup();
    welcomePopup.style.transform = "scale(1,1) rotate(-720deg)";
    welcomeTitle.innerHTML = "Want to play again?"; 
    playerScore = 0;
    aiScore = 0;
    winningScore = 0;    
}


// GAME OVER
function gameOver() {   


    if (aiScore == winningScore) {
        lostGame.play();
        aiTotalScore++;
        winner = "computer";
        // localStorageData.ai.push(winningScore);
        localStorageData.ai++;
        showTheWinner();
        resetGame();
        storeData()
    } else if (playerScore == winningScore) {
        applause.play();
        playerTotalScore++;
        winner = "player";
        // localStorageData.player.push(winningScore);
        localStorageData.player++;
        showTheWinner();
        resetGame();
        storeData();
    }
    
} 

// POPUP SHOW THE WINNER
function showTheWinner() {
    winnerPopup.style.transform = "scale(1,1) rotate(-720deg)";
    setTimeout(function() {winnerPopup.style.transform = "scale(0,0) rotate(720deg)";}, 3000);
    document.querySelector('.winner__display-text').textContent = winner + "!!!";
}

startingWelcomePopup();






// LOCAL STORAGE
function storeData() {
    localStorage.setItem("winnings", JSON.stringify(localStorageData));
    // console.log(JSON.parse(localStorage.getItem('winnings')));
}

// displaying winnings
function showWinnings() {
    const playerWinnings = document.querySelector('.welcome__winnings').firstElementChild.lastElementChild;
    const aiWinnings = document.querySelector('.welcome__winnings').lastElementChild.lastElementChild;
    JSON.parse(localStorage.getItem('winnings'))

    aiWinnings.innerHTML = localStorageData.ai + "x&#127942;";
    playerWinnings.innerHTML = localStorageData.player + "x&#127942;"
}

function resetScore() {
    localStorageData = { 
        ai: 0,
        player: 0 
    }; 
    console.log("localStorage: " + JSON.stringify(localStorage));
    console.log("localStorageData: " + JSON.stringify(localStorageData));
    showWinnings();
}

resetButton.addEventListener('click', resetScore);

const boardCanvas = document.getElementById('game__board_id');
const boardCtx = boardCanvas.getContext('2d');

const nextCanvas = document.getElementById('game__next_id');
const nextCtx = nextCanvas.getContext('2d');

const scoreElement = document.getElementById('game__score_id');
const linesElement = document.getElementById('game_lines_id');
const levelElement = document.getElementById('game_level_id');
const playElement = document.getElementById('btn__play_id');
const titleElement = document.getElementById('overlay__title_id');

const gameOverlay = document.getElementById('game__overlay_id');

let rows = 20;
let cols = 10;
const nextRows = 2;
const nextCols = 4;
let pieceSize = 20;

let pieceColor = 'green';
let boardColor = 'yellow';
let strokeColor = 'black';

// Size canvas
boardCanvas.width = cols * pieceSize;
boardCanvas.height = rows * pieceSize;
boardCtx.scale(pieceSize, pieceSize); // scale screen pixel to piece pixel

// Next canvas
nextCanvas.width = nextCols * pieceSize;
nextCanvas.height = nextRows * pieceSize;
nextCtx.scale(pieceSize, pieceSize); // scale screen pixel to piece pixel


// Create board
let board = [];
function createBoard(){
    for(i=0; i < rows; i++){
        board[i] = [];
        for(j=0; j < cols; j++){
            board[i][j] = 0;
        }
    }
    //console.log(board);
    drawBoard();
}

// Draw board
function drawBoard(){
    for(i=0; i < rows; i++){
        for(j=0; j < cols; j++){
            if(board[i][j] == 1){
                drawSquare(j, i, board[i][j], pieceColor);
            }else{
                drawSquare(j, i, board[i][j], boardColor);
            };
        }
    }
    console.log("draw board");
}

// Draw square
function drawSquare(x, y, state, color){
    if(state == 0){
        boardCtx.fillStyle = color;
    }else if(state == 1){
        boardCtx.fillStyle = color;
    }
    boardCtx.fillRect(x, y, 1, 1);

    boardCtx.strokeStyle = strokeColor;
   // boardCtx.strokeRect(x, y, 1, 1);
}

// Draw next
function fillNext(color) {
    let flag = false;
    let x = 0;
    let y = 0;
    for(i=0; i < nextPiece.length; i++){
        for(j=0; j < nextPiece[0].length; j++){
            if(flag == false){
                y = i;
            }
            if(nextPiece[i][j]){
                flag = true;
                drawNext(j , (i - y), nextPiece[i][j], color);
            }
        }
    }
}

function drawNext(x, y, state, color){
    if(state == 0){
        nextCtx.fillStyle = color;
    }else if(state == 1){
        nextCtx.fillStyle = color;
    }
    nextCtx.fillRect(x, y, 1, 1);
}

// Pieces

const pieces = [
    [[0, 0, 0, 0],
     [1, 1, 1, 1],
     [0, 0, 0, 0],
     [0, 0, 0, 0]],
      
    [[1, 0, 0],
     [1, 1, 1],
     [0, 0, 0]],

    [[0, 0, 1],
     [1, 1, 1],
     [0, 0, 0]],
    
    [[0, 0, 0, 0],
     [0, 1, 1, 0],
     [0, 1, 1, 0],
     [0, 0, 0, 0]],

    [[0, 1, 1],
     [1, 1, 0],
     [0, 0, 0]],

    [[0, 1, 0],
     [1, 1, 1],
     [0, 0, 0]],
    
    [[1, 1, 0],
     [0, 1, 1],
     [0, 0, 0]]
]

function randomPiece(){
    let pieceId = Math.floor(Math.random() * pieces.length);
    return pieces[pieceId];
}

// Generate piece
function createPiece(){
    piece = new Piece (nextPiece , pieceColor);
    fillNext(boardColor);
    nextPiece = randomPiece();
    fillNext(pieceColor);
    piece.draw();
}

function Piece(block, color){
    this.piece = block;
    this.color = color;

    // spawn location piece
    this.x = 3;
    this.y = -2;
}


Piece.prototype.fill = function (color) {
    for(i=0; i < this.piece.length; i++){
        for(j=0; j < this.piece[0].length; j++){
            if(this.piece[i][j]){
                let x = this.x + j;
                let y = this.y + i;
                drawSquare(x, y, this.piece[i][j], color);
            }
        }
    }
}


// draw piece
Piece.prototype.draw = function(){
    this.fill(this.color);
}

// un-draw piece
Piece.prototype.unDraw = function(){
    this.fill(boardColor);
}

// move piece down
Piece.prototype.moveDown = function(){
    if(!this.collision(0, 1, this.piece)){
        this.unDraw();
        this.y++;
        this.draw();
    }else{
        // lock the piece to the bottom
        this.lock();
        createPiece();
    }
}

// drop piece down
Piece.prototype.drop= function(){
    while(!this.collision(0, 1, this.piece)){
        this.unDraw();
        this.y++;
        this.draw();
    }
    // lock the piece to the bottom
    this.lock();
    createPiece();

}

// move piece left
Piece.prototype.moveLeft = function(){
    if(!this.collision(-1, 0, this.piece)){
        this.unDraw();
        this.x--;
        this.draw();
    }
}

// move piece right
Piece.prototype.moveRight = function(){
    if(!this.collision(1, 0, this.piece)){
        this.unDraw();
        this.x++;
        this.draw();
    }
}


// rotate piece
Piece.prototype.rotate = function(){
    console.log(this.piece);

    let tempPiece = Object.assign([], this.piece);
    //console.log(tempPiece)
    //transpose
    tempPiece = tempPiece[0].map((col, i) => tempPiece.map(row => row[i]));
    // reverse
    tempPiece = tempPiece.map(row => row.reverse());;
    let push = 0;

    if(this.collision(0,0, tempPiece)){
        console.log(this.x);
        if(this.x > cols/2){
            push = -1; // hit right wall, move over

        }else{
            push = 1; // hit left wall, move over
        }
    }

    if(!this.collision(push, 0, tempPiece)){
        this.unDraw()
        this.x = this.x + push;
        this.piece = tempPiece;
        this.draw();
    }

    // TODO: look at adding other push / kick according to https://tetris.fandom.com/wiki/SRS
}

// Lock function & remove line
Piece.prototype.lock = function(){
    for(i=0; i<this.piece.length; i++){
        for(j=0; j<this.piece[i].length; j++){
            // If top of board, then game over
            if(this.y + i < 0 && this.piece[i][j] == 1){
                playControls.isGameOver = true;
                break;
            }else if(this.piece[i][j] == 1){
                board[this.y + i][this.x + j] = 1;
            }
        }
    }  
    
    // remove lines
    for(i = 0; i < rows; i++){
        let isRowFull = true;
        for(j=0 ; j < cols; j++){
            // check for 1 in cols
            if(board[i][j] == 0){
                isRowFull = false;
                break;
            }
        }
        if(isRowFull){
            // move down all board rows down one level
            for(y = i; y > 1; y--){  // start a bottom
                for(x = 0; x < cols; x++){
                    board[y][x] = board[y-1][x];
                }
            }

            // add a blank row on top
            for(x=0; x < cols; x++){
                board[0][x] = 0;
            }
            // increase lines count
            lines++;
        }
    }

    // update the board
    drawBoard();

    // update the lines
    linesElement.innerHTML = lines;
}


// Collision function
Piece.prototype.collision = function(deltaX, deltaY, piece){
    for(i=0; i<piece.length; i++){
        for(j=0; j<piece[0].length; j++){
        
            if(piece[i][j] == 1){
                let newX = this.x + deltaX + j;
                let newY = this.y + deltaY + i;

                // piece hits walls or bottom
                if(newX < 0 || newX >= cols || newY >= rows){
                    return true;

                // skip pieces high then board
                }else if(newY < 0){
                    continue;
                }

                // piece hits locked piece
                else if(board[newY][newX] == 1){
                    return true;
                }
            }
        }

    }
    return false;
}


// User Controls
const controls = {
    32: {
        name: 'space',
        //delta_x: 0,
        //delta_y: 1

    },

    37: { 
        name: 'left',
        //delta_x:  -1,
        //delta_y: 0
    },

    38:{
        name: 'up',
        
    },

    39: {
        name: 'right',
        //delta_x: 1,
        //delta_y: 0
    },

    40: {
        name: 'down',
        //delta_x: 0,
        //delta_y: 1
    }

}
Object.freeze(controls); // Don't allow object to change
window.addEventListener('keydown', function (event){
  // if valid key press
    if(controls[event.keyCode] && !playControls.isGameOver){
        event.preventDefault(); // prevent bubbling up;

        // move to last valid spot on bottom
        if(controls[event.keyCode].name == 'space'){
           piece.drop();

        }else if(controls[event.keyCode].name == 'up'){
            piece.rotate();
            
        }else if(controls[event.keyCode].name == 'left'){
            piece.moveLeft();
            
        }else if(controls[event.keyCode].name == 'right'){
            piece.moveRight();

        }else if(controls[event.keyCode].name == 'down'){
            piece.moveDown();
        }


    }else{
        console.log('incorrect key');
    }
});

function gameOver(id){
    console.log('Game Over');
    gameOverlay.style.display = "flex"; 
    titleElement.innerHTML = 'Game Over';
    cancelAnimationFrame(id);
    return;
}

// Game animation
function animate(now = 0){
    // Update elapsed time.  
    playControls.elapsed = now - playControls.timer;
    //console.log(time.elapsed);
  
    // If elapsed time has passed time for current level 
    if (playControls.elapsed > playControls.level && !playControls.isGameOver) {
    
        // Restart counting from now
        playControls.timer = now;
        console.log('move down');   
        piece.moveDown();
    }else if(playControls.isGameOver){
        gameOver(playControls.animateId);
        return;
    }else if(playControls.isPaused){

        return;
    }
    return window.requestAnimationFrame(animate);
}

function startGame(){
    console.log('Start Game');
    playControls.isGameOver = false;
    playControls.isPaused = false;
    playElement.innerHTML = "Pause";
    score = 0;
    lines = 0;
    level = 0;
    nextPiece = randomPiece();
    console.log(nextPiece);
    createBoard();
    createPiece();
    playControls.animateId = animate(Date.now);;
}


function playGame(){
    if(playControls.isGameOver){
        startGame();

    }else if (!playControls.isPaused){
        playElement.innerHTML = "Paused";
        playControls.isPaused = true;
        // pause Animation
        console.log(playControls.animateId)
        window.cancelAnimationFrame(playControls.animateId);
        // show overlay
        gameOverlay.style.display = "flex"; 
    }else{
        playElement.innerHTML = "Pause";
        playControls.isPaused = false;
        // close overlay
        gameOverlay.style.display = "none"; 
        // start animation
        playControls.animateId = animate(Date.now);
    }
}


// Global variables
let piece;
let nextPiece;
let score = 0;
let lines = 0;
let level = 0;
let playControls = {
    isGameOver: true,
    isPaused: true,
    animateId: null,
    timer: 0,
    elapsed: 0,
    level: 1000,
}


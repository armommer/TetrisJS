"use strict";  // use strict mode at top level, and one level down

let wellCols = 10;
let wellRows = 20;
const blockSize = 20; // The size of one block pixel

let blockColor = "green";
let lockedColor = "blue";
let lineColor = "red";


// Create board Canvas
const boardCanvas = document.getElementById('board');
const boardCtx = boardCanvas.getContext('2d');

boardCanvas.width = wellCols * blockSize;
boardCanvas.height = wellRows * blockSize;

boardCtx.scale(blockSize, blockSize); // scale screen pixel to block pixel

let board;

let playControls = {
    start: true,
    play: false,
    animateID: null,
    timer: {
        start: 0,
        elapsed: 0,
    },
    level: 0,

}


// Next Block canvas
let nextCols = 3;
let nextRows = 4;

let nextColor = "yellow";

const nextCanvas = document.getElementById("nextBlock");
const nextCtx = nextCanvas.getContext('2d');

nextCanvas.width = nextCols * blockSize;
nextCanvas.height = nextRows * blockSize;


// Create the well
class Well {
    constructor(rows, cols) {
        this.lowerX = 0;
        this.upperX = cols;
        this.lowerY = 0;
        this.upperY = rows;
        this.grid = this.initGrid(rows, cols);
    }

    initGrid(rows, cols){
        return Array(rows).fill(0).map( 
            () => Array(cols).fill(0));
    }

    validMove(block, deltaX, deltaY) {
        let valid = true;
        let well = this;
        let newX = block.x + deltaX;
        let newY = block.y + deltaY;
        // For each row, use index y
        block.shape.forEach( function(row, y){
            row.forEach( function(value, x){
                if(value == 1 && valid == true){
                    let posX = newX + x;
                    let posY = newY + y;
                    if(posY < well.lowerY || posY >= well.upperY ||
                        posX < well.lowerX || posX >= well.upperX){
                        valid = false;
                    }else if(false){
                    }
                }
            });
        });
       return valid;
    }

    validRotate(block){
        let valid = true;
        let well = this;
        let newShape = Object.assign([], block.shape);
        console.log(newShape);
        newShape = newShape[0].map((col, i) => newShape.map(row => row[i]));
        newShape = newShape.map(row => row.reverse());

        // For each row, use index y
        newShape.forEach( function(row, y){
            row.forEach( function(value, x){
                if(value == 1 && valid == true){
                    let posX = block.x + x;
                    let posY = block.y + y;
                    if(posY < well.lowerY || posY >= well.upperY ||
                        posX < well.lowerX || posX >= well.upperX){
                        valid = false;
                    }
                }
            });
        });
        return valid;
    }

    drawWell(){

    }

    freeze(){
        this.block.forEach( function(row, y){
            row.forEach( function(value, x){
               // grid
            });
        });
    }
}


// Create the blocks
class Block {
    constructor(ctx, shape, x, y){
        this.ctx = ctx;
        this.shape = shape;
        this.x = x;
        this.y = y;
        this.draw();
        this.nextBlock();
    }

    draw() {
        let ctx = this.ctx;
        ctx.fillStyle = blockColor;
        let startX = this.x;
        let startY = this.y;
        // For each row, use index y
        this.shape.forEach( function (row, y){
            // For each column, use index x
            row.forEach( function (value, x){
                if (value == 1) {
                    ctx.fillRect(startX + x, startY + y, 1, 1);
                    //console.log((startX + x) + " " + (startY + y) )
                }
            });
        });
    }

    move(x, y) {
        this.x = this.x + x;
        this.y = this.y + y;
        
    }

    nextBlock() {
        this.ctx.fillStyle = nextColor;

    }

    rotate() {
        //transpose
        this.shape = this.shape[0].map((col, i) => this.shape.map(row => row[i]));
        // reverse
        this.shape = this.shape.map(row => row.reverse());
    }

}


// Keyboard controls
const controls = {
    32: {
        name: "space",
        delta_x: 0,
        delta_y: 1

    },

    37: { 
        name: "left",
        delta_x:  -1,
        delta_y: 0
    },

    38:{
        name: "up",
        
    },

    39: {
        name: "right",
        delta_x: 1,
        delta_y: 0
    },

    40: {
        name: "down",
        delta_x: 0,
        delta_y: 1
    }

}
Object.freeze(controls); // Don't allow object to change


document.addEventListener('keydown', function (event){
    // if vaild key press
    if(controls[event.keyCode]){
        event.preventDefault(); // prevent bubbling up;
        let deltaX = controls[event.keyCode].delta_x;
        let deltaY = controls[event.keyCode].delta_y;

        // move to last valid spot on bottom
        if(controls[event.keyCode].name == "space"){
            while(well.validMove(well.block, deltaX, deltaY)){
                well.block.move(deltaX, deltaY)
                // Clear old position before drawing.
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                well.block.draw();
            }
        }else if(controls[event.keyCode].name == "up"){
            if (well.validRotate(well.block)){
                well.block.rotate();
                // Clear old position before drawing.
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                well.block.draw();
            }else{
                console.log("invalid rotate");
            }
        }else{
            if(well.validMove(well.block, deltaX, deltaY)){
                well.block.move(deltaX, deltaY)
                // Clear old position before drawing.
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                well.block.draw();

            }else{
                console.log("invalid move");
            }
        }

    }else{
        console.log("incorrect key");
    }

});


// Blocks
const blocks = [
    [[0, 0, 0, 0],
     [1, 1, 1, 1],
     [0, 0, 0, 0],
     [0, 0, 0, 0]],
      
    [[1, 0, 0, 0],
     [1, 1, 1, 0],
     [0, 0, 0, 0],
     [0, 0, 0, 0]],

    [[0, 0, 1, 0],
     [1, 1, 1, 0],
     [0, 0, 0, 0],
     [0, 0, 0, 0]],
    
    [[0, 1, 1, 0],
     [0, 1, 1, 0],
     [0, 0, 0, 0],
     [0, 0, 0, 0]],

    [[0, 1, 1, 0],
     [1, 1, 0, 0],
     [0, 0, 0, 0],
     [0, 0, 0, 0]],

    [[0, 1, 0, 0],
     [1, 1, 1, 0],
     [0, 0, 0, 0],
     [0, 0, 0, 0]],
    
    [[1, 1, 0, 0],
     [0, 1, 1, 0] ,
     [0, 0, 0, 0],
     [0, 0, 0, 0]]
]

Object.freeze(blocks);


// Levels

// Timers 
let time = { start: 0, elapsed: 0, level: 1000 };

function start(){
    playControls.start = false;
    playControls.play = true;
    document.getElementById('play_pause-btn').innerHTML = "Pause";
    // Create Well
    board = new Well ();
    // Create Block
    let blockID = Math.floor(Math.random() * blocks.length);
    let block = new Block(boardCtx, blocks[blockID], 0, 0);
    well.block = block;
    // Create Next
    // Start Animation
    playControls.animateID = animate();
}

function restartGame(){
    // clear canvas/well
    document.getElementById('play_pause-btn').innerHTML = "Start";
    document.getElementById('overlay').style.display = "none"; 
    playControls.start = true;
    playControls.play = false;
}

function playGame(){
    if(playControls.start){
        start();

    }else if (playControls.play){
        document.getElementById('play_pause-btn').innerHTML = "Paused";
        playControls.play = false;
        // pause Animation
        cancelAnimationFrame(playControls.animateID);
        // show overlay
        document.getElementById('overlay').style.display = "block"; 
    }else{
        document.getElementById('play_pause-btn').innerHTML = "Pause";
        playControls.play = true;
        // close overlay
        document.getElementById('overlay').style.display = "none"; 
        // start animation
        playControls.animateID = animate();
    }
}

function animate(now = 0){
    // Update elapsed time.  
    time.elapsed = now - time.start;
  
    // If elapsed time has passed time for current level  
    if (time.elapsed > time.level) {
    
        // Restart counting from now
        time.start = now;   
        //well.block.move(0, 1)  
    }
    
    // Clear board before drawing new state.
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
    
    //well.block.draw();  
    return requestAnimationFrame(animate);
}
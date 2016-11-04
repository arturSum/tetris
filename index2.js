

class Tetris{


    constructor(containerId, movingStep){


        this.ctx =


        this.containerId = containerId;

        this.gameBoardNode = null;


        this.gameStatus = null;
        this.ctxInfo = null;

        this.movingStep = movingStep;

        this.boardGameProportion = 10/20;

        this.boardWidth = 400;
        this.boardHeight = this.boardWidth + (this.boardWidth*this.boardGameProportion);


        this.currentShape = null;
        this.gameBoardShape = [];

        this.posX = 0;
        this.posY = 0;
        
        this.vx = this.movingStep;
        this.vy = this.movingStep;

    }

    createCanvasNode(){

        var containerNode = document.getElementById(this.containerId);


        if(containerNode){

            if(containerNode.querySelectorAll('*').length){
                containerNode.innerHTML = '';
            }

            var coreDiv = document.createElement('div');

           


            containerNode.appendChild(coreDiv);


            //core canvas
            this.gameBoardNode = document.querySelector(`#${this.containerId} .gameBoardContainer canvas`);
            this.gameBoardNode.height = this.boardHeight;
            this.gameBoardNode.width = this.boardWidth;

            //info board
            this.gameStatus = document.querySelector(`#${this.containerId} .nextShapeInfoBoard canvas`);
            this.gameStatus.width = this.movingStep * 6;
            this.gameStatus.height = this.movingStep * 6;

            return this;

        }
        else{
            throw new ReferenceError('Container with declared id not found');
        }

    }

    createInfoBoard(){

        this.ctxInfo = this.gameStatus.getContext('2d');
        this.ctxInfo.style = 'black';

        this.ctxInfo.fillRect(0, 0, this.gameStatus.width, this.gameStatus.height);

        return this;

    }

    createGameBoard(){

        this.ctx = this.gameBoardNode.getContext('2d');
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.boardWidth, this.boardHeight);

        return this;

    }

    choiceBlock(shapeStorage){
        this.currentShape = shapeStorage[Math.floor(Math.random()*0)];
        return this;
    }

    clearGameBoard(){
        this.createGameBoard();
        return this;
    }
    createGameBoardShape(){

        var xMatrix = [],
            stepsHeightQnt = (this.boardHeight/this.movingStep),            //bo element siatki 0,0 jest juz na powierzchni planszy a nie po za nią !!! element 0,0 to gorna i lewa krawedz
            stepWidthQnt = (this.boardWidth/this.movingStep);

        while(stepsHeightQnt--){

            xMatrix = new Array(stepWidthQnt);
            xMatrix.fill(0);

            this.gameBoardShape.push(xMatrix);
        }


        //console.log(this.gameBoardShape);

        return this;

    }

    //umieszcza aktualnie wyswietlany element na tablicy
    mergeBlockWithBoardShape(shape, pos){

        shape.forEach((row, y)=>{
            row.forEach((value, x)=>{

                if(value){
                   this.gameBoardShape[y + pos.y][x + pos.x] = value;
                }


            });

        });


        //console.table(tetris.gameBoardShape);
    }

    /*
        Kolizja jest w tedy gdy dwa pixele na siebie nachodza czyli maja wartos 1 w tych samych koordynatach
     */


    checkCollisionOnGameBoard(shape, pos){

        for(var y=0; y<shape.length; y++){

            for(var x=0; x<shape[y].length; x++){

                if(shape[y][x] !== 0){

                    //console.log(this.gameBoardShape[y + pos.y][x + pos.x]);

                    // kolizja z krawedziom dolna plansza  - this.gameBoardShape[y + pos.y]
                    if(typeof this.gameBoardShape[y + pos.y] == 'undefined' || this.gameBoardShape[y + pos.y][x + pos.x] !== 0){

                        //console.log('block collision');
                        //throw 'Kolizja';

                        return true;
                    }

                }

            }

        }

        return false;

    }
    rotateBlock(shape, direction){

        var newShape = [];


        //[a, b] = [b, a]

        for(var y=0; y<shape.length; y++){

            for(var x=0; x<shape.length; x++){

                if(!newShape[y]){
                    newShape[y] = [];
                }

                newShape[y][x] = shape[x][y];

            }

        }

        if(direction === 'right'){
            newShape.forEach((row)=>{row.reverse()})
        }
        else if(direction === 'left'){
            newShape.reverse();
        }



        gameController.shape = newShape;

        //console.log(newShape);

    }


    drawBlock(shape, offset){


        shape.forEach((YAxis)=>{

            YAxis.forEach((value)=>{

                if(value){

                    this.ctx.fillStyle = blockColor[value];
                    this.ctx.fillRect(this.posX + (offset.x*this.movingStep), this.posY + (offset.y*this.movingStep), this.movingStep, this.movingStep);
                }

                this.posX += this.vx;
            });

            this.posY += this.vy;
            this.posX = 0;
        });

        this.posY = 0;

    }




}
//##################################################################################################33


var O_Tetrino = [
        [1, 1],
        [1, 1]
    ],
    T_Tetrino = [
        [2, 2, 2],
        [0, 2, 0],
        [0, 0, 0]
    ],
    I_Tetrino = [
        [3, 0, 0, 0],
        [3, 0, 0, 0],
        [3, 0, 0, 0],
        [3, 0, 0, 0]
    ],
    L_Tetrino = [
        [4, 0, 0],
        [4, 0, 0],
        [4, 4, 0]
    ],
    J_Tetrino = [
        [0, 0, 5],
        [0, 0, 5],
        [0, 5, 5]
    ],
    S_Tetrino = [
        [0, 6, 6],
        [6, 6, 0],
        [0, 0, 0]
    ],
    Z_Tetrino = [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0]
    ];



var shapeStorage = [
    O_Tetrino,
    T_Tetrino,
    I_Tetrino,
    L_Tetrino,
    J_Tetrino,
    S_Tetrino,
    Z_Tetrino
];





//####################################################################



const blockColor = [

    null,
    `rgb( ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}  )`,
    `rgb( ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}  )`,
    `rgb( ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}  )`,
    `rgb( ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}  )`,
    `rgb( ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}  )`,
    `rgb( ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}  )`,
    `rgb( ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}  )`

];




const getRandomBlock = (shapeSource)=>{
    return shapeSource[Math.floor(Math.random()*6)]
};


const addPlayerScore = ()=>{
    document.querySelector(`#${tetris.containerId} .score span`).innerHTML = gameController.score;
};



const checkForSweepGameBoard = (gameBoardShape)=>{
   var row = null,
       wasRowCleared = false;

   rowLoop : for(var y=gameBoardShape.length-1; y > 0; y--){

                        for(var x=0; x < gameBoardShape[y].length; x++){

                            if(gameBoardShape[y][x] == 0){
                                continue rowLoop;
                            }
                        }

                        row = gameBoardShape.splice(y, 1)[0];
                        gameBoardShape.unshift(row.fill(0));

                        y++;

                        gameController.score++;
                        wasRowCleared = true;

                }

    return wasRowCleared;


};






const resetGameController = (controller)=>{
    controller.pos.x = startingPosX;

    controller.pos.y = startingPosY;
    controller.shape = getRandomBlock(shapeStorage);


    if(tetris.checkCollisionOnGameBoard(gameController.shape, gameController.pos)){
        gameOver();
    }


};
var requestId = null,
    gameStep = 20,                              //wskazuje krok gry oraz jednoczesnie szerokosc jednego klocka
    boardWidth = (40*10)/gameStep,
    boardHeight = (40*20)/gameStep,
    startingPosX = (boardWidth/2) - 1,
    startingPosY = 0;

var gameController = {
        shape : getRandomBlock(shapeStorage),
        pos : {                                 //pos nie jest w pixelach tykko w rozmiarach pojedynczego kwadratu (powiekszona gameStep razy)!!!!
            x : startingPosX,
            y : startingPosY
        },
        score : 0
    };



var dropInterval = 1000,
    elapsedTime = 0;




//########################################################


var tetris = new Tetris(configuration);






window.onload = ()=>{
    tetris.createCanvasNode().
           createGameBoard().
           createInfoBoard().
           createGameBoardShape();
    start();
    window.addEventListener('keydown', event=>{

        switch(event.keyCode){

               case 37: //left
                   moveXAxisPos(-1);
                   break;

               case 39: //right
                   moveXAxisPos(1);
                   break;

               case 40: //down
                   dropBlock();
                   elapsedTime = 0;
                   break;

               case 32: //space
                   playerRotate('right');
                   break;

           }
    });






};


const moveXAxisPos = (movingStep)=>{
    gameController.pos.x += movingStep;


    if(tetris.checkCollisionOnGameBoard(gameController.shape, gameController.pos)){

        gameController.pos.x -= movingStep;

   }

};


const playerRotate = (direction)=>{

    var checkDirection = 1,
        startXPos = gameController.pos.x;

    tetris.rotateBlock(gameController.shape, direction);


    //sprawdzenie czy po rotaacji blok nie koliduje ze scianami i innymi klockami
    //sprawdzamy kolizje z kazdej strony klocka na jego szerokosci
    while(tetris.checkCollisionOnGameBoard(gameController.shape, gameController.pos)){

        if(gameController.pos.x-startXPos == 4){        //4 bo bedzie prawdzane maxymalnie 4 pixele z kazdej ze ston (4 to max szerokosc siatki klocka
            gameController.pos.x = startXPos;
            checkDirection = -1;
        }

        checkDirection == 1? gameController.pos.x++ : gameController.pos.x--;
    }

};


const gameOver = ()=>{

    runAnimation = false;

    setTimeout(()=>{

        document.querySelector(`#${this.containerId} .gameOver p`).innerHTML = 'GAME OVER';
        tetris.clearGameBoard();

        //daodac jakis efekt


    }, 50);



};





const dropBlock = ()=>{

    gameController.pos.y++;


    if(tetris.checkCollisionOnGameBoard(gameController.shape, gameController.pos)){

        //podnosimy do gory o jeden pixel zeby kolizji nie bylo
        gameController.pos.y--;

        tetris.mergeBlockWithBoardShape(gameController.shape, gameController.pos);

        resetGameController(gameController);

        if(checkForSweepGameBoard(tetris.gameBoardShape)){
            addPlayerScore();
        }



    }



};


const start = ()=>{

    runAnimation = true;

    update(new Date().getTime());

};


const update = (lastTime)=>{



    if(runAnimation){

        var time = (new Date()).getTime();
        var timeDiff = time - lastTime;

        elapsedTime += timeDiff;

        if(elapsedTime >= dropInterval){

            //console.log(gameController.pos.y);

            dropBlock();

            elapsedTime = 0;
        }

        draw();
        requestId = requestAnimationFrame(()=>{
             update(time);
        });

    }
    else {
       cancelAnimationFrame(requestId);
    }





};


const draw = ()=>{

    tetris.clearGameBoard();

    tetris.drawBlock(tetris.gameBoardShape, {x:0, y:0});
    tetris.drawBlock(gameController.shape, gameController.pos);

};



import GameBoard from './GameBoard';
import GameStatus from './GameStatus';
import TetrinoFactory from './TetrinoFactory';





class Controller{


    constructor(config, eventListener = {notifyObservers:()=>{}}){

        var gameStep = config.surfaceWidth/20;

        this.gameIdString = `Tetris_${config.containerId}`;

        this.eventListener = eventListener ;
        this.nextTetrino = null;

        this.score = 0;
        this.tetrinoScoreVelocity = 1;

        this.runAnimation = false;

        this.rafId = null;
        this.elapsedTime = 0;

        this.elapsedTetrinoCounter = 0;



        var {dropInterval = 1000, tetrinoSpeedRising = 50, changingGameSpeedTetrinoCounter = 10} = config;

        this.defaultDropIntervalSettings  = dropInterval;

        this.dropInterval = dropInterval; 
        this.tetrinoSpeedRising = tetrinoSpeedRising;
        this.changingGameSpeedTetrinoCounter = changingGameSpeedTetrinoCounter;   


        this.tetrinoFactory = new TetrinoFactory();

        this.gameBoard = new GameBoard({
            'mainBoardCanvasDOMHandle' : config.mainBoardCanvasDOMHandle,
            'gameStep' : gameStep,
            'surfaceWidth' : config.surfaceWidth
        }, this);

        this.gameStatus = new GameStatus({
            'nextShapeCanvasDOMHandle' : config.nextShapeCanvasDOMHandle,
            'gameScoreDOMHandle' : config.gameScoreDOMHandle,
            'startButtonDOMHandle' : config.startButtonDOMHandle,
            'gameStep' : gameStep
        });
    }

    runGame(){


        this.resetGameSettings();

        this.gameStatus.setStartButtonDisabledStatus(true);

        this.nextTetrino = this.getNewTetrino();
        this.elapsedTetrinoCounter++;

        this.gameStatus.drawNextTetrino(this.nextTetrino.shape);

        this.runAnimation = true;
        this.updateData((new Date()).getTime());


        this.eventListener.notifyObservers(`${this.gameIdString}_Start`);


    }

    resetGameSettings(){

        this.score = 0;
        this.runAnimation = false;
        this.rafId = null;
        this.elapsedTime = 0;
        this.dropInterval = this.defaultDropIntervalSettings;
        this.elapsedTetrinoCounter = 0;

    }


    setBlockMovingEvents(){

        window.addEventListener('keydown', event=>{

            if(!this.runAnimation){
            return;
        }

        switch(event.keyCode){

            case 37: 
                this.moveBlockOnXAxis(-1);
                break;

            case 39: 
                this.moveBlockOnXAxis(1);
                break;

            case 40: 
                this.moveBlockOnYAxis();
                break;

            case 32: 
                this.rotateBlockWithCertainDirection('right');
                break;

        }
    });

        return this;
    }


    rotateBlockWithCertainDirection(direction){
        this.gameBoard.rotateBlock(direction);
    }


    moveBlockOnXAxis(movingStep){
        this.gameBoard.changeXAxisBlockPosition(movingStep);
    }


    moveBlockOnYAxis(){
        this.gameBoard.dropBlock();
        this.elapsedTime = 0;
    }


    getNextTetrino(){

        var currentTetrino = this.nextTetrino;

        this.nextTetrino = this.getNewTetrino();
        this.gameStatus.drawNextTetrino(this.nextTetrino.shape);

        this.elapsedTetrinoCounter++;

        return currentTetrino;
    }

    getNewTetrino(){
        return this.tetrinoFactory.getNewTetrino();
    }

    checkTetrinoSpeed(){

        if(this.elapsedTetrinoCounter == this.changingGameSpeedTetrinoCounter){

            if(this.dropInterval <= 50){
                return;
            }

            this.dropInterval -= this.tetrinoSpeedRising;
            this.elapsedTetrinoCounter = 0;

            this.tetrinoScoreVelocity += 1;
        }

    }


    getTetrinoAvailableColors(){
        return this.tetrinoFactory.getAvailableColors();
    }

    addScore(){
        this.score += this.tetrinoScoreVelocity;
    }

    updateScoreInDOM(){
        this.gameStatus.updateScoreNode(this.score);
    }

    gameOver(){

        this.runAnimation = false;

        setTimeout(()=>{

            this.gameStatus.clearNextTetrinoSurface();
            this.gameBoard.clearMesh();
            this.gameBoard.clearSurface();

            this.gameStatus.updateScoreNode();
            this.gameStatus.setStartButtonDisabledStatus(false);

            this.gameBoard.showGameOverInfo(['GAME OVER', `Your score: ${this.score}`]);
            this.eventListener.notifyObservers(`${this.gameIdString}_End`);

        }, 50);

    }

    updateData(lastTime){

        var time = (new Date()).getTime();
        var timeDiff = time - lastTime;

        if(!this.runAnimation){
            cancelAnimationFrame(this.rafId);
            return;
        }

        this.elapsedTime += timeDiff;

        if(this.elapsedTime >= this.dropInterval){

            this.gameBoard.dropBlock();
            this.elapsedTime = 0;
        }

        this.gameBoard.drawOnSurface();

        this.rafId = requestAnimationFrame(()=>{
                this.updateData(time);
        });

    }


    createGameStatusBoard(){
        this.gameStatus.createNextTetrinoSurface();
        return this;
    }


    createGameBoard(){
        this.gameBoard.createSurface();
        return this;
    }

    createGameBoardMesh(){
        this.gameBoard.createMesh();
        return this;
    }


}

export {Controller};
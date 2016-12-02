
class GameBoard{


        constructor(config, controllerHandle){


        this.boardNodeHandler = config.mainBoardCanvasDOMHandle;

        this.movingStep = config.gameStep;

        this.boardGameProportion = 10/20;
        this.boardWidth = config.surfaceWidth;
        this.boardHeight = this.boardWidth + (this.boardWidth*this.boardGameProportion);


        this.ctx = config.mainBoardCanvasDOMHandle.getContext('2d');

                this.boardMesh = [];


                        this.controllerHandle = controllerHandle;

                this.tetrinoBlock = this.controllerHandle.getNewTetrino();
        this.tetrinoColors = this.controllerHandle.getTetrinoAvailableColors();

        this.tetrinoBlock.pos.x = this.countStartingXPos();

    }

    createSurface(){

        this.boardNodeHandler.width = this.boardWidth;
        this.boardNodeHandler.height = this.boardHeight;

        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.boardWidth, this.boardHeight);

            }

    createMesh(){

        var xMatrix = [],
            stepsHeightQnt = (this.boardHeight/this.movingStep),            
            stepWidthQnt = (this.boardWidth/this.movingStep);

        while(stepsHeightQnt--){

            xMatrix = new Array(stepWidthQnt);
            xMatrix.fill(0);

            this.boardMesh.push(xMatrix);
        }

    }


    clearMesh(){

        var meshYQnt = this.boardMesh.length;

        while(meshYQnt--){
            this.boardMesh[meshYQnt].fill(0);
        }

    }

    showGameOverInfo(textToShow = ['GAME OVER', 'Your score: 0']){

        var fontSize = this.movingStep*2,
            offset = -fontSize;

        this.ctx.font = `${fontSize}px Calibri`;
        this.ctx.fillStyle = 'green';

        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';


        textToShow.forEach((value)=>{

            this.ctx.fillText(value, this.boardWidth/2, (this.boardHeight/2) + offset);
            offset += fontSize;

        });


    }



            changeXAxisBlockPosition(movingStep = 1){

        this.tetrinoBlock.pos.x += movingStep;

        if(this.checkBlocksCollision(this.tetrinoBlock.shape, this.tetrinoBlock.pos)){
            this.tetrinoBlock.pos.x -= movingStep;

        }

    }


    rotateBlock(direction = 'right'){

        var startXPos = this.tetrinoBlock.pos.x,
            offset = 1,
            increaseOffsetCounter = 0;


        direction = (direction == 'right' || direction == 'left')? direction : 'right';
        this.rotateBlockMesh(this.tetrinoBlock.shape, direction);

        while(this.checkBlocksCollision(this.tetrinoBlock.shape, this.tetrinoBlock.pos)){

            this.tetrinoBlock.pos.x = startXPos;

            this.tetrinoBlock.pos.x += offset;
            increaseOffsetCounter++;

            if(increaseOffsetCounter == 2){

                offset--;
                increaseOffsetCounter = 0;

            }

            offset = -offset;

            if(offset>this.tetrinoBlock.shape.length){

                this.rotateBlockMesh(this.tetrinoBlock.shape, direction == 'right'? 'left' : 'right');
                this.tetrinoBlock.pos.x = startXPos;

                return;

            }


        }


    }



    rotateBlockMesh(shape, direction = 'right'){

        var newShape = [];

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

        this.tetrinoBlock.shape = newShape;

    }



    countStartingXPos(){
        return Math.floor(((this.boardWidth/2) - (this.tetrinoBlock.shape.length/2))/this.movingStep);
    }

    clearSurface(){

        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.boardWidth, this.boardHeight);
    }


    checkBlocksCollision(shape, pos){

        for(var y=0; y<shape.length; y++){

            for(var x=0; x<shape[y].length; x++){

                if(shape[y][x] !== 0){

                    if(typeof this.boardMesh[y + pos.y] == 'undefined' || this.boardMesh[y + pos.y][x + pos.x] !== 0){

                        return true;
                    }

                }

            }

        }

        return false;
    }



    mergeBlockWithBoardMesh(shape, pos){

        shape.forEach((row, y)=>{
            row.forEach((value, x)=>{

                if(value){
                    this.boardMesh[y + pos.y][x + pos.x] = value;
                }

            });

        });

    }

    resetBlockPosition(){

        this.controllerHandle.checkTetrinoSpeed();

        this.tetrinoBlock = this.controllerHandle.getNextTetrino();

        this.tetrinoBlock.pos.x = this.countStartingXPos();
        this.tetrinoBlock.pos.y = 0;

        if(this.checkBlocksCollision(this.tetrinoBlock.shape, this.tetrinoBlock.pos)){
            this.controllerHandle.gameOver();
        }

    }


    checkSurfaceLineFilling(){

        var row = null,
            wasRowCleared = false;


        rowLoop : for(var y=this.boardMesh.length-1; y >= 0; y--){

                        for(var x=0; x < this.boardMesh[y].length; x++){

                            if(this.boardMesh[y][x] == 0){
                                continue rowLoop;
                            }
                        }

                        row = this.boardMesh.splice(y, 1)[0];
                        this.boardMesh.unshift(row.fill(0));

                        y++;

                        wasRowCleared = true;
                    }

        return wasRowCleared;
    }


    dropBlock(){

        this.tetrinoBlock.pos.y++;


        if(this.checkBlocksCollision(this.tetrinoBlock.shape, this.tetrinoBlock.pos)){

            this.tetrinoBlock.pos.y--;

            this.mergeBlockWithBoardMesh(this.tetrinoBlock.shape, this.tetrinoBlock.pos);


            if(this.checkSurfaceLineFilling()){
                this.controllerHandle.addScore();
                this.controllerHandle.updateScoreInDOM();
            }

            this.resetBlockPosition();

        }


    }

    drawShape(shape, offset){

        var posX = 0,
            posY = 0;

        shape.forEach((YAxis)=>{

            YAxis.forEach((value)=>{

                if(value){

                    this.ctx.fillStyle = this.tetrinoColors[value];
                    this.ctx.fillRect(posX + (offset.x*this.movingStep), posY + (offset.y*this.movingStep), this.movingStep-1, this.movingStep-1);
                }

                posX += this.movingStep;
            });

            posY += this.movingStep;
            posX = 0;
        });

    }


    drawOnSurface(){

        this.clearSurface();

        this.drawShape(this.boardMesh, {x:0, y:0});
        this.drawShape(this.tetrinoBlock.shape, this.tetrinoBlock.pos);

    };


}


export default GameBoard;
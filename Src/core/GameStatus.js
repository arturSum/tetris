
class GameStatus{

    constructor(config){

        this.gameStep = config.gameStep;
        this.ctx = config.nextShapeCanvasDOMHandle.getContext('2d');

        this.gameScoreNode = config.gameScoreDOMHandle;
        this.startButtonNode = config.startButtonDOMHandle;
        
        this.nextTetrinoSurfaceHeight = this.gameStep*6;
        this.nextTetrinoSurfaceWidth = this.gameStep*6;

        this.ctx.fillStyle = 'white';

    }

    drawNextTetrino(nextShape){

        this.clearNextTetrinoSurface();
        this.drawBlock(nextShape);
    }

    createNextTetrinoSurface(){

        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.nextTetrinoSurfaceWidth, this.nextTetrinoSurfaceHeight);
    }
    updateScoreNode(scoreQnt = ''){

        if(this.gameScoreNode){
            this.gameScoreNode.innerHTML = scoreQnt;
        }

    }



    clearNextTetrinoSurface(){
        this.createNextTetrinoSurface();
    }
    setStartButtonDisabledStatus(value = false){

        this.startButtonNode.disabled = value;
    }

    drawBlock(shape){

        var posX = 0,
            posY = 0,
            positionCompensation = 0;

        var offsetX = Math.floor( ((this.nextTetrinoSurfaceWidth/2) - (shape.length/2)) / this.gameStep );

        //kompensacja polozenia dla kwadratu (zeby wychodzil rowno na css)
        if(shape.length == 2){
            positionCompensation = Math.floor(this.gameStep/2);    //10;

        }

        shape.forEach((YAxis)=>{

            YAxis.forEach((value)=>{

                if(value){

                    this.ctx.fillStyle = 'red';
                    this.ctx.fillRect(posX + positionCompensation + (offsetX*this.gameStep), posY, this.gameStep-1, this.gameStep-1);
                }

                posX += this.gameStep;
            });

            posY += this.gameStep;
            posX = 0;
        });

    }
}


export default GameStatus;
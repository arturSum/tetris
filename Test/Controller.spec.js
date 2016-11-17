import {Bootstrap} from 'Src/Bootstrap'

import {Controller} from 'Src/core/Controller'

import TetrinoFactory from 'Src/core/TetrinoFactory'
import GameStatus from 'Src/core/GameStatus'
import GameBoard from 'Src/core/GameBoard'

"use strict";

xdescribe('Controller Class', ()=>{

    var getGameHtmStructure = (gameId)=>{

        return   `<div id="${gameId}" class="spinner">

                        <div class="container">
                
                            <div class="row">
                
                                <div class="gameBoardContainer col-md-4">
                                     <canvas class="gameBoard">You browser not support canvas element</canvas>
                                </div>
                
                                <div class="gameStatusContainer col-md-2">
                
                                    <div class="nextShapeContainer">
                                        <h3><span class="label label-success">Next</span></h3>
                                        <canvas class="nextShape"></canvas>
                                    </div>
                
                                    <div  class="scoreContainer">
                                        <h3><span class="label label-success">Score</span></h3>
                                        <h1 class="score"></h1>
                                    </div>
                
                                    <div class="btn-group btn-group-justified buttonContainer" role="group">
                                        <button type="button" class="startButton btn btn-primary">Start</button>
                                    </div>
                
                                </div>
                
                            </div>
                
                         </div>
                
                    </div>`;

    },
        bootstrap = new Bootstrap(),
        gameProps = null,
        controller = null,
        eventListener = {notifyObservers : ()=>{}};


    beforeEach(()=>{

        document.body.insertAdjacentHTML( 'afterbegin', getGameHtmStructure('gameBox'));

        bootstrap.setParams({
            surfaceWidth : 400,
            containerId : 'gameBox',
            changingGameSpeedTetrinoCounter : 2
        });

        gameProps = bootstrap.getGameProp();

        controller = new Controller(gameProps, eventListener);
    });

    afterEach(()=>{

        document.body.innerHTML = '';
        controller.gameOver();
    });

    describe('runGame', ()=>{

        it('should announce correct Start action', ()=>{

            var expectedActionName = 'Tetris_gameBox_Start';

            spyOn(eventListener, 'notifyObservers');
            controller.runGame();

            expect(eventListener.notifyObservers).toHaveBeenCalledWith(expectedActionName);
        });

        it('startupButton should be switch to disabled', ()=>{

            controller.runGame();

            expect(gameProps.startButtonDOMHandle.disabled).toBeTruthy();
        });

        it('next tetrino shape should be displayed in proper DOM node', ()=>{

            spyOn(GameStatus.prototype, 'drawNextTetrino');
            controller.runGame();

            expect(GameStatus.prototype.drawNextTetrino).toHaveBeenCalled();
        });


        it('animation should be start', ()=>{

            spyOn(GameBoard.prototype, 'drawOnSurface');
            controller.runGame();

            expect(GameBoard.prototype.drawOnSurface).toHaveBeenCalled();
        });
        

    });

    describe('updateData', ()=>{

        it('should move tetrino block down on certain interval[ms] (def:1000)', (done)=>{

            var gameDefaultDropInterval = 1000;

            spyOn(GameBoard.prototype, 'dropBlock');

            controller.runGame();

            setTimeout(()=>{

                expect(GameBoard.prototype.dropBlock).toHaveBeenCalledTimes(2);
                done();

            }, (gameDefaultDropInterval*2) +100);

        });

    });

    describe('gameOver', ()=>{

        it('animation loop should be cancel', (done)=>{

            var gameDefaultDropInterval = 1000;

            spyOn(GameBoard.prototype, 'dropBlock');

            controller.runGame();

            setTimeout(()=>{
                controller.gameOver();
            }, gameDefaultDropInterval + 100);

            //czekamy 2 razy dluzej zeby sprawdzic czy sie dalej wykonuje petla
            setTimeout(()=>{
                expect(GameBoard.prototype.dropBlock).toHaveBeenCalledTimes(1);
                done();
            }, (gameDefaultDropInterval*2) + 100);


        });


        it('Tetris_${containerId}_End event should be announced', (done)=>{

            var eventId = `Tetris_${gameProps.containerId}_End`;

            spyOn(eventListener, 'notifyObservers');

            controller.gameOver();

            setTimeout(()=>{
                expect(eventListener.notifyObservers).toHaveBeenCalledWith(eventId);
                done();
            }, 100);

        });


        it('should show game over info on the board', (done)=>{

            spyOn(GameBoard.prototype, 'showGameOverInfo');

            controller.gameOver();

            setTimeout(()=>{
                expect(GameBoard.prototype.showGameOverInfo).toHaveBeenCalled();
                done();

            }, 100);
            
        });
        
        
        it('startupButton should be enabled', (done)=>{

            spyOn(GameStatus.prototype, 'setStartButtonDisabledStatus');

            controller.gameOver();

            setTimeout(()=>{
                expect(GameStatus.prototype.setStartButtonDisabledStatus).toHaveBeenCalledWith(false);
                done();

            }, 100);

        });


        it('should clear game status area', (done)=>{

            spyOn(GameStatus.prototype, 'clearNextTetrinoSurface');

            controller.gameOver();

            setTimeout(()=>{
                expect(GameStatus.prototype.clearNextTetrinoSurface).toHaveBeenCalled();
                done();

            }, 100);

        });


        it('should clear game board', (done)=>{

            spyOn(GameBoard.prototype, 'clearSurface');

            controller.gameOver();

            setTimeout(()=>{
                expect(GameBoard.prototype.clearSurface).toHaveBeenCalled();
                done();

            }, 100);

        });


        it('should clear game board mesh', (done)=>{

            spyOn(GameBoard.prototype, 'clearMesh');

            controller.gameOver();

            setTimeout(()=>{
                expect(GameBoard.prototype.clearMesh).toHaveBeenCalled();
                done();

            }, 100);

        });
        

    });

    describe('checkTetrinoSpeed', ()=>{

        var defaultGameSpeedRising = 50,
            defaultDropInterval = 1000,
            risingSpeedCounter = 0;


        it('should change game speed(drop interval) when certain number off tetrino blocks was showed', ()=>{

            risingSpeedCounter = 4;

            for(var i=0; i<risingSpeedCounter; i++){

                controller.elapsedTetrinoCounter = gameProps.changingGameSpeedTetrinoCounter;
                controller.checkTetrinoSpeed();
            }

            expect(controller.dropInterval).toBe(defaultDropInterval - (defaultGameSpeedRising*risingSpeedCounter));

        });

        it('maximum speed game should not to be more then 50 ms', ()=>{

            var maximumGameSpeed = 50;

            risingSpeedCounter = (defaultDropInterval/defaultGameSpeedRising) + 10;

            for(var i=0; i<risingSpeedCounter; i++){

                controller.elapsedTetrinoCounter = gameProps.changingGameSpeedTetrinoCounter;
                controller.checkTetrinoSpeed();
            }

            expect(controller.dropInterval).toBe(maximumGameSpeed);

        });


        it('when game speed will rise score velocity should be rising', ()=>{

            var scoreVelocityRising = 1,
                scoreVelocity = 1;

            risingSpeedCounter = 5;

            for(var i=0; i<risingSpeedCounter; i++){

                controller.elapsedTetrinoCounter = gameProps.changingGameSpeedTetrinoCounter;
                controller.checkTetrinoSpeed();

                scoreVelocity += scoreVelocityRising;
            }

            expect(controller.tetrinoScoreVelocity).toBe(scoreVelocity);

        });



    });

    describe('getNextTetrino', ()=>{

        var currentTetrinoShape = null;

        beforeEach(()=>{

            currentTetrinoShape = new TetrinoFactory().getNewTetrino();
            controller.nextTetrino = currentTetrinoShape;

        });

        it('next tetrino shape property should be set to new shape', ()=>{

            controller.getNextTetrino();

            expect(controller.nextTetrino).not.toBe(currentTetrinoShape)
        });


        it('should show next tetrino shape on game status board', ()=>{

            spyOn(GameStatus.prototype, 'drawNextTetrino');
            controller.getNextTetrino();

            expect(GameStatus.prototype.drawNextTetrino).toHaveBeenCalledWith(controller.nextTetrino.shape);
        });


    });


});
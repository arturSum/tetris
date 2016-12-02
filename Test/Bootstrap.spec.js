import {Bootstrap} from 'Src/Bootstrap'
import {GameObserver} from 'Src/helpers/GameObserver'
import {Controller} from 'Src/core/Controller'


describe('Bootstrap', ()=>{

    var game = null;
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

    };

    beforeEach(()=>{

        document.body.insertAdjacentHTML( 'afterbegin', getGameHtmStructure('gameBox'));
        game = new Bootstrap();
    });

    afterEach(()=>{

        document.body.innrHTML = '';
        game = null;

    });

    describe('SetParams', ()=>{

        describe('on correct config', ()=>{

            var config = {
                surfaceWidth : 400,
                containerId : 'gameBox'
            };

            beforeEach(()=>{
                game.setParams(config);
            });

            it('areConfigPropsCorrect should be true', ()=>{

                var areConfigPropsCorrect = game.getAreConfigPropsCorrect();

                expect(typeof areConfigPropsCorrect).toBe('boolean');
                expect(areConfigPropsCorrect).toBe(true);
            });


            it('config should be widen off correct DOM Handle props', ()=>{

                var domHandleProps = [
                    'mainBoardCanvasDOMHandle',
                    'nextShapeCanvasDOMHandle',
                    'gameScoreDOMHandle',
                    'startButtonDOMHandle'
                ];

                var expectedFullConfigProps = domHandleProps.concat(Object.keys(config)),
                    currentConfigProps = Object.keys(game.getGameProp());

                expect(currentConfigProps.sort()).toEqual(expectedFullConfigProps.sort());

            });


        });



        it('on incorrect config areConfigPropsCorrect should be false', ()=>{

            //min width: 200

            game.setParams({
                surfaceWidth : 10,
                containerId : 'gameBox'
            });
            expect(game.getAreConfigPropsCorrect()).toBe(false);

            game.setParams({
                surfaceWidth : -200,
                containerId : 'gameBox'
            });
            expect(game.getAreConfigPropsCorrect()).toBe(false);

            game.setParams({
                surfaceWidth : 0,
                containerId : 'gameBox'
            });
            expect(game.getAreConfigPropsCorrect()).toBe(false);

            game.setParams({
                surfaceWidth : 'x',
                containerId : 'gameBox'
            });
            expect(game.getAreConfigPropsCorrect()).toBe(false);

            game.setParams({
                surfaceWidth : null,
                containerId : 'gameBox'
            });
            expect(game.getAreConfigPropsCorrect()).toBe(false);


            game.setParams({
                surfaceWidth : {},
                containerId : 'gameBox'
            });
            expect(game.getAreConfigPropsCorrect()).toBe(false);


            //-----------------------------


            game.setParams({
                surfaceWidth : 220,
                containerId : 'non_existing'
            });
            expect(game.getAreConfigPropsCorrect()).toBe(false);

            game.setParams({
                surfaceWidth : 220,
                containerId : ''
            });
            expect(game.getAreConfigPropsCorrect()).toBe(false);

            game.setParams({
                surfaceWidth : 220,
                containerId : null
            });
            expect(game.getAreConfigPropsCorrect()).toBe(false);

            game.setParams({
                surfaceWidth : 220,
                containerId : []
            });
            expect(game.getAreConfigPropsCorrect()).toBe(false);


            //------------------------------------


            game.setParams({});
            expect(game.getAreConfigPropsCorrect()).toBe(false);

            game.setParams(null);
            expect(game.getAreConfigPropsCorrect()).toBe(false);

            game.setParams('');
            expect(game.getAreConfigPropsCorrect()).toBe(false);
            
        });



    });

    describe('setEventsListener', ()=>{

        describe('on correct config', ()=>{

            var config =  {

                eventEmitter : 'Src/helpers/EventEmitter',
                eventObserver : 'Src/helpers/GameObserver',
                actionsName : ['Tetris_gameBox_Start', 'Tetris_gameBox_End', 'Tetris_gameBox_ReadyToStart']
            };


            it('should register eventObserver in eventEmitter', (done)=>{

                spyOn(GameObserver, 'eventExecute');

                game.setEventsListener(config).then(()=>{

                    var gameEventListener = game.getGameEventListener();

                    gameEventListener.notifyObservers(config.actionsName[0]);
                    expect(GameObserver.eventExecute).toHaveBeenCalled();

                    done();

                });

            });


            it('should set gameEventListener props', (done)=>{

                game.setEventsListener(config).then(()=>{

                    var gameEventListener = game.getGameEventListener();

                    expect(typeof gameEventListener).toBe('object');
                    expect(Object.keys(gameEventListener).sort()).toEqual(['subscribe', 'detach', 'notifyObservers'].sort());

                    done();

                });

            });


        });



        it('on incorrect config should set gameEventListener on default ', ()=>{


            game.setEventsListener('').then(()=>{

                var gameEventListener = game.getGameEventListener();

                expect(typeof gameEventListener).toBe('object');
                expect(gameEventListener).toContain('notifyObservers');

                done();

            });

            game.setEventsListener({}).then(()=>{

                var gameEventListener = game.getGameEventListener();

                expect(typeof gameEventListener).toBe('object');
                expect(gameEventListener).toContain('notifyObservers');

                done();

            });

            game.setEventsListener(null).then(()=>{

                var gameEventListener = game.getGameEventListener();

                expect(typeof gameEventListener).toBe('object');
                expect(gameEventListener).toContain('notifyObservers');

                done();

            });

            //--------------------------------

            game.setEventsListener({
                x : null
            }).then(()=>{

                var gameEventListener = game.getGameEventListener();

                expect(typeof gameEventListener).toBe('object');
                expect(gameEventListener).toContain('notifyObservers');

                done();

            });

            game.setEventsListener({
                x : null,
                eventObserver : 'fakeObserver',
                z : 'fake'
            }).then(()=>{

                var gameEventListener = game.getGameEventListener();

                expect(typeof gameEventListener).toBe('object');
                expect(gameEventListener).toContain('notifyObservers');

                done();

            });

            game.setEventsListener({
                eventEmitter : 'Src/helpers/EventEmitter',
                eventObserver : 'fakeObserver',
                z : ['fake']
            }).then(()=>{

                var gameEventListener = game.getGameEventListener();

                expect(typeof gameEventListener).toBe('object');
                expect(gameEventListener).toContain('notifyObservers');

                done();

            });

            game.setEventsListener({
                x : '',
                y : [],
                z : {}
            }).then(()=>{

                var gameEventListener = game.getGameEventListener();

                expect(typeof gameEventListener).toBe('object');
                expect(gameEventListener).toContain('notifyObservers');

                done();

            });


        });



    });

    describe('run', ()=>{

        describe('on correct settings', ()=>{

            it('should announce correct ReadyToStart action', ()=>{

                var correctActionName = 'Tetris_gameBox_ReadyToStart',
                    eventListener = game.getGameEventListener();
                
                spyOn(eventListener, 'notifyObservers');

                game.setParams({
                    surfaceWidth : 400,
                    containerId : 'gameBox'
                });
                game.run();

                setTimeout(()=>{
                    expect(eventListener.notifyObservers).toHaveBeenCalledWith(correctActionName);
                }, 100);

            });

            it('Controller module should prepare to start game', ()=>{

                spyOn(Controller.prototype, 'createGameBoard');

                game.setParams({
                    surfaceWidth : 400,
                    containerId : 'gameBox'
                });
                game.run();

                setTimeout(()=>{
                    expect(Controller.prototype.createGameBoard).toHaveBeenCalled();
                }, 100);

            });

            it('start button should be set on click event to call runGame method from Controller', ()=>{

                game.setParams({
                    surfaceWidth : 400,
                    containerId : 'gameBox'
                });

                spyOn(Controller.prototype, 'runGame');
                game.run();

                setTimeout(()=>{

                    var buttonNode = (game.getGameProp()).startButtonDOMHandle;

                    buttonNode.click();
                    expect(Controller.prototype.runGame).toHaveBeenCalled();

                }, 150);

            });

        });

        it('on incorrect settings should throw exception', ()=>{

            game.setParams();
            expect(game.run).toThrow();
        });


    });


});
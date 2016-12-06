import {Controller} from './core/Controller'





import EventEmitter from './helpers/EventEmitter'

import AObserver from './helpers/Observers/AObserver'








var Bootstrap = (()=>{


        var checkCorrectGameParam = (configProps)=>{

                var _expectedClassNameMapToConfig = new Map([

                    ['mainBoardCanvasDOMHandle', 'gameBoard'],
                    ['nextShapeCanvasDOMHandle', 'nextShape'],
                    ['gameScoreDOMHandle', 'score'],
                    ['startButtonDOMHandle', 'startButton']

                ]);

                configProps = configProps || {};

                if(typeof configProps.containerId == 'string' && configProps.containerId.trim().length > 0){

                    var DOMAccessHandle = {},
                        singleDomNode = null;

                    for(let [key, value] of _expectedClassNameMapToConfig){

                        singleDomNode = document.querySelector(`#${configProps.containerId} .${value}`);

                        if(singleDomNode){
                            DOMAccessHandle[key] = singleDomNode;
                        }
                        else{
                            return [false];
                        }
                    }
                }
                else{
                    return [false];
                }

                if(!configProps.surfaceWidth || configProps.surfaceWidth < 200 || typeof configProps.surfaceWidth != 'number'){
                    return [false];
                }

                return [true, Object.assign({}, configProps, DOMAccessHandle)];
        },

        tryRegisterObserverInEventEmitter = (...data)=>{

                var [observerModule, actionsName, eventEmitter] = data,
                    actionsNameQnt = actionsName.length,
                    currentObserverClass,
                    observerObj;

                for(var observerName in observerModule){

                    currentObserverClass = observerModule[observerName];

                    if(
                        typeof currentObserverClass === 'function' &&
                        (observerObj = new currentObserverClass()) instanceof AObserver
                    ){

                        while(actionsNameQnt--){
                            eventEmitter.subscribe(actionsName[actionsNameQnt], observerObj);
                        }

                        return observerObj;
                    }

                }
        },

        startUpGame = (gameProp, eventEmitter)=>{

            var controllerInstance = new Controller(gameProp, eventEmitter);

            gameProp.startButtonDOMHandle.addEventListener('click', ()=>{
                    controllerInstance.runGame();
            });

            controllerInstance.createGameBoard().
                               createGameStatusBoard().
                               createGameBoardMesh().
                               setBlockMovingEvents();

        };



    function Bootstrap(){

       var areConfigPropsCorrect = false,
           gameProp = null,
           eventEmitter = EventEmitter(),
           gameObserver = null;


        this.setGameProp = (val)=>{
            gameProp = val;
        };
        this.getGameProp = ()=>{
            return gameProp;
        };

        this.setGameObserver = (observer)=>{
          gameObserver = observer;
        };

        this.getGameObserver = ()=>{
            return gameObserver;
        };

        this.getEventEmitter = ()=>{
            return eventEmitter;
        };

        this.setAreConfigPropsCorrect = (val)=>{
            areConfigPropsCorrect = val;
        };
        this.getAreConfigPropsCorrect = ()=>{
            return areConfigPropsCorrect
        };


    }


    Bootstrap.prototype = {

        setParams : function(prop = {}){

           var [areConfigPropsCorrectVal, gamePropVal] = checkCorrectGameParam(prop);

           this.setAreConfigPropsCorrect(areConfigPropsCorrectVal);
           this.setGameProp(gamePropVal);

        },

        setObserver : function(props = {}){

            var errorMessage = (e)=>{
                console.log(e);
                console.info('Can not register observer in EventEmitter');

            };

            return new Promise((resolve)=>{

                    try {

                        System.import(props.observer).then((importedModules)=>{

                            this.setGameObserver( tryRegisterObserverInEventEmitter(importedModules, props.actionsName, this.getEventEmitter()) );
                            resolve();

                        })
                        .catch((e)=>{
                                errorMessage(e);
                        });

                    }
                    catch(e){
                        errorMessage(e);
                    }

            });

        },


        run : function(){

             var gameProp = this.getGameProp(),
                 areConfigPropsCorrect = this.getAreConfigPropsCorrect(),
                 eventEmitter = this.getEventEmitter();

             if(!areConfigPropsCorrect){

                    document.body.innerHTML = '';
                    throw 'Tetris: Config props are incorrect';
             }

            setTimeout(()=>{

                startUpGame(gameProp, eventEmitter);
                eventEmitter.notifyObservers(`Tetris_${gameProp.containerId}_ReadyToStart`);

            }, 50);

        }

    };


    return Bootstrap;

})();

export {Bootstrap}


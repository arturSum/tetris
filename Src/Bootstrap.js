import {Controller} from './core/Controller'


var Bootstrap = ((global)=>{


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
    };


    var importModule = (moduleStorage)=>{

        return Promise.all(moduleStorage.map((val)=>{
            return System.import(val)
        }))
    };


    var tryRegisterObserverInEventEmitter = (...data)=>{


        var [[EventEmitterModule, EventObserverModule],  actionsName] = data,
             actionsNameQnt = actionsName.length;

        EventEmitterModule = EventEmitterModule[Object.keys(EventEmitterModule)[0]];
        EventObserverModule = EventObserverModule[Object.keys(EventObserverModule)[0]];

        while(actionsNameQnt--){
            EventEmitterModule.subscribe(actionsName[actionsNameQnt], EventObserverModule);
        }

        return EventEmitterModule;
    };


    var startUpGame = (...config)=>{

        var [gameProp, gameEventListener] = config;

                var controllerInstance = new Controller(gameProp, gameEventListener);


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
           gameEventListener = {
               notifyObservers : ()=>{}
           };



        this.setGameProp = (val)=>{
            gameProp = val;
        };
        this.getGameProp = ()=>{
            return gameProp
        };

        this.setGameEventListener = (val)=>{
            gameEventListener = val;

        };
        this.getGameEventListener = ()=>{
            return gameEventListener;
        };

        this.setAreConfigPropsCorrect = (val)=>{
            areConfigPropsCorrect = val;
        };
        this.getAreConfigPropsCorrect = ()=>{
            return areConfigPropsCorrect
        };



    }




    var setEventsListenerTriggerFlag = false;

        Bootstrap.prototype = {

        setParams : function(prop = {}){


           var [areConfigPropsCorrectVal, gamePropVal] = checkCorrectGameParam(prop);

           this.setAreConfigPropsCorrect(areConfigPropsCorrectVal);
           this.setGameProp(gamePropVal);


        },

        setEventsListener : function(props = {}){

            var errorMessage = ()=>{
                console.info('EventsListener are not set');
                setEventsListenerTriggerFlag = false;
            };


            return new Promise((resolve)=>{

                    setEventsListenerTriggerFlag = true;

                    try {
                            importModule([props.eventEmitter, props.eventObserver]).then((importedModules)=> {

                                this.setGameEventListener( tryRegisterObserverInEventEmitter(importedModules, props.actionsName) );
                                resolve();

                            }).catch((e)=>{
                                errorMessage();
                            });

                    }
                    catch(e){
                        errorMessage();
                    }

            });

        },


        run : function(){

             var gameProp = this.getGameProp(),
                 areConfigPropsCorrect = this.getAreConfigPropsCorrect();


             if(!areConfigPropsCorrect){

                    document.body.innerHTML = '';
                    throw 'Tetris: Config props are incorrect';
                }



            setTimeout(()=>{

                var gameEventListener = this.getGameEventListener();

                    startUpGame(gameProp, gameEventListener);

                    gameEventListener.notifyObservers(`Tetris_${gameProp.containerId}_ReadyToStart`);

            }, 50);


        }


    };



    return Bootstrap;

})(window);

export {Bootstrap}


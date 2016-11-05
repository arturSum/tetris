
var Tetris = ((global)=>{

    'use strict';


    const checkCorrectConfigProp = ([configProps = {}, eventListener = Function.prototype])=>{

        //mapowanie wpasciwosci obiektu config na nazw klas obiektow w DOM
        var _expectedClassNameMapToConfig = new Map([

            ['mainBoardCanvasDOMHandle', 'gameBoard'],
            ['nextShapeCanvasDOMHandle', 'nextShape'],
            ['gameScoreDOMHandle', 'score'],
            ['startButtonDOMHandle', 'startButton']

        ]);

        //check send as config null
        if(!configProps){
            return [false]
        }

        //check containerId
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


        //check surfaceWidth
        if(!configProps.surfaceWidth || configProps.surfaceWidth < 200){
            return [false];
        }


        //check EventListener
        if(!eventListener || typeof eventListener != 'object' || typeof eventListener.notifyObservers != 'function'){

            eventListener = {
                notifyObservers : ()=>{console.error('EventsListener are not set');}
            }
        }

        //all correct
        return [true, Object.assign(configProps, DOMAccessHandle), eventListener];
    };


    //#####################################################################3


    if(typeof Tetris === 'function'){
        throw 'You already have a Tetris function in global scope'
    }


    return function(){

        this.set = (...config)=>{

            global.addEventListener('load', ()=>{

                var [correctSettingsFlag = false, settings, eventListener] = checkCorrectConfigProp(config);

                if(!correctSettingsFlag){

                    document.body.innerHTML = '';
                    throw 'Tetris: Config props are incorrect';
                }

                var controllerInstance = new Controller(settings, eventListener);
                global.TET = controllerInstance;


                //run game on click
                settings.startButtonDOMHandle.addEventListener('click', ()=>{
                    controllerInstance.runGame();
                });

                controllerInstance.createGameBoard().
                                   createGameStatusBoard().
                                   createGameBoardMesh().
                                   setBlockMovingEvents();


            });

        };

    }


})(window);




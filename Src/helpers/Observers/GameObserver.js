import AObserver from './AObserver'



const GameObserver = function(){


        this.eventExecute = (eventId, additionalParam = [])=> {

            var gameId = eventId.split('_');

            var gameContainer = document.getElementById(gameId[1]);

            var nextShapeCanvasDOMHandle = document.querySelector(`#${gameId[1]} .nextShape`),
                gameScoreDOMHandle = document.querySelector(`#${gameId[1]} .score`),
                loaderNode = document.querySelector(`.${gameId[1]}_loader`);

            switch (gameId[2]) {

                case 'ReadyToStart' :

                    window[Symbol.for('gameBox_loader')] = 'cancel_loader';
                    loaderNode.className = `${loaderNode.className} hiding_animation`;

                    setTimeout(() => {

                        loaderNode.className = loaderNode.className.replace('hiding_animation', 'no-visible');
                        gameContainer.className = gameContainer.className.replace('no-ready', 'ready');

                    }, 520);

                    break;

                case 'Start' :

                    nextShapeCanvasDOMHandle.parentNode.className = `${nextShapeCanvasDOMHandle.parentNode.className.trim()} start`;
                    gameScoreDOMHandle.parentNode.className = `${gameScoreDOMHandle.parentNode.className.trim()} start`;

                    gameScoreDOMHandle.className = gameScoreDOMHandle.className.replace('no-start', '');

                    break;

                case 'End' :

                    nextShapeCanvasDOMHandle.parentNode.className = nextShapeCanvasDOMHandle.parentNode.className.replace('start', '');
                    gameScoreDOMHandle.parentNode.className = gameScoreDOMHandle.parentNode.className.replace('start', '');

                    gameScoreDOMHandle.className = `${gameScoreDOMHandle.className.trim()} no-start`;

                    break;


            }

        }

};




GameObserver.prototype = Object.create(AObserver.prototype);


export {GameObserver};



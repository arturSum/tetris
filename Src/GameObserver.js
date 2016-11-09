

const gameObserver = (()=>{


    return{
        
        eventExecute : (eventId, additionalParam = [])=>{
            
            var gameId = eventId.split('_');

            var gameContainer = document.getElementById(gameId[1]);

            var nextShapeCanvasDOMHandle = document.querySelector(`#${gameId[1]} .nextShape`),
                gameScoreDOMHandle = document.querySelector(`#${gameId[1]} .score`);



            switch(gameId[2]){


                case 'ReadyToStart' :

                    gameContainer.className = gameContainer.className.replace(/^spinner/, '');
                    break;


                case 'Start' :



                    //add transition to class
                    nextShapeCanvasDOMHandle.parentNode.className = `${nextShapeCanvasDOMHandle.parentNode.className} start`;
                    gameScoreDOMHandle.parentNode.className = `${gameScoreDOMHandle.parentNode.className} start`;

                    break;


                case 'End' :

                    nextShapeCanvasDOMHandle.parentNode.className = nextShapeCanvasDOMHandle.parentNode.className.replace(/^start/, '');
                    gameScoreDOMHandle.parentNode.className = gameScoreDOMHandle.parentNode.className.replace(/^start/, '');

                    break;


            }

        }
        

    }
    
    
})();

export {gameObserver};


const gameObserver = (()=>{


    return{
        
        eventExecute : (eventId, additionalParam = [])=>{
            
            var gameId = eventId.split('_');


            var nextShapeCanvasDOMHandle = document.querySelector(`#${gameId[1]} .nextShape`),
                gameScoreDOMHandle = document.querySelector(`#${gameId[1]} .score`);

            switch(gameId[2]){

                case 'Start' :

                    //add transition to class
                    nextShapeCanvasDOMHandle.parentNode.className = `${nextShapeCanvasDOMHandle.parentNode.className} start`;
                    gameScoreDOMHandle.parentNode.className = `${gameScoreDOMHandle.parentNode.className} start`;

                    break;


                case 'End' :

                    nextShapeCanvasDOMHandle.parentNode.className = nextShapeCanvasDOMHandle.parentNode.className.replace(/\s{1}start/, '');
                    gameScoreDOMHandle.parentNode.className = gameScoreDOMHandle.parentNode.className.replace(/\s{1}start/, '');

                    break;


            }

        }
        

    }
    
    
})();
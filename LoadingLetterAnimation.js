


document.addEventListener('DOMContentLoaded', ()=>{

    var animationLetters = document.querySelectorAll('.gameBox_loader .core span'),
        currentLetterAnimationFlag = 0,
        animationId = null;

    var clearAnimationClass = (nodeToClear)=>{

        nodeToClear.forEach((latterNode)=>{
            latterNode.className = '';
        });
    };

    (function letterAnimation(){

        setTimeout(()=>{

            animationId = requestAnimationFrame(letterAnimation);

            if(window[Symbol.for('gameBox_loader')] == 'cancel_loader'){

                cancelAnimationFrame(animationId);
                return;
            }

            clearAnimationClass(animationLetters);

            animationLetters[currentLetterAnimationFlag].className = 'animate';
            currentLetterAnimationFlag++;

            //konieck danych wejsciowych - reset ustawien i start od poczatku
            if(currentLetterAnimationFlag > animationLetters.length-1){
                currentLetterAnimationFlag = 0;
            }

        }, 400);

    })();

});

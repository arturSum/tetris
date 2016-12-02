
class TetrinoFactory{

    constructor(){

        this.availableColor = (()=>{

            var colors = [],
                colorQnt = 7;

            for(var x=0; x<colorQnt; x++){

                colors.push(`hsl( ${Math.floor(Math.random()*366)}, 100%, 50%  )`);
            }

            colors.unshift(null);

            return colors;

        })();


        this.availableBlock = [
            [
                [1, 1],
                [1, 1]
            ],
            [
                [2, 2, 2],
                [0, 2, 0],
                [0, 0, 0]
            ],
            [
                [0, 3, 0, 0],
                [0, 3, 0, 0],
                [0, 3, 0, 0],
                [0, 3, 0, 0]
            ],
            [
                [0, 4, 0],
                [0, 4, 0],
                [0, 4, 4]
            ],
            [
                [0, 5, 0],
                [0, 5, 0],
                [5, 5, 0]
            ],
            [
                [0, 6, 6],
                [6, 6, 0],
                [0, 0, 0]
            ],
            [
                [7, 7, 0],
                [0, 7, 7],
                [0, 0, 0]
            ]
        ];


    }



    getRandomBlockShape(){
        return this.availableBlock[Math.floor(Math.random()*(this.availableBlock.length-1))]
    }

    getAvailableColors(){
        return this.availableColor;
    }

    getNewTetrino(){

        return {

            shape : this.getRandomBlockShape(),
            pos : {
                x : 0,
                y : 0
            }

        }


    }


}

export default TetrinoFactory;
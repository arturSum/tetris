describe('Tetris Class (bootstrap)', ()=>{

    let tetris = null;

    beforeEach(()=>{


        var configuration = {

            //minimum 200px
            surfaceWidth : 400,
            containerId : 'gameBox'

            //opcjonalnie - z ich standardowymi ustawieniami w klasie Controller
            //dropInterval : 1000,
            //tetrinoSpeedRising : 50,
            //changingTetrinoSpeedInterval : 10

        };





        tetris = new Tetris();

        tetris.set();

        console.log(window['onload']);


    });

    it('set method should be defined', ()=>{
        //expect(typeof tetris.set).toBe('function');
    });

    it('if in global scope exist that class should throw exception', ()=>{
       expect(Tetris).toThrow();
    });

    it('should throw errors on incorrect configuration object in set method', ()=>{





    });





});
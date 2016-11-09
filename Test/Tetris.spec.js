describe('Tetris Class (bootstrap)', ()=>{

    var tetris = null;

    beforeEach(()=>{

        tetris = new Tetris();

    });

    it('set method should be defined', ()=>{
        expect(typeof tetris.set).toBe('function');
    });

    it('if in global scope exist that class should throw exception', ()=>{

        console.log(typeof Tetris === 'function');

       expect(Tetris).toThrow();
    });

    it('should throw errors on incorrect configuration object in set method', ()=>{





    });





});
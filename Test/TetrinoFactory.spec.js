import TetrinoFactory from 'Src/core/TetrinoFactory'


describe('TetrinoFactory', ()=>{

    var tetrinoFactory;

    beforeEach(()=>{
        tetrinoFactory = new TetrinoFactory();
    });

    afterEach(()=>{
        tetrinoFactory = null;
    });

    describe('getNewTetrino', ()=>{


        it('should return tetrino with reseted X, Y position', ()=>{

            expect(tetrinoFactory.getNewTetrino().pos).toEqual({x:0, y:0});
        });

    });

    describe('getRandomBlockShape', ()=>{

        it('should return certain tetrino shape only', ()=>{

            var availabeShape = [

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

            expect(availabeShape).toContain(tetrinoFactory.getNewTetrino().shape);
        });

    });

    describe('getAvailableColors', ()=>{

        it('should return hsl color sting array when on first position is null', ()=>{

            var availableTetrinoColor = tetrinoFactory.getAvailableColors(),
                hslColorStringExpectedPattern = /\d{1,3}/g,
                areColorCorrect = false;

            expect(availableTetrinoColor[0]).toBeNull();


            //-----------------------------------


            availableTetrinoColor.shift();

            var tetrinoColorValue = availableTetrinoColor.map((singleColorString)=>{

                return singleColorString.match(hslColorStringExpectedPattern);
            });


            tetrinoColorValue.forEach((singleColorInfo)=>{

                if(
                    singleColorInfo[0]*1 < 367 &&
                    singleColorInfo[0] >= 0 &&
                    singleColorInfo[1]*1 === 100 &&
                    singleColorInfo[2]*1 === 50
                ){
                    areColorCorrect = true;
                }
            });


            expect(areColorCorrect).toBeTruthy();

        });

    });

});
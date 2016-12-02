import GameBoard from 'Src/core/GameBoard'
import TetrinoFactory from 'Src/core/TetrinoFactory'


describe('GameBoard', ()=>{

    var getGameHtmStructure = (gameId)=>{

        return   `<div id="${gameId}" class="spinner">

                        <div class="container">
                
                            <div class="row">
                
                                <div class="gameBoardContainer col-md-4">
                                     <canvas class="gameBoard">You browser not support canvas element</canvas>
                                </div>
                
                                <div class="gameStatusContainer col-md-2">
                
                                    <div class="nextShapeContainer">
                                        <h3><span class="label label-success">Next</span></h3>
                                        <canvas class="nextShape"></canvas>
                                    </div>
                
                                    <div  class="scoreContainer">
                                        <h3><span class="label label-success">Score</span></h3>
                                        <h1 class="score"></h1>
                                    </div>
                
                                    <div class="btn-group btn-group-justified buttonContainer" role="group">
                                        <button type="button" class="startButton btn btn-primary">Start</button>
                                    </div>
                
                                </div>
                
                            </div>
                
                         </div>
                
                    </div>`;

    };

    var config = {
        'mainBoardCanvasDOMHandle' : null,
        'surfaceWidth' : 400,
        'gameStep' : 400/20
    },
    tetrinoFactory = new TetrinoFactory(),
    fakeController = {

        getNewTetrino : ()=>{
            return tetrinoFactory.getNewTetrino();
        },
        getTetrinoAvailableColors : ()=>{
            return tetrinoFactory.getAvailableColors();
        },
        getNextTetrino(){
            return this.getNewTetrino();
        },
        checkTetrinoSpeed : jasmine.createSpy('checkTetrinoSpeed'),
        gameOver : jasmine.createSpy('gameOver'),
        addScore : jasmine.createSpy('addScore'),
        updateScoreInDOM : jasmine.createSpy('updateScoreInDOM')
    },
    gameBoard = null;

    beforeEach(()=>{

        document.body.insertAdjacentHTML( 'afterbegin', getGameHtmStructure('gameBox'));
        config.mainBoardCanvasDOMHandle = document.querySelector('.gameBoard');
        gameBoard = new GameBoard(config, fakeController);

    });

    afterEach(()=>{
        document.body.innerHTML = '';
        gameBoard = null;
    });


    describe('clearMesh', ()=>{

        it('should reset all game board mesh', ()=>{

            gameBoard.createMesh();

            var allClear = false;

            var boardMesh = gameBoard.boardMesh,
                YAxisRowQnt = boardMesh.length;

            boardMesh[0].fill(1);
            boardMesh[YAxisRowQnt/2].fill(1);
            boardMesh[YAxisRowQnt-1].fill(1);
            boardMesh[2][5] = 1;

            gameBoard.clearMesh();

            while(YAxisRowQnt--){
                allClear = boardMesh[YAxisRowQnt].indexOf(1) == -1;
            }

            expect(allClear).toBeTruthy();
        });

    });

    describe('createMesh', ()=>{

        it('should create game board mesh with size depends on board width', ()=>{

            var gameSizeProportion = 10/20;

            var expectedXAxisMeshLength =  config.surfaceWidth / config.gameStep,
                expectedYAxisMeshLength = (config.surfaceWidth + (config.surfaceWidth*gameSizeProportion))/config.gameStep;

            gameBoard.createMesh();

            expect(gameBoard.boardMesh.length).toBe(expectedYAxisMeshLength);
            expect(gameBoard.boardMesh[0].length).toBe(expectedXAxisMeshLength);

        });


        it('created mesh should be empty', ()=>{

            gameBoard.createMesh();

            var allClear = false,
                YAxisRowQnt = gameBoard.boardMesh.length;

            while(YAxisRowQnt--){
                allClear = gameBoard.boardMesh[YAxisRowQnt].indexOf(1) == -1;
            }

            expect(allClear).toBeTruthy();

        });




    });

        describe('createSurface', ()=>{


        it('should set correct both size off game board', ()=>{

            var gameSizeProportion = 10/20;

            var expectedXSize = config.surfaceWidth,
                expectedYSize = expectedXSize + (expectedXSize*gameSizeProportion);

            gameBoard.createSurface();

            expect(config.mainBoardCanvasDOMHandle.width).toBe(expectedXSize);
            expect(config.mainBoardCanvasDOMHandle.height).toBe(expectedYSize);
        });


        it('created game board should have black background', ()=>{

            gameBoard.createSurface();

            var context = config.mainBoardCanvasDOMHandle.getContext('2d'),
                boardData = context.getImageData(0, 0, 1, 1);

            var expectedGameBoardColor = [0, 0, 0, 255],
                currentBackGroundValue = [];

            (
                {
                    0 : currentBackGroundValue[0],
                    1 : currentBackGroundValue[1],
                    2 : currentBackGroundValue[2],
                    3 : currentBackGroundValue[3]

                } = boardData.data
            );

            expect(currentBackGroundValue).toEqual(expectedGameBoardColor);
        });




    });

    describe('showGameOverInfo', ()=>{

        it('should write on game board game over text', ()=>{

            gameBoard.createSurface();
            gameBoard.showGameOverInfo();

                        var haveGameBoardContextDefaultColor = true;

            var context = config.mainBoardCanvasDOMHandle.getContext('2d'),
                boardData = context.getImageData(0, 0, config.mainBoardCanvasDOMHandle.width, config.mainBoardCanvasDOMHandle.width).data,
                boardDataQnt = boardData.length;

            for(var i=0; i<boardDataQnt; i += 4){ 

                if(
                    boardData[i] != 0 || 
                    boardData[i+1] != 0 || 
                    boardData[i+2] != 0 
                ){
                    haveGameBoardContextDefaultColor = false;
                    break;
                }

            }

            expect(haveGameBoardContextDefaultColor).toBeFalsy();
        });



    });

    describe('changeXAxisBlockPosition', ()=>{

        var currentBlockXAxisPosition = null;

        beforeEach(()=>{
            gameBoard.createMesh();
            currentBlockXAxisPosition = gameBoard.tetrinoBlock.pos.x;
        });

        it('should change block position to left or right', ()=>{

            gameBoard.changeXAxisBlockPosition(2);

            expect(gameBoard.tetrinoBlock.pos.x).toBe(currentBlockXAxisPosition + 2);

            currentBlockXAxisPosition = gameBoard.tetrinoBlock.pos.x;
            gameBoard.changeXAxisBlockPosition(-4);

            expect(gameBoard.tetrinoBlock.pos.x).toBe(currentBlockXAxisPosition -4);


            currentBlockXAxisPosition = gameBoard.tetrinoBlock.pos.x;
            gameBoard.changeXAxisBlockPosition(0);

            expect(gameBoard.tetrinoBlock.pos.x).toBe(currentBlockXAxisPosition);


        });


        it('if moving block did collision off wall or other tetrino it should cancel moving step', ()=>{

            spyOn(gameBoard, 'checkBlocksCollision').and.returnValue(true);

            gameBoard.changeXAxisBlockPosition(4);
            expect(gameBoard.tetrinoBlock.pos.x).toBe(currentBlockXAxisPosition);

            gameBoard.changeXAxisBlockPosition(-4);
            expect(gameBoard.tetrinoBlock.pos.x).toBe(currentBlockXAxisPosition);

        });


    });

    describe('drawShape', ()=>{


        var ctx, ctxData, testedSurfaceWidth, testedSurfaceHeight, squareLengthInPixels, getPixelInfo;

        var getImageData = function(posY, posX, ctxData){

            var realYPosInPx = posY*this.squareLengthInPixels,
                realXPosInPx = posX*this.squareLengthInPixels;

            return[

                ctxData[ ((realYPosInPx*this.testedSurfaceWidth) + realXPosInPx) * 4  ],
                ctxData[ (((realYPosInPx*this.testedSurfaceWidth) + realXPosInPx) * 4) + 1 ],
                ctxData[ (((realYPosInPx*this.testedSurfaceWidth) + realXPosInPx) * 4) + 2 ],
                ctxData[ (((realYPosInPx*this.testedSurfaceWidth) + realXPosInPx) * 4) + 3 ]

            ];

        };


        beforeEach(()=>{

            ctx = config.mainBoardCanvasDOMHandle.getContext('2d');
            gameBoard.createSurface();

            testedSurfaceWidth = Math.floor(gameBoard.boardWidth/2);
            testedSurfaceHeight = Math.floor(gameBoard.boardHeight/2);
            squareLengthInPixels = gameBoard.movingStep;

        });


        it('should draw expected single shape in correct position on game board', ()=>{

            getPixelInfo = getImageData.bind({testedSurfaceWidth, squareLengthInPixels});

            gameBoard.tetrinoBlock.shape = [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0]
            ];


            gameBoard.tetrinoBlock.pos = {x:0, y:0};

            gameBoard.drawShape(gameBoard.tetrinoBlock.shape, gameBoard.tetrinoBlock.pos);
            ctxData = ctx.getImageData(0, 0, testedSurfaceWidth, testedSurfaceHeight).data;


            expect(getPixelInfo(0+0, 0+0, ctxData)).toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(3+0, 2+0, ctxData)).toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(3+0, 0+0, ctxData)).toEqual([0, 0, 0, 255]);

            expect(getPixelInfo(0+0, 1+0, ctxData)).not.toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(3+0, 1+0, ctxData)).not.toEqual([0, 0, 0, 255]);



            gameBoard.clearSurface();

            gameBoard.tetrinoBlock.pos = {x:3, y:0};

            gameBoard.drawShape(gameBoard.tetrinoBlock.shape, gameBoard.tetrinoBlock.pos);
            ctxData = ctx.getImageData(0, 0, testedSurfaceWidth, testedSurfaceHeight).data;

            expect(getPixelInfo(0+0, 3+1, ctxData)).not.toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(0+2, 3+1, ctxData)).not.toEqual([0, 0, 0, 255]);

            expect(getPixelInfo(0+2, 2+1, ctxData)).toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(0+2, 4+1, ctxData)).toEqual([0, 0, 0, 255]);



            gameBoard.clearSurface();

            gameBoard.tetrinoBlock.pos = {x:0, y:2};

            gameBoard.drawShape(gameBoard.tetrinoBlock.shape, gameBoard.tetrinoBlock.pos);
            ctxData = ctx.getImageData(0, 0, testedSurfaceWidth, testedSurfaceHeight).data;

            expect(getPixelInfo(2+0, 0+1, ctxData)).not.toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(2+2, 0+1, ctxData)).not.toEqual([0, 0, 0, 255]);

            expect(getPixelInfo(2+1, 0+0, ctxData)).toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(2+4, 0+1, ctxData)).toEqual([0, 0, 0, 255]);



            gameBoard.clearSurface();

            gameBoard.tetrinoBlock.pos = {x:4, y:2};

            gameBoard.drawShape(gameBoard.tetrinoBlock.shape, gameBoard.tetrinoBlock.pos);
            ctxData = ctx.getImageData(0, 0, testedSurfaceWidth, testedSurfaceHeight).data;

            expect(getPixelInfo(2+0, 4+1, ctxData)).not.toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(2+3, 4+1, ctxData)).not.toEqual([0, 0, 0, 255]);

            expect(getPixelInfo(2+0, 4+2, ctxData)).toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(2+3, 0+2, ctxData)).toEqual([0, 0, 0, 255]);


        });


        it('should draw correct all game mesh with many block shapes', ()=>{

            gameBoard.boardMesh = [

                [0, 1, 0, 0, 0, 0, 0, 1], 
                [1, 1, 0, 0, 0, 0, 0, 1], 
                [0, 1, 0, 0, 0, 0, 1, 1], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 1, 1, 0, 0, 0], 
                [0, 0, 0, 1, 1, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 1, 0, 1, 1, 1, 1, 0], 
                [0, 1, 0, 0, 0, 0, 0, 0], 
                [0, 1, 0, 0, 0, 0, 0, 0], 
                [0, 1, 0, 0, 0, 0, 0, 0], 
                [0, 1, 0, 0, 1, 1, 1, 1]  

            ];


            testedSurfaceWidth = (gameBoard.boardMesh[0].length + 3)*squareLengthInPixels;
            testedSurfaceHeight = (gameBoard.boardMesh.length + 3)*squareLengthInPixels;

            getPixelInfo = getImageData.bind({testedSurfaceWidth, squareLengthInPixels});


            gameBoard.drawShape(gameBoard.boardMesh, {x:0, y:0});
            ctxData = ctx.getImageData(0, 0, testedSurfaceWidth, testedSurfaceHeight).data;


            expect(getPixelInfo(0, 0, ctxData)).toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(1, 2, ctxData)).toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(2, 0, ctxData)).toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(3, 1, ctxData)).toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(1, 6, ctxData)).toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(3, 7, ctxData)).toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(4, 5, ctxData)).toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(6, 3, ctxData)).toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(6, 5, ctxData)).toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(6, 7, ctxData)).toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(7, 7, ctxData)).toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(7, 0, ctxData)).toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(9, 0, ctxData)).toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(11, 0, ctxData)).toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(11, 3, ctxData)).toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(10, 7, ctxData)).toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(9, 2, ctxData)).toEqual([0, 0, 0, 255]);


            expect(getPixelInfo(0, 1, ctxData)).not.toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(0, 7, ctxData)).not.toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(1, 0, ctxData)).not.toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(2, 6, ctxData)).not.toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(4, 3, ctxData)).not.toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(5, 4, ctxData)).not.toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(7, 1, ctxData)).not.toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(11, 1, ctxData)).not.toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(7, 6, ctxData)).not.toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(8, 1, ctxData)).not.toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(11, 1, ctxData)).not.toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(11, 4, ctxData)).not.toEqual([0, 0, 0, 255]);
            expect(getPixelInfo(11, 7, ctxData)).not.toEqual([0, 0, 0, 255]);


        });


    });

    describe('rotateBlock', ()=>{

        beforeEach(()=>{
            gameBoard.createMesh();
        });

        it('should call method that will rotate block mesh with certain direction', ()=>{

            var defaultDirection = 'right';

            spyOn(gameBoard, 'rotateBlockMesh');

            gameBoard.rotateBlock(defaultDirection);

            expect(gameBoard.rotateBlockMesh).toHaveBeenCalledWith(gameBoard.tetrinoBlock.shape, defaultDirection);
        });

        it('should redefine tetrino X position if it is on collision with other block or wall', ()=> {

            gameBoard.tetrinoBlock.shape = [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0]
            ];
            gameBoard.tetrinoBlock.pos = {x:0, y:0};

            gameBoard.boardMesh = [
                [1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0]
            ];
            gameBoard.mergeBlockWithBoardMesh(gameBoard.tetrinoBlock.shape, gameBoard.tetrinoBlock.pos);

            expect(gameBoard.boardMesh).toEqual([
                [1, 1, 0, 0, 0, 0],
                [1, 1, 0, 0, 0, 0],
                [1, 1, 0, 0, 0, 0],
                [1, 1, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0]
            ]);


            gameBoard.boardMesh = [
                [1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0]
            ];
            gameBoard.tetrinoBlock.pos = {x:0, y:0};

            gameBoard.rotateBlock('left');
            gameBoard.mergeBlockWithBoardMesh(gameBoard.tetrinoBlock.shape, gameBoard.tetrinoBlock.pos);

            expect(gameBoard.boardMesh).toEqual([
                [1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 0],
                [1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0]
            ]);


            gameBoard.boardMesh = [
                [0, 0, 0, 0, 0, 1],
                [0, 0, 0, 0, 0, 1],
                [0, 0, 0, 0, 0, 1],
                [0, 0, 0, 0, 0, 1],
                [0, 0, 0, 0, 0, 1],
                [0, 0, 0, 0, 0, 1]
            ];
            gameBoard.tetrinoBlock.pos = {x:3, y:0};
            gameBoard.tetrinoBlock.shape = [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0]
            ];

            gameBoard.rotateBlock('left');
            gameBoard.mergeBlockWithBoardMesh(gameBoard.tetrinoBlock.shape, gameBoard.tetrinoBlock.pos);

            expect(gameBoard.boardMesh).toEqual([
                [0, 0, 0, 0, 0, 1],
                [0, 0, 0, 0, 0, 1],
                [0, 1, 1, 1, 1, 1],
                [0, 0, 0, 0, 0, 1],
                [0, 0, 0, 0, 0, 1],
                [0, 0, 0, 0, 0, 1]
            ]);


            gameBoard.boardMesh = [
                [0, 0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1, 0]
            ];
            gameBoard.tetrinoBlock.pos = {x:2, y:0};
            gameBoard.tetrinoBlock.shape = [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0]
            ];

            gameBoard.rotateBlock('left');
            gameBoard.mergeBlockWithBoardMesh(gameBoard.tetrinoBlock.shape, gameBoard.tetrinoBlock.pos);

            expect(gameBoard.boardMesh).toEqual([
                [0, 0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1, 0],
                [1, 1, 1, 1, 1, 0],
                [0, 0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1, 0]
            ]);


            gameBoard.boardMesh = [
                [0, 0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1, 0]
            ];
            gameBoard.tetrinoBlock.pos = {x:2, y:0};
            gameBoard.tetrinoBlock.shape = [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0]
            ];

            gameBoard.rotateBlock(null);
            gameBoard.mergeBlockWithBoardMesh(gameBoard.tetrinoBlock.shape, gameBoard.tetrinoBlock.pos);

            expect(gameBoard.boardMesh).toEqual([
                [0, 0, 0, 0, 1, 0],
                [1, 1, 1, 1, 1, 0],
                [0, 0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1, 0]
            ]);


        });

        it('should cancel rotation if is collision with bottom site', ()=>{

            gameBoard.boardMesh = [
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1]
            ];

            gameBoard.tetrinoBlock.shape = [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0]
            ];
            gameBoard.tetrinoBlock.pos = {x:0, y:2};

            gameBoard.rotateBlock(NaN);
            gameBoard.mergeBlockWithBoardMesh(gameBoard.tetrinoBlock.shape, gameBoard.tetrinoBlock.pos);

            expect(gameBoard.boardMesh).toEqual([
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 0, 0],
                [1, 1, 1, 1, 1, 1]
            ]);


            gameBoard.boardMesh = [
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1]
            ];

            gameBoard.tetrinoBlock.shape = [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0]
            ];
            gameBoard.tetrinoBlock.pos = {x:2, y:2};

            gameBoard.rotateBlock('left');
            gameBoard.mergeBlockWithBoardMesh(gameBoard.tetrinoBlock.shape, gameBoard.tetrinoBlock.pos);

            expect(gameBoard.boardMesh).toEqual([
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1]
            ]);

        })


    });

    describe('rotateBlockMesh', ()=>{

        it('should rotate tetrino block in certain direction', ()=>{

           var shapeMesh = [
               [1, 1, 1, 1],
               [0, 0, 0, 0],
               [0, 0, 0, 0],
               [0, 0, 0, 0]
           ];

           gameBoard.rotateBlockMesh(shapeMesh, 'left');

           expect(gameBoard.tetrinoBlock.shape).toEqual([
               [1, 0, 0, 0],
               [1, 0, 0, 0],
               [1, 0, 0, 0],
               [1, 0, 0, 0]
           ]);


            var shapeMesh = [
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];

            gameBoard.rotateBlockMesh(shapeMesh, 'right');

            expect(gameBoard.tetrinoBlock.shape).toEqual([
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1]
            ]);


            var shapeMesh = [
                [1, 0, 0],
                [1, 0, 0],
                [1, 1, 0],
            ];

            gameBoard.rotateBlockMesh(shapeMesh);

            expect(gameBoard.tetrinoBlock.shape).toEqual([
                [1, 1, 1],
                [1, 0, 0],
                [0, 0, 0],
            ]);



        })


    });

    describe('countStartingXPos', ()=>{

        it('should count X starting position of new terino', ()=>{

            gameBoard.tetrinoBlock.shape = [
                [1, 0, 0],
                [1, 0, 0],
                [1, 1, 0]
            ];

            gameBoard.boardWidth = 400;
            gameBoard.movingStep = 20;

            expect(gameBoard.countStartingXPos()).toBe( Math.floor( (((400/2)-(3/2)) / 20)  ) );


            gameBoard.tetrinoBlock.shape = [
                [1, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 0, 0, 0]
            ];

            gameBoard.boardWidth = 651;
            gameBoard.movingStep = 70;

            expect(gameBoard.countStartingXPos()).toBe( Math.floor( (((651/2)-(4/2)) / 70)  ) );

        });

    });

    describe('clearSurface', ()=>{


        it('should clear game board to black', ()=>{

            gameBoard.boardWidth = 400;
            gameBoard.boardHeight = 300;

            var ctx = config.mainBoardCanvasDOMHandle.getContext('2d');


            ctx.fillStyle = '#006400';
            ctx.fillRect(0, 0, gameBoard.boardWidth, gameBoard.boardHeight);

            var ctxData = ctx.getImageData(0, 0, gameBoard.boardWidth, gameBoard.boardHeight).data;

            expect(ctxData.indexOf(0x64)).toBeGreaterThan(-1);


            gameBoard.clearSurface();
            ctxData = ctx.getImageData(0, 0, gameBoard.boardWidth, gameBoard.boardHeight).data;


            expect(ctxData.indexOf(0x64)).toBe(-1);

            expect([
                ctxData[((gameBoard.boardWidth*10)+20)*4],
                ctxData[(((gameBoard.boardWidth*10)+20)*4) + 1],
                ctxData[(((gameBoard.boardWidth*10)+20)*4) + 2],
                ctxData[(((gameBoard.boardWidth*10)+20)*4) + 3]
            ]).toEqual([0, 0, 0, 255]);


        });


    });

    describe('checkBlocksCollision', ()=>{


        it('should return true if tetrino is on collision with other shape from game board', ()=>{

            gameBoard.boardMesh = [

                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0]  

            ];

            gameBoard.tetrinoBlock.shape = [
                [0, 4, 0],
                [0, 4, 0],
                [0, 4, 4]
            ];

            expect(
                gameBoard.checkBlocksCollision(gameBoard.tetrinoBlock.shape, {x:0, y:0})
            ).toBeFalsy();




            gameBoard.boardMesh[0].fill(1);
            expect(
                gameBoard.checkBlocksCollision(gameBoard.tetrinoBlock.shape, {x:0, y:0})
            ).toBeTruthy();



            gameBoard.boardMesh[0].fill(0);
            gameBoard.boardMesh[2].fill(1);
            expect(
                gameBoard.checkBlocksCollision(gameBoard.tetrinoBlock.shape, {x:0, y:0})
            ).toBeTruthy();




            gameBoard.boardMesh[2].fill(0);
            gameBoard.boardMesh[3].fill(1);
            expect(
                gameBoard.checkBlocksCollision(gameBoard.tetrinoBlock.shape, {x:0, y:0})
            ).toBeFalsy();






            gameBoard.boardMesh[3].fill(0);
            gameBoard.boardMesh[9].fill(1);
            gameBoard.boardMesh[10].fill(1);
            gameBoard.boardMesh[11].fill(1);

            expect(
                gameBoard.checkBlocksCollision(gameBoard.tetrinoBlock.shape, {x:3, y:7})
            ).toBeTruthy();




            gameBoard.boardMesh = [
                [1, 0, 0, 0, 0, 0, 0, 0], 
                [1, 0, 0, 0, 0, 0, 0, 0], 
                [1, 0, 0, 0, 0, 0, 0, 0], 
                [1, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0]  
            ];

            expect(
                gameBoard.checkBlocksCollision(gameBoard.tetrinoBlock.shape, {x:0, y:0})
            ).toBeFalsy();


            gameBoard.boardMesh = [
                [0, 1, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0]  
            ];

            expect(
                gameBoard.checkBlocksCollision(gameBoard.tetrinoBlock.shape, {x:0, y:0})
            ).toBeTruthy();




            gameBoard.boardMesh = [
                [1, 0, 1, 1, 0, 0, 0, 0], 
                [1, 0, 1, 1, 0, 0, 0, 0], 
                [1, 0, 0, 1, 0, 0, 0, 0], 
                [1, 1, 1, 1, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0]  
            ];

            expect(
                gameBoard.checkBlocksCollision(gameBoard.tetrinoBlock.shape, {x:0, y:0})
            ).toBeFalsy();





            gameBoard.boardMesh = [
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 1, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0]  
            ];

            expect(
                gameBoard.checkBlocksCollision(gameBoard.tetrinoBlock.shape, {x:2, y:3})
            ).toBeTruthy();




            gameBoard.boardMesh = [
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 1, 1, 1, 0, 0, 0], 
                [0, 0, 1, 0, 1, 0, 0, 0], 
                [0, 0, 1, 0, 1, 1, 0, 0], 
                [0, 0, 1, 0, 0, 1, 0, 0], 
                [0, 0, 1, 1, 1, 1, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0]  
            ];

            expect(
                gameBoard.checkBlocksCollision(gameBoard.tetrinoBlock.shape, {x:2, y:3})
            ).toBeFalsy();




            gameBoard.boardMesh = [
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 1, 1, 1, 0, 0, 0], 
                [0, 0, 1, 0, 1, 0, 0, 0], 
                [0, 0, 1, 0, 1, 1, 0, 0], 
                [0, 0, 1, 0, 0, 1, 0, 0], 
                [0, 0, 1, 1, 1, 1, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0]  
            ];

            expect(
                gameBoard.checkBlocksCollision(gameBoard.tetrinoBlock.shape, {x:2, y:6})
            ).toBeTruthy();



        });

        it('should return true if tetrino is on collision with wall', ()=>{

            gameBoard.boardMesh = [

                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0]  

            ];

            gameBoard.tetrinoBlock.shape = [
                [0, 4, 0],
                [0, 4, 0],
                [0, 4, 4]
            ];

            expect(
                gameBoard.checkBlocksCollision(gameBoard.tetrinoBlock.shape, {x:-2, y:0})
            ).toBeTruthy();

            expect(
                gameBoard.checkBlocksCollision(gameBoard.tetrinoBlock.shape, {x:-12, y:0})
            ).toBeTruthy();

            expect(
                gameBoard.checkBlocksCollision(gameBoard.tetrinoBlock.shape, {x:7, y:0})
            ).toBeTruthy();

            expect(
                gameBoard.checkBlocksCollision(gameBoard.tetrinoBlock.shape, {x:17, y:0})
            ).toBeTruthy();

            expect(
                gameBoard.checkBlocksCollision(gameBoard.tetrinoBlock.shape, {x:4, y:10})
            ).toBeTruthy();

            expect(
                gameBoard.checkBlocksCollision(gameBoard.tetrinoBlock.shape, {x:2, y:14})
            ).toBeTruthy();

            expect(
                gameBoard.checkBlocksCollision(gameBoard.tetrinoBlock.shape, {x:2, y:-1})
            ).toBeTruthy();





            expect(
                gameBoard.checkBlocksCollision(gameBoard.tetrinoBlock.shape, {x:2, y:9})
            ).toBeFalsy();

            expect(
                gameBoard.checkBlocksCollision(gameBoard.tetrinoBlock.shape, {x:2, y:0})
            ).toBeFalsy();

            expect(
                gameBoard.checkBlocksCollision(gameBoard.tetrinoBlock.shape, {x:-1, y:0})
            ).toBeFalsy();

            expect(
                gameBoard.checkBlocksCollision(gameBoard.tetrinoBlock.shape, {x:5, y:9})
            ).toBeFalsy();

            expect(
                gameBoard.checkBlocksCollision(gameBoard.tetrinoBlock.shape, {x:5, y:0})
            ).toBeFalsy();


        });


    });

    describe('mergeBlockWithBoardMesh', ()=>{

        it('should store block shape mesh in correct position of game board mesh', ()=>{

            gameBoard.boardMesh = [
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0]  
            ];

            gameBoard.tetrinoBlock.shape = [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 1]
            ];


            gameBoard.mergeBlockWithBoardMesh(gameBoard.tetrinoBlock.shape, {x:0, y:0});

            expect(gameBoard.boardMesh).toEqual([

                [0, 1, 0, 0, 0, 0, 0, 0], 
                [0, 1, 0, 0, 0, 0, 0, 0], 
                [0, 1, 1, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0]  

            ]);





            gameBoard.clearMesh();

            gameBoard.mergeBlockWithBoardMesh(gameBoard.tetrinoBlock.shape, {x:3, y:2});
            expect(gameBoard.boardMesh).toEqual([

                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 1, 0, 0, 0], 
                [0, 0, 0, 0, 1, 0, 0, 0], 
                [0, 0, 0, 0, 1, 1, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0]  

            ]);





            gameBoard.clearMesh();

            gameBoard.mergeBlockWithBoardMesh(gameBoard.tetrinoBlock.shape, {x:5, y:9});
            expect(gameBoard.boardMesh).toEqual([

                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 1, 0], 
                [0, 0, 0, 0, 0, 0, 1, 0], 
                [0, 0, 0, 0, 0, 0, 1, 1]  

            ]);




            gameBoard.clearMesh();

            gameBoard.mergeBlockWithBoardMesh(gameBoard.tetrinoBlock.shape, {x:-1, y:5});
            expect(gameBoard.boardMesh).toEqual([

                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [1, 0, 0, 0, 0, 0, 0, 0], 
                [1, 0, 0, 0, 0, 0, 0, 0], 
                [1, 1, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0, 0]  

            ]);



        });



    });

    describe('resetBlockPosition', ()=>{

        it('should request new tetrino block', ()=>{

           spyOn(fakeController, 'getNextTetrino').and.callThrough();
           spyOn(GameBoard.prototype, 'checkBlocksCollision').and.returnValue(false);

           gameBoard.resetBlockPosition();

           expect(fakeController.getNextTetrino).toHaveBeenCalled();

        });


        it('should check game speed increasing', ()=>{

            spyOn(GameBoard.prototype, 'checkBlocksCollision').and.returnValue(false);

            gameBoard.resetBlockPosition();

            expect(fakeController.checkTetrinoSpeed).toHaveBeenCalled();

        });


        it('should check new tetrion block X starting position', ()=>{

            spyOn(GameBoard.prototype, 'countStartingXPos');
            spyOn(GameBoard.prototype, 'checkBlocksCollision').and.returnValue(false);

            gameBoard.resetBlockPosition();

            expect(GameBoard.prototype.countStartingXPos).toHaveBeenCalled();

        });


        it('should check block collision with new tetrino shape on start ang call game over if true', ()=>{

            spyOn(GameBoard.prototype, 'checkBlocksCollision').and.returnValue(true);

            gameBoard.resetBlockPosition();

            expect(GameBoard.prototype.checkBlocksCollision).toHaveBeenCalled();
            expect(fakeController.gameOver).toHaveBeenCalled();

        });



    });

    describe('checkSurfaceLineFilling', ()=>{


        it('should check whole row filling on game board and clear it', ()=>{

            gameBoard.createMesh();

            gameBoard.boardMesh[gameBoard.boardMesh.length-1].fill(1);
            expect(gameBoard.checkSurfaceLineFilling()).toBeTruthy();
            expect(gameBoard.boardMesh[gameBoard.boardMesh.length-1].indexOf(1)).toBe(-1);




            gameBoard.clearMesh();
            expect(gameBoard.checkSurfaceLineFilling()).toBeFalsy();




            gameBoard.clearMesh();
            gameBoard.boardMesh[0].fill(1);
            expect(gameBoard.checkSurfaceLineFilling()).toBeTruthy();
            expect(gameBoard.boardMesh[0].indexOf(1)).toBe(-1);




            gameBoard.clearMesh();
            gameBoard.boardMesh[8].fill(1);
            expect(gameBoard.checkSurfaceLineFilling()).toBeTruthy();
            expect(gameBoard.boardMesh[8].indexOf(1)).toBe(-1);


        });



    });

    describe('dropBlock', ()=>{

        it('should move block down with certain steps', ()=>{

            gameBoard.tetrinoBlock.shape = [
                [1, 0, 0],
                [1, 0, 0],
                [1, 0, 0]
            ];
            gameBoard.tetrinoBlock.pos = {x:0, y:0};

            spyOn(GameBoard.prototype, 'checkBlocksCollision').and.returnValue(false);
            gameBoard.dropBlock();

            expect(gameBoard.tetrinoBlock.pos.y).toBe(1);
        });

        it('should check tetrino collision with other block or wall', ()=>{

            spyOn(GameBoard.prototype, 'checkBlocksCollision');
            gameBoard.dropBlock();

            expect(GameBoard.prototype.checkBlocksCollision).toHaveBeenCalled();
        });

        describe('on collision', ()=>{

            it('should move block up backward onY axis', ()=>{

                spyOn(GameBoard.prototype, 'resetBlockPosition');

                gameBoard.boardMesh = [
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 1, 1, 1, 1, 1, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0]  
                ];
                gameBoard.tetrinoBlock.shape = [
                    [1, 0, 0],
                    [1, 0, 0],
                    [1, 0, 0]
                ];
                gameBoard.tetrinoBlock.pos = {x:2, y:3};

                gameBoard.mergeBlockWithBoardMesh(gameBoard.tetrinoBlock.shape, gameBoard.tetrinoBlock.pos);
                gameBoard.dropBlock();

                expect(gameBoard.tetrinoBlock.pos.y).toBe(3);



                gameBoard.boardMesh = [
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0]  
                ];
                gameBoard.tetrinoBlock.shape = [
                    [1, 0, 0],
                    [1, 0, 0],
                    [1, 0, 0]
                ];
                gameBoard.tetrinoBlock.pos = {x:3, y:8};

                gameBoard.mergeBlockWithBoardMesh(gameBoard.tetrinoBlock.shape, gameBoard.tetrinoBlock.pos);
                gameBoard.dropBlock();

                expect(gameBoard.tetrinoBlock.pos.y).toBe(8);


                gameBoard.tetrinoBlock.pos = {x:3, y:9};

                gameBoard.mergeBlockWithBoardMesh(gameBoard.tetrinoBlock.shape, gameBoard.tetrinoBlock.pos);
                gameBoard.dropBlock();

                expect(gameBoard.tetrinoBlock.pos.y).toBe(9);

            });


            it('should save tetrino block on game board', ()=>{

                spyOn(GameBoard.prototype, 'mergeBlockWithBoardMesh');
                spyOn(GameBoard.prototype, 'checkBlocksCollision').and.returnValue(true);

                gameBoard.tetrinoBlock.pos = {x:3, y:2};

                gameBoard.dropBlock();

                expect(GameBoard.prototype.mergeBlockWithBoardMesh).toHaveBeenCalled();
            });


            it('should check line filling for game score', ()=>{

                spyOn(GameBoard.prototype, 'mergeBlockWithBoardMesh');
                spyOn(GameBoard.prototype, 'checkBlocksCollision').and.returnValue(true);
                spyOn(GameBoard.prototype, 'checkSurfaceLineFilling').and.returnValue(true);

                gameBoard.tetrinoBlock.pos = {x:0, y:0};
                gameBoard.dropBlock();

                expect(GameBoard.prototype.checkSurfaceLineFilling).toHaveBeenCalled();
                expect(fakeController.addScore).toHaveBeenCalled();
                expect(fakeController.updateScoreInDOM).toHaveBeenCalled();
            });


            it('should start next game step', ()=>{

                spyOn(GameBoard.prototype, 'mergeBlockWithBoardMesh');
                spyOn(GameBoard.prototype, 'checkBlocksCollision').and.returnValue(true);
                spyOn(GameBoard.prototype, 'resetBlockPosition');

                gameBoard.tetrinoBlock.pos = {x:1, y:2};
                gameBoard.dropBlock();

                expect(GameBoard.prototype.resetBlockPosition).toHaveBeenCalled()
            });


        });




    });

    describe('drawOnSurface', ()=>{


        it('should clear game board surface', ()=>{

            spyOn(GameBoard.prototype, 'clearSurface');

            gameBoard.drawOnSurface();
            expect(GameBoard.prototype.clearSurface).toHaveBeenCalled();
        });


        it('should draw game board mesh on surface', ()=>{

            spyOn(GameBoard.prototype, 'drawShape');

            gameBoard.createMesh();

            gameBoard.drawOnSurface();
            expect(GameBoard.prototype.drawShape).toHaveBeenCalledWith(gameBoard.boardMesh, {x:0, y:0});
        });


        it('should draw tetrino block on game surface', ()=>{

            spyOn(GameBoard.prototype, 'drawShape');

            gameBoard.tetrinoBlock.shape = [
                [1, 0, 0],
                [1, 0, 0],
                [1, 0, 0]
            ];
            gameBoard.tetrinoBlock.pos = {x:10, y:5};

            gameBoard.drawOnSurface();
            expect(GameBoard.prototype.drawShape).toHaveBeenCalledWith(gameBoard.tetrinoBlock.shape, gameBoard.tetrinoBlock.pos);

        });


    });


});


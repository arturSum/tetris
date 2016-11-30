import GameStatus from 'Src/core/GameStatus'


describe('GameStatus', ()=>{

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

	var gameStatus, config;

	beforeEach(()=>{

		document.body.insertAdjacentHTML( 'afterbegin', getGameHtmStructure('gameBox'));

		config = {

			gameStep : 20,
			nextShapeCanvasDOMHandle : document.querySelector('#gameBox .nextShape'),
			gameScoreDOMHandle : document.querySelector('#gameBox .score'),
			startButtonDOMHandle : document.querySelector('#gameBox .startButton')

		};

		gameStatus = new GameStatus(config);
	});

	afterEach(()=>{

		document.body.innerHTML = '';
		gameStatus = null;
	});

	describe('createNextTetrinoSurface', ()=>{

		it('should create info surface about next tetrino block', ()=>{

			var ctx = config.nextShapeCanvasDOMHandle.getContext('2d');

			gameStatus.createNextTetrinoSurface();

			var surfaceData = ctx.getImageData(0, 0, gameStatus.nextTetrinoSurfaceWidth, gameStatus.nextTetrinoSurfaceHeight).data;

			expect(surfaceData.indexOf(0)).toBe(-1);

			//white surface
			expect([
				surfaceData[0],
				surfaceData[1],
				surfaceData[2],
				surfaceData[3]
			]).toEqual([0xFF, 0xFF, 0xFF, 0xFF]);

		});


	});

	describe('updateScoreNode', ()=>{

		it('should change score node content', ()=>{

			config.gameScoreDOMHandle.innerHTML = '1';

			gameStatus.updateScoreNode('2');

			expect(config.gameScoreDOMHandle.innerHTML).not.toContain('1');
			expect(config.gameScoreDOMHandle.innerHTML).toContain('2');

		});


	});

	describe('setStartButtonDisabledStatus', ()=>{

		it('should set disabled property of start game button', ()=>{

			gameStatus.setStartButtonDisabledStatus(true);
			expect(config.startButtonDOMHandle.disabled).toBeTruthy();

			gameStatus.setStartButtonDisabledStatus(false);
			expect(config.startButtonDOMHandle.disabled).toBeFalsy();

			gameStatus.setStartButtonDisabledStatus();
			expect(config.startButtonDOMHandle.disabled).toBeFalsy();

		});


	});

	describe('drawNextTetrino', ()=>{

		var nextTetrinoShape;

		beforeEach(()=>{

			nextTetrinoShape = [
				[1, 0, 0],
				[1, 0, 0],
				[1, 0, 0]
			];

		});


		it('should clear next tetrino board', ()=>{

			spyOn(GameStatus.prototype, 'clearNextTetrinoSurface');

			gameStatus.drawNextTetrino(nextTetrinoShape);

			expect(GameStatus.prototype.clearNextTetrinoSurface).toHaveBeenCalled();

		});


		it('should draw next tetrino shape', ()=>{

			spyOn(GameStatus.prototype, 'clearNextTetrinoSurface');
			spyOn(GameStatus.prototype, 'drawBlock');

			gameStatus.drawNextTetrino(nextTetrinoShape);

			expect(GameStatus.prototype.drawBlock).toHaveBeenCalledWith(nextTetrinoShape);

		});



	});

	describe('drawBlock', ()=>{

		var tetrinoShape = [
			[1, 0, 0],
			[1, 0, 0],
			[1, 1, 0]
		],
		ctx;

		beforeEach(()=>{
			ctx = config.nextShapeCanvasDOMHandle.getContext('2d');
		});


		it('should draw tetrino block on next tetrion surface', ()=>{

			//red
			var expectedColor = [255, 0, 0, 255],
				areExpectedColorFound = false;


			var checkExistingPixelInImageData = (ctxData, colorSearchRep)=>{

				var colorInfoData = [],
					ctxDataQnt = ctxData.length;

				for(var i=0; i<ctxDataQnt; i += 4){

					colorInfoData = [
						ctxData[i],
						ctxData[i+1],
						ctxData[i+2],
						ctxData[i+3]
					];



					if(colorInfoData.toString() == colorSearchRep.toString()){
						return true;
					}

				}

				return false;
			};

			gameStatus.createNextTetrinoSurface();


			//------------ when game start ----------------------

			//check red
			areExpectedColorFound = checkExistingPixelInImageData(
				ctx.getImageData(0, 0, gameStatus.nextTetrinoSurfaceWidth, gameStatus.nextTetrinoSurfaceHeight).data,
				expectedColor
			);
			expect(areExpectedColorFound).toBeFalsy();


			//---------------------------------


			//check white
			expectedColor = [255, 255, 255, 255];

			areExpectedColorFound = checkExistingPixelInImageData(
				ctx.getImageData(0, 0, gameStatus.nextTetrinoSurfaceWidth, gameStatus.nextTetrinoSurfaceHeight).data,
				expectedColor
			);
			expect(areExpectedColorFound).toBeTruthy();


			//------------- when draw block -------------------------


			//check red
			gameStatus.drawBlock(tetrinoShape);

			expectedColor = [255, 0, 0, 255];

			areExpectedColorFound = checkExistingPixelInImageData(
				ctx.getImageData(0, 0, gameStatus.nextTetrinoSurfaceWidth, gameStatus.nextTetrinoSurfaceHeight).data,
				expectedColor
			);
			expect(areExpectedColorFound).toBeTruthy();

		});


		it('should set next tetrino block on correct position in surface', ()=>{

			//in pixel
			var expectedPosX = Math.floor( ((gameStatus.nextTetrinoSurfaceWidth/2) - (tetrinoShape.length/2)) / gameStatus.gameStep ),
				expectedPosY = 0,
				expectedColor = [255, 0, 0, 255];

			gameStatus.createNextTetrinoSurface();
			gameStatus.drawBlock(tetrinoShape);

			var ctxData = ctx.getImageData(0, 0, gameStatus.nextTetrinoSurfaceWidth, gameStatus.nextTetrinoSurfaceHeight).data;


			//match: expect red pixel*gameStep(przesuniecie)
			expect(
				[
					ctxData[((expectedPosY*gameStatus.nextTetrinoSurfaceWidth) + expectedPosX)*gameStatus.gameStep*4],
					ctxData[(((expectedPosY*gameStatus.nextTetrinoSurfaceWidth) + expectedPosX)*gameStatus.gameStep*4) + 1],
					ctxData[(((expectedPosY*gameStatus.nextTetrinoSurfaceWidth) + expectedPosX)*gameStatus.gameStep*4) + 2],
					ctxData[(((expectedPosY*gameStatus.nextTetrinoSurfaceWidth) + expectedPosX)*gameStatus.gameStep*4) + 3]

				]
			).toEqual(expectedColor);


			//not mach: expect white / XPos-1;
			expect(
				[
					ctxData[((expectedPosY*gameStatus.nextTetrinoSurfaceWidth) + expectedPosX-1)*gameStatus.gameStep*4],
					ctxData[(((expectedPosY*gameStatus.nextTetrinoSurfaceWidth) + expectedPosX-1)*gameStatus.gameStep*4) + 1],
					ctxData[(((expectedPosY*gameStatus.nextTetrinoSurfaceWidth) + expectedPosX-1)*gameStatus.gameStep*4) + 2],
					ctxData[(((expectedPosY*gameStatus.nextTetrinoSurfaceWidth) + expectedPosX-1)*gameStatus.gameStep*4) + 3]

				]
			).toEqual([255, 255, 255, 255]);



			//not mach: expect white / XPos+1;
			expect(
				[
					ctxData[((expectedPosY*gameStatus.nextTetrinoSurfaceWidth) + expectedPosX+1)*gameStatus.gameStep*4],
					ctxData[(((expectedPosY*gameStatus.nextTetrinoSurfaceWidth) + expectedPosX+1)*gameStatus.gameStep*4) + 1],
					ctxData[(((expectedPosY*gameStatus.nextTetrinoSurfaceWidth) + expectedPosX+1)*gameStatus.gameStep*4) + 2],
					ctxData[(((expectedPosY*gameStatus.nextTetrinoSurfaceWidth) + expectedPosX+1)*gameStatus.gameStep*4) + 3]

				]
			).toEqual([255, 255, 255, 255]);


		});


	});


});
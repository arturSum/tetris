
var requestId;

var posX = 50,
    posY = gameBordHeight/2;

var vx = 5,
    vy = -3;

var gravity = 1;

const drawX = ()=>{

    //erase
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, gameBoardWidth, gameBordHeight);


    //fill
    posX += vx;
    posY += vy;

    //vx *= 0.97;
    //vy *= 0.97;

    if(posY > 600){
        posY = 600;
        vy *= -0.5;
        vx *= 0.75;
    }

    vy += gravity;

    ctx.fillStyle = 'white';
    ctx.fillRect(posX, posY, 10, 10);
    requestId = requestAnimationFrame(drawX);


};



class Particle{

    constructor(ctx, canvasNode){

        this.gameBoardNode = canvasNode;

        this.ctx = ctx;
        this.x = canvasNode.width/2;
        this.y = canvasNode.height/2;

        this.gravity = 0.2;

        this.vx = Math.random()*10 -5;
        this.vy = Math.random()*10 -5;

        particleIndex++;
        particles[particleIndex] = this;

        this.id = particleIndex;

        this.life = 0;
        this.maxLife = Math.random()*100;

        this.color = `hsla(${Math.floor(Math.random()*360)}, 100%, 50%, 0.2`;

    }

    clear(){

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.gameBoardNode.width, canvasNode.height);
    }

    draw(){

        this.x += this.vx;
        this.y += this.vy;


        /*

         if(this.y > 600){
         this.y = 600;
         this.vy *= -0.5;
         this.vx *=0.75;
         }



         */

        if(Math.random() < 0.1){
            this.vx = Math.random()*10 -5;
            this.vy = Math.random()*10 -5;
        }


        //this.vy += this.gravity;


        this.life++;

        if(this.life > this.maxLife){
            delete particles[this.id];
        }



        //this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';


        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, 5, 5);

    }

}



let particles = {},
    particleIndex = 0,
    particleNum = 5;





var ptc = new Particle(ctx, canvasNode);

const draw = ()=>{

    ptc.clear();

    for(var x=1; x<particleNum; x++){
        new Particle(ctx, canvasNode);
    }

    for(var i in particles){
        if(particles.hasOwnProperty(i)){
            particles[i].draw();
        }
    }

    requestId = requestAnimationFrame(draw)
};







//##########################################################################################################################






const createGameBoard = (canvasNode)=>{
    var context = canvasNode.getContext('2d');

    context.fillStyle = 'black';
    context.fillRect(0, 0, gameBoardWidth, gameBordHeight);
    return context;
};


//--------- BLOCK FACTORY -----------



const blockFactory = (drawContext, shape) => ()=>{

    var [posX, posY] = [0, 0];

    shape.forEach((firstDimension)=>{

        firstDimension.forEach((value)=>{

            if(value){
                drawContext.fillStyle = 'green';
                drawContext.fillRect(posX, posY, movingStep, movingStep);       //nie dziala jak nalezy
            }

            posX += movingStep;
        });

        posY += movingStep;
        posX = 0;
    });

};


const drawSingleBlock = (context, blockFactory, shapeStorage)=>{

    var shapeNbr = Math.floor(Math.random()*3); //z 7

    return blockFactory(context, shapeStorage[shapeNbr]);

};






const setupShapeDrawFunction = (ctx, shape)=>{


    return (offsetX = 0, offsetY = 0)=>{

        var [posX, posY] = [0, 0];

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, gameBoardWidth, gameBoardWidth);

        shape.forEach((firstDimension)=>{

            firstDimension.forEach((value)=>{

                if(value){
                    ctx.fillStyle = 'green';
                    ctx.fillRect(posX+offsetX, posY+offsetY, movingStep, movingStep);       //nie dziala jak nalezy
                }

                posX += movingStep;
            });

            posY += movingStep;
            posX = 0;
        });

    };


};








//############################################

var O_Tetrino = [

        [1, 1],
        [1, 1]
    ],
    T_Tetrino = [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],
    I_Tetrino = [
        [1],
        [1],
        [1],
        [1]
    ],
    L_Tetrino = [
        [1, 0],
        [1, 0],
        [1, 1]
    ];


var shapeStorage = [
    O_Tetrino,
    T_Tetrino,
    I_Tetrino,
    L_Tetrino
];

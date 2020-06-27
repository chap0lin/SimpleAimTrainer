import Game from './modules/Game.js'
let canv = document.getElementById('myCanvas');
let ctx = canv.getContext("2d");
console.log('main.js')
const game = new Game(ctx, canv)
setInterval(run, 1000/30)
//canv.requestPointerLock()
function run(){
    game.update()
}
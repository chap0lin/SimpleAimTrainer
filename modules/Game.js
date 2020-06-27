import Component from './Component.js'
export default class Game extends Component{
    constructor(ctx, canv){
        super();
        this.state = {
            mouseX: 0,
            mouseY:0,
            sensibility: 1,
            dotsOnScreen: 0,
            dots: [],
            middle: true,
            shotSwap: false,
            showMenu: true,
            countdown: 60,
            showStats: false,
            precision: 0,
            shotsfired: 0,
            targetsHitted: 0,
        }
        console.log('Game Created')
        this.ctx = ctx
        this.canv = canv
        this.loadAssets()
        //this.canv.requestPointerLock = this.canv.requestPointerLock || this.canv.mozRequestPointerLock;
        //document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

        console.log(`Dimensions x:${this.canv.width}, y:${this.canv.height}`)
        this.canv.addEventListener("mousemove",this.mouseMove.bind(this))
        this.canv.addEventListener("mousedown", this.mouseClick.bind(this))
        document.addEventListener("keydown",this.keypush.bind(this))
    }
    keypush(evt){
        console.log(evt.keyCode)
        if(evt.keyCode == 27){//ESC
            this.setState({showMenu:true, showStats:false})
        }
    }
    mouseMove(evt) {
        console.clear()
        console.log(`Click: ${evt.offsetX},${evt.offsetY}`)
        var mouseX = evt.offsetX*this.state.sensibility;
        var mouseY = evt.offsetY*this.state.sensibility;
        mouseX = mouseX<=1280?mouseX:1280;
        mouseY = mouseY<=720?mouseY:720;
        this.setState({mouseX, mouseY})
    }
    mouseClick(evy){
        console.log('Clicou')
        if(this.state.showMenu){
            this.clickMenu(this.state.mouseX, this.state.mouseY)
        }
        this.shot(this.state.mouseX, this.state.mouseY)
    }
    shot(x, y){
        console.log(`Shot: ${x},${y}`)
        var {shotsfired, targetsHitted} = this.state
        shotsfired++
        this.playShotSound()
        var aux = this.state.dots
        var dots = []
        aux.map((dot)=>{
            if(x>=dot.x && x<=dot.x+32 && y>=dot.y && y<=dot.y+32){//square -> switch to circle after
                console.log('Hit!')
                targetsHitted++
            }else{
                console.log('Miss!')
                dots.push(dot)
            }
        })
        this.setState({dots, dotsOnScreen:dots.length, shotsfired, targetsHitted})
    }
    playShotSound(){
        if(this.state.shotSwap){
            this.state.shotSound.play()
        }else{
            this.state.shotSound2.play()
        }
        this.setState({shotSwap:!this.state.shotSwap})
    }
    loadAssets(){
        var background = new Image(3840,2466)
        background.src = "assets/background3.jpg"
        var aim = new Image(64,64)
        aim.src = "assets/aim.png"
        var target = new Image(32,32)
        target.src = "assets/target.png"
        var shotSound = new Audio('assets/shot.mp3')
        var shotSound2 = new Audio('assets/shot.mp3')
        this.setState({backgroundImage: background, aim, target, shotSound, shotSound2})
    }
    update(){
        if(this.state.showMenu){
            this.renderMenu()
            this.renderMouse()
        }else if(this.state.showStats){
            this.renderStats()
        }else{
            var {countdown} = this.state
            countdown-=1/30
            if(countdown<=0){
                //document.removeEventListener("mousemove", this.mouseMove.bind(this), false);
                this.setState({showStats:true})
            }
            this.setState({countdown})
            this.renderGame()
        }
    }
    renderStats(){
        this.ctx.drawImage(this.state.backgroundImage,640,360, this.canv.width, this.canv.height,0,0, this.canv.width, this.canv.height )
        this.ctx.fillStyle = "rgba(0,0,0,0.4)"
        this.ctx.fillRect(0,0,this.canv.width,this.canv.height)
        this.ctx.fillStyle = "white"
        this.ctx.font = "40px Calibri"
        const precision = 100*this.state.targetsHitted/this.state.shotsfired;
        this.ctx.fillText(`Precision: ${precision.toFixed(2)}%`, 410, 240)
        const tth = 60000/this.state.targetsHitted;

        this.ctx.fillText(`Time on each shot: ${Math.floor(tth)}ms`, 410, 340)
        
        this.ctx.fillText('Press ESC to return to menu', 410, 480)
    }
    renderMenu(){
        this.ctx.drawImage(this.state.backgroundImage,640,360, this.canv.width, this.canv.height,0,0, this.canv.width, this.canv.height )
        this.ctx.fillStyle = "rgba(0,0,0,0.4)"
        this.ctx.fillRect(0,0,this.canv.width,this.canv.height)
        this.ctx.fillStyle = "white"
        this.ctx.font = "60px Calibri"
        this.ctx.fillText('Simple Aim Trainer', 410, 240)
        this.ctx.fillText('PLAY', 580, 380)

    }
    renderMouse(){
        this.ctx.drawImage(this.state.aim, this.state.mouseX-16,this.state.mouseY-16, 32,32)
    }
    clickMenu(x, y){
        if(x>=580 && x<=700 && y>=340 && y<=380){
            this.startGame()
        }
    }
    startGame(){
        //this.canv.requestPointerLock()
        //document.addEventListener("mousemove",this.mouseMove.bind(this))
        this.setState({showMenu:false, countdown:60, shotsfired:0, precision:0, targetsHitted:0})
    }
    renderGame(){
        this.ctx.drawImage(this.state.backgroundImage,this.state.mouseX,this.state.mouseY, this.canv.width, this.canv.height,0,0, this.canv.width, this.canv.height )
        this.renderDots()
        this.ctx.drawImage(this.state.aim, 624,344, 32,32)
        this.ctx.fillStyle="white"
        const timer = `${Math.floor(this.state.countdown)}`
        this.ctx.fillText(timer, 600, 100)
    }
    renderDots(){
        if(this.state.dotsOnScreen == 0){
            this.generateDot()
        }
        const {dots} = this.state;
        dots.map((dot => {
            this.ctx.drawImage(this.state.target, dot.x+640-this.state.mouseX,dot.y+360-this.state.mouseY, 32,32)
        }))
    }
    generateDot(){
        var {middle} = this.state
        if(this.state.middle){
            var xposition = 624;
            var yposition = 344;
            middle=false
        }else{
            var xposition = Math.floor(Math.random()*1216)+32;
            var yposition = Math.floor(Math.random()*656)+32;
            middle=true
        }
        var {dots} = this.state;
        dots.push({x:xposition, y:yposition});
        var {dotsOnScreen} = this.state;
        dotsOnScreen++;
        this.setState({dots, dotsOnScreen, middle});
    }
}

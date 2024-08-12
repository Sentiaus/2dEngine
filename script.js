const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
let friction = 0.1

class Vector{
    constructor(x, y){
        this.x = x
        this.y = y
    }

    add(v){
        return new Vector(this.x + v.x, this.y + v.y)
    }

    subtract(v){
        return new Vector(this.x - v.x, this.y - v.y)
    }

    magnitude(){
        return Math.sqrt(this.x**2 + this.y**2)
    }

    mult(val){
        return new Vector(this.x * val, this.y * val)
    }

    unitVector(){
        if(this.magnitude()===0){
            return new Vector(0,0)
        }
        let c = this.magnitude()
        return new Vector(this.x/this.magnitude(), this.y/this.magnitude())
    }

    normal(){
        // Returns normal normalized vector
        return new Vector(this.y * -1, this.x).unitVector()
    }

    static dot(v1,v2){
        if(!(v1 instanceof Vector && v2 instanceof Vector)){
            throw new Error("Only vectors may have their dot products calculated")
        }
        return (v1.x*v2.x + v1.y*v2.y)
    }

    drawVector(start_x, start_y, n, color){
        //draw path from start to end of vector multiplied by n
        ctx.beginPath()
        ctx.moveTo(start_x, start_y)
        ctx.lineTo(start_x + this.x*n, start_y + this.y*n)
        ctx.strokeStyle = color
        ctx.stroke()
        ctx.closePath()
    }
}

let keys = {
    LEFT: false,
    RIGHT: false,
    UP: false,
    DOWN: false,
    W: false,
    A: false,
    S: false,
    D: false
}

class Balls{
    constructor(){
        this.stack = []
    }

    addBall = (ball) =>{
        if(!(ball instanceof Ball)){
            throw new Error("Only balls may be added to the class")
        }
        this.stack.push(ball)
    }

    setAllBallColor = (color) =>{
        this.stack.forEach(ball => {
            ball.fillColor=color    
        });
    }

    drawBalls = () => {
        //draw all balls currently in stack, and assign player movement to any balls that allow it
        
        this.stack.forEach((ball, index) => {
            ball.drawBall();
            if(ball.player){
                keyControl(ball)
                console.log(`${ball} can move`)
            }
            //draw velocity and acceleration directions
            ball.drawPath();
            //O(n^2) inefficient
            // Gonna try to find a way to make this more efficient
            for(let i = index+1; i<this.stack.length; i++){
                Balls.checkCollision(this.stack[index], this.stack[i])
            }

        });
    }
    static checkCollision = (b1,b2) => {
        console.log("Collision entered")
        // If the sum of the radii is greater than or equal to the distance between the centers.
        if(b1.r + b2.r >= b2.pos.subtract(b1.pos).magnitude()){
            Balls.penetrationDepth(b1,b2)
            return true
        }
        return false
    }

    static penetrationDepth = (b1,b2) =>{
        let dist = b1.pos.subtract(b2.pos)
        let penDepth = b1.r + b2.r - dist.magnitude()
        let penRes = dist.unitVector().mult(penDepth/2)
        b1.pos = b1.pos.add(penRes)
        b2.pos = b2.pos.add(penRes.mult(-1))
    }
    
}



/*
Ball class that creates and can draw balls.
*/
class Ball{
    constructor(x, y, r, strokeColor="black", fill=true, fillColor="red", ballsClass = null, player = false, acceleration=1){
        this.pos = new Vector(x,y)
        this.r = r;
        this.strokeColor = strokeColor;
        this.fill = fill;
        this.fillColor = fillColor;
        this.vl = new Vector(0,0)
        this.acc = new Vector(0,0)
        this.acceleration = acceleration
        this.player = player
        if(ballsClass){
            ballsClass.addBall(this)
        }
    }
    //Uses arc, current position (x,y) and radius to draw a circle (other attributes such as the outline and fillColor can be adjusted as well)
    drawBall = () =>{
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI*2);
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
        this.fill && (ctx.fillStyle = this.fillColor, ctx.fill());
        ctx.closePath()
    }

    drawPath = () =>{
        //Draw path from center of ball to direction of acceleration
        this.acc.unitVector().drawVector(this.pos.x, this.pos.y, 50, "green")
        //Draw path from center of ball to direction of velocity
        // this.vl.drawVector(this.x, this.y, 10, "blue")
        this.vl.drawVector(this.pos.x, this.pos.y, this.r, "blue")
        this.acc.normal().drawVector(this.pos.x, this.pos.y, 50, "red")
        
        if(this.player){
            let corner = {x:700, y:700}
            ctx.beginPath();
            ctx.arc(corner.x, corner.y, this.r, 0, Math.PI*2);
            ctx.stroke();
            ctx.closePath();
            this.vl.drawVector(corner.x, corner.y, this.r, "blue")
            this.acc.unitVector().drawVector(corner.x, corner.y, this.r, "green")
        }
        
    }
}

keyControl = (b) => {
    
    canvas.addEventListener('keydown', function(e){
        
        if (e.key === "ArrowLeft") {
            keys.LEFT = true;
        }
        if (e.key === "ArrowRight") {
            keys.RIGHT = true;
        }
        if (e.key === "ArrowUp") {
            keys.UP = true;
        }
        if (e.key === "ArrowDown") {
            keys.DOWN = true;
        }
        if (e.key === "w") {
            keys.W = true;
        }
        if (e.key === "a") {
            keys.A = true;
        }
        if (e.key === "s") {
            keys.S = true;
        }
        if (e.key === "d") {
            keys.D = true;
    }});

    canvas.addEventListener('keyup', function(e){
        if (e.key === "ArrowLeft") {
            keys.LEFT = false;
        }
        if (e.key === "ArrowRight") {
            keys.RIGHT = false;
        }
        if (e.key === "ArrowUp") {
            keys.UP = false;
        }
        if (e.key === "ArrowDown") {
            keys.DOWN = false;
        }
        if (e.key === "w") {
            keys.W = false;
        }
        if (e.key === "a") {
            keys.A = false;
        }
        if (e.key === "s") {
            keys.S = false;
        }
        if (e.key === "d") {
            keys.D = false;
        }
    });

    if(keys.LEFT){
        b.acc.x = -b.acceleration;
    }
    if(keys.RIGHT){
        b.acc.x = b.acceleration;
    }
    if(keys.DOWN){
        b.acc.y = b.acceleration;
    }
    if(keys.UP){
        b.acc.y = -b.acceleration;
    }

    if(keys.W){
        b.r++
    }
    if(keys.S){
        if(b.r > 0){
            b.r--
        }  
    }
    if(keys.A){
        b.acceleration -= 0.001
    }
    if(keys.D){
        b.acceleration += 0.001
    }

    if(!keys.UP && !keys.DOWN){
        b.acc.y = 0
    }
    if(!keys.LEFT && !keys.RIGHT){
        b.acc.x = 0
    }


    // if(keys.A){
        
    // }
    // if(keys.D){

    // }

    //acceleration values added to the velocity components
    b.acc = b.acc.unitVector().mult(b.acceleration);
    b.vl = b.vl.add(b.acc)
    //velocity gets multiplied by a number between 0 and 1
    b.vl = b.vl.mult(1-friction)
    //velocity values added to the current x, y position
    b.pos = b.pos.add(b.vl) 
    

};

class Information{
    constructor(){
        this.score = document.getElementById("speed");
        this.info = document.getElementById("info")
    }
    // Will change to static class later.
    displayBallInfo = (b) =>{
        this.score.textContent = `Position: ${round(b.pos.x,2)}, ${round(b.pos.y,2)}, Acceleration Value: ${round(b.acceleration, 3)}, Size: ${b.r*2}`
    }

    displayRules = () =>{
        this.info.textContent = "Arrow Keys to move, W to grow, S to shrink, A to decrease acceleration, D to increase acceleration"
    }
}



round = (number, precision = 0) => {
    let num = number * 10**precision
    return Math.round(num) / 10**precision
}

main = () => {
    
}

let myBalls = new Balls()
let ball1 = new Ball(40, 40, 20, undefined, true, "blue",myBalls,true);
let ball2 = new Ball(300,400, 50, undefined, true, "black", myBalls)
let ball3 = new Ball(300,400, 50, undefined, true, "black", myBalls)
let ball4 = new Ball(300,400, 50, undefined, true, "black", myBalls)
let ball5 = new Ball(300,400, 50, undefined, true, "black", myBalls)
let ball6 = new Ball(300,400, 50, undefined, true, "black", myBalls)


const myInfo = new Information() 
myInfo.displayRules()
mainLoop = () => {
    ctx.clearRect(0,0, canvas.clientWidth, canvas.clientHeight)
    
    myBalls.drawBalls()
    myInfo.displayBallInfo(ball2)
    requestAnimationFrame(mainLoop);
    
}

console.log(ball1)

requestAnimationFrame(mainLoop);

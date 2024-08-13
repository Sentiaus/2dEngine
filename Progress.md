# Progress

I'm starting this kinda late, so starting right when I had a few questions, on how could optimize the physics engine more.

## How can I optimize the collision detection?

So as my question states, I have a collision detection function in my `Balls Class`

The current code I have and that is being checked, is simply checking collision of every ball, every frame.

```
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
```

I have done some research so far, but I will likely leave optimization of this to the end.

### Research
After doing some research, reading wikipedia, and realizing that I am not good enough at math currently to handle 3D spaces, I came across a method that works well for 2D spaces: <strong>Uniform Grids</strong>.

I can essentially set up a grid (adjustable?), such that we check only the cells that objects are in, and see if the objects share cells.

Passive and Active cells can also optimize this.

Shoutout to the devs over at [GameDev](https://gamedev.stackexchange.com/questions/18261/how-can-i-implement-fast-accurate-2d-collision-detection)
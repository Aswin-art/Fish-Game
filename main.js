/**@type {HTMLCanvasElement} */

const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let gameover = false
let gameframe = 0
let score = 0

class Enemy{
    constructor(){
        this.image = new Image()
        this.image.src = './assets/images/enemy1.png'
        this.frame = 0
        this.frameX = 0
        this.frameY = 0
        this.x = canvas.width + 200
        this.y = Math.random() * (canvas.height - 100) + 50
        this.spriteWidth = 418
        this.spriteHeight = 397
        this.radius = 60
        this.speed = Math.random() * 2 + 2
        this.swimSpeed = Math.floor(Math.random() * 7 + 3)
    }

    draw(ctx){
        // Draw Circle
        // ctx.beginPath()
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        // ctx.fillStyle = 'red'
        // ctx.fill()
        // ctx.closePath()

        ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 70, this.y - 80, this.spriteWidth / 2.5, this.spriteHeight / 2.5)
    }

    update(){
        if(gameframe % this.swimSpeed == 0){
            if(this.frameX < 3){
                this.frameX++
            }else{
                this.frameX = 0
            }
        }
        
        this.x -= this.speed
    }
}

class Fish{
    constructor(game){
        this.game = game
        this.image = new Image()
        this.image.src = './assets/images/fish-swim-left.png'
        this.x = canvas.width
        this.y = canvas.height / 2
        this.radius = 50
        this.angle = 0
        this.frameX = 0
        this.frameY = 0
        this.frame = 0
        this.spriteWidth = 498
        this.spriteHeight = 327

        this.fishLeft = new Image()
        this.fishLeft.src = './assets/images/fish-swim-left.png'
        this.fishRight = new Image()
        this.fishRight.src = './assets/images/fish-swim-right.png'
    }

    draw(ctx){
        // Draw Line
        // if(this.game.event.mouse.click){
        //     ctx.lineWidth = .2
        //     ctx.beginPath()
        //     ctx.moveTo(this.x, this.y)
        //     ctx.lineTo(this.game.event.mouse.x, this.game.event.mouse.y)
        //     ctx.stroke()
        // }

        // Draw Circle
        // ctx.fillStyle = 'red'
        // ctx.beginPath()
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        // ctx.fill()
        // ctx.closePath()

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        if(this.x >= this.game.event.mouse.x){
            ctx.drawImage(this.fishLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 50, this.spriteWidth / 3.3, this.spriteHeight / 3.3)
        }else{
            ctx.drawImage(this.fishRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 50, this.spriteWidth / 3.3, this.spriteHeight / 3.3)
        }
        ctx.restore()
    }

    update(){
        if(gameframe % 10 == 0){
            if(this.frameX < 3){
                this.frameX++
            }else{
                this.frameX = 0
            }
        }
        const dx = this.x - this.game.event.mouse.x
        const dy = this.y - this.game.event.mouse.y
        // Rotate angle
        let theta = Math.atan2(dy, dx)
        this.angle = theta
        if(this.game.event.mouse.x != this.x){
            this.x -= dx / 30
        }

        if(this.game.event.mouse.y != this.y){
            this.y -= dy / 30
        }
    }
}

class Bubble{
    constructor(){
        this.image = new Image()
        this.image.src = './assets/images/bubble_pop.png'
        this.frameX = 0
        this.frameY = 0
        this.x = Math.random() * (canvas.width - 100) + 50
        this.y = canvas.height + 100
        this.speed = Math.random() * 5 + 1
        this.radius = 50
        this.spriteWidth = 512
        this.spriteHeight = 512
    }

    draw(ctx){
        // Draw Circle
        // ctx.beginPath()
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        // ctx.fillStyle = 'blue'
        // ctx.fill()
        // ctx.closePath()

        ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 70, this.y - 70, this.spriteWidth / 3.5, this.spriteHeight / 3.5)
    }

    update(){
        this.y -= this.speed
    }
}

class Background{
    constructor(){
        this.image = new Image()
        this.image.src = './assets/images/background1.png'
        this.x1 = 0
        this.x2 = canvas.width
        this.y = 0
        this.width = canvas.width
        this.height = canvas.height
    }

    draw(ctx){
        ctx.drawImage(this.image, this.x1, this.y, this.width, this.height)
        ctx.drawImage(this.image, this.x2, this.y, this.width, this.height)
    }

    update(){
        this.x1--
        if(this.x1 < -this.width){
            this.x1 = this.width
        }

        this.x2--
        if(this.x2 < -this.width){
            this.x2 = this.width
        }
    }
}

class EventHandler{
    constructor(){
        // Mouse Interactivity
        this.mouse = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            click: false
        }

        this.canvasPosition = canvas.getBoundingClientRect()

        document.addEventListener('mousedown', (e) => {
            this.mouse.x = e.x - this.canvasPosition.left
            this.mouse.y = e.y - this.canvasPosition.top
            this.mouse.click = true
        })

        document.addEventListener('mouseup', (e) => {
            this.mouse.click = false
        })

        document.addEventListener('resize', (e) => {
            this.canvasPosition = canvas.getBoundingClientRect()
        })
    }
}

class Game{
    constructor(){
        this.reset()
    }

    reset(){
        // Declare bubble
        this.bubbles = []
        //Declare enemy
        this.enemies = []
        // Declare fish
        this.fish = new Fish(this)
        // Declare event handler
        this.event = new EventHandler()
        // Declare background
        this.background = new Background()
        // Declare score
        this.score = 0

        this.objects = [this.background, this.fish]
    }

    circleCollision(object1, object2){
        const dx = object1.x - object2.x
        const dy = object1.y - object2.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if(distance < object1.radius + object2.radius){
            return true
        }else{
            return false
        }
    }

    spawnBubbles(){
        this.bubbles.push(new Bubble())
    }

    spawnEnemy(){
        this.enemies.push(new Enemy())
    }

    drawScore(){
        ctx.fillStyle = 'black'
        ctx.font = '40px Helvetica'
        ctx.fillText('Score: ' + this.score, 10, 40)
    }

    drawGameOver(){

    }

    draw(ctx){
        this.objects.forEach(object => object.draw(ctx))
        this.enemies.forEach(enemy => enemy.draw(ctx))
        this.bubbles.forEach(bubble => bubble.draw(ctx))

        this.drawScore()
    }

    update(deltatime) {
        this.objects.forEach(object => object.update())
        this.enemies.forEach(enemy => enemy.update())
        this.bubbles.forEach(bubble => bubble.update())
        
        // Spawn Bubbles
        if(gameframe % 50 == 0){
            this.spawnBubbles()
        }

        // Spawn Enemies
        enemyInterval += deltatime
        if(enemyInterval > nextEnemy){
            this.spawnEnemy()
            console.log(this.enemies)
            enemyInterval = 0
        }

        // Remove Enemies
        this.enemies.forEach((enemy, index) => {
            if(enemy.x + enemy.width < 0){
                this.enemies.splice(index, 1)
            }
        })

        // Remove Bubbles
        this.bubbles.forEach((bubble, index) => {
            if(bubble.y < 0){
                this.bubbles.splice(index, 1)
            }
        })

        // Detect Collision With Enemy
        this.enemies.forEach(enemy => {
            if(this.circleCollision(this.fish, enemy)){
                gameover = true
            }
        })

        // Detect Collision With Bubble
        this.bubbles.forEach((bubble, index) => {
            if(this.circleCollision(this.fish, bubble)){
                
                if(gameframe % 10 == 0){
                    if(bubble.frameX < 3){
                        bubble.frameX++
                    }else{
                        bubble.frameY = 1
                    }
                }

                const audio1 = new Audio('./assets/sounds/bubbles-single1.wav')
                const audio2 = new Audio('./assets/sounds/Plop.ogg')
                audio1.play()
                audio2.play()
                this.bubbles.splice(index, 1)
                this.score++
            }
        })
    }
}

const game = new Game()

let lasttime = 0
let nextEnemy = 3000
let enemyInterval = 0

function animate(timestamp = 0){
    if(!gameover){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        let deltatime = timestamp - lasttime
        lasttime = timestamp
        game.update(deltatime)
        game.draw(ctx)

        gameframe++
        requestAnimationFrame(animate)
    }
}

animate()
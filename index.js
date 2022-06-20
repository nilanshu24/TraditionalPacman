const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const score = document.querySelector('#score')
const win = document.querySelector('#win')
// c.fillText("sxgfbfyjgc", 10, 50)
// c.font("30px Arial white")
canvas.width = innerWidth
canvas.height = innerHeight

class Boundary {
    static width = 40
    static height = 40
    constructor({ position, image }) {
        this.position = position
        this.width = 40
        this.height = 40
        this.image = image
    }

    boundaryLook() {
        // c.fillStyle = 'red'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        // c.stroke = 'blue'

        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

const board = [
    // ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
    // ['X', ' ', ' ', ' ', ' ', ' ', 'X'],
    // ['X', ' ', 'X', ' ', 'X', ' ', 'X'],
    // ['X', ' ', ' ', ' ', ' ', ' ', 'X'],
    // ['X', 'X', 'X', 'X', 'X', 'X', 'X']

    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', 'CB', 'CB', 'CB', 'CB', 'CB', 'CB', 'CB', '2'],
    ['X', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', '4', 'CT', 'CT', 'CT', 'CT', 'CT', 'CT', 'CL'],
    ['X', 'e', 'O', 'e', 'O', 'e', 'L', '-', '-', 'CB', 'R', 'e', 'L', '-', 'R', 'e', 'O', 'e', 'T', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'X'],
    ['X', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'X', 'p', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'X', 'e', '1', 'R', 'e', 'O', 'e', 'O', 'e', 'X'],
    ['X', 'e', 'T', 'e', '1', '2', 'e', 'O', 'e', 'B', 'e', 'T', 'e', 'L', 'R', 'e', 'T', 'e', 'X', 'e', 'B', 'e', 'e', 'e', 'e', 'e', 'e', 'X'],
    ['X', 'e', 'X', 'e', '4', 'CL', 'p', 'e', 'e', 'e', 'e', 'X', 'e', 'e', 'e', 'e', 'B', 'e', 'X', 'e', 'e', 'p', 'T', 'e', 'L', 'R', 'e', 'X'],
    ['X', 'e', 'X', 'e', 'e', 'B', 'e', 'O', 'e', '1', 'CB', 'CL', 'e', '1', '2', 'e', 'e', 'e', 'X', 'e', 'T', 'e', 'X', 'e', 'e', 'e', 'e', 'X'],
    ['X', 'p', '4', 'R', 'e', 'e', 'e', 'e', 'e', '4', 'CT', '3', 'e', '4', '3', 'e', 'L', '-', '3', 'e', 'B', 'e', 'B', 'e', 'L', 'R', 'e', 'X'],
    ['X', 'e', 'e', 'e', 'e', '1', 'CB', '2', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'p', 'X'],
    ['4', '-', '-', '-', '-', 'CT', 'CT', 'CT', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']

]

const keys = {
    w: { down: false },
    a: { down: false },
    s: { down: false },
    d: { down: false }
}

const boundaries = []

function replaceImg(src) {
    const image = new Image()
    image.src = src
    return image
}

class Pacman {
    constructor({ position, speed }) {
        this.position = position
        this.speed = speed
        this.size = 18
        this.radians = 0.75
        this.openRate = 0.1
        this.rotation = 0
    }

    playerCreate() {
        c.save()
        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y)
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.size, this.radians, Math.PI * 2 - this.radians)
        c.lineTo(this.position.x, this.position.y)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
        c.restore()
    }

    move() {
        this.playerCreate()
        this.position.x += this.speed.x
        this.position.y += this.speed.y
        if (this.radians < 0 || this.radians > 0.75)
            this.openRate = -this.openRate
        this.radians += this.openRate

    }
}

class Ghost {
    static speed1 = 4
    constructor({ position, speed, color = 'red' }) {
        this.position = position
        this.speed = speed
        this.size = 18
        this.color = color
        // this.image = image
        this.prevCols = []
        this.speed1 = 2
        this.scared = false
    }

    playerCreate() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2)
        c.fillStyle = this.scared ? 'blue' : this.color
        c.fill()
        c.closePath()
    }

    move() {
        this.playerCreate()
        this.position.x += this.speed.x
        this.position.y += this.speed.y
        // c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class Eatable {
    constructor({ position }) {
        this.position = position
        this.size = 3
    }

    playerCreate() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }
}
class Powerup {
    constructor({ position }) {
        this.position = position
        this.size = 10
    }

    playerCreate() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }
}
const powerUps = []
const eatables = []
const ghosts = [
    new Ghost({
        position: {
            x: Boundary.width * 6 + Boundary.width / 2,
            y: Boundary.height + Boundary.height / 2
        },
        speed: {
            x: Ghost.speed1,
            y: 0
        }
    }),
    new Ghost({
        position: {
            x: Boundary.width * 3 + Boundary.width / 2,
            y: Boundary.height * 7 + Boundary.height / 2
        },
        speed: {
            x: 0,
            y: Ghost.speed1
        },
        color: 'pink'
    }),
    new Ghost({
        position: {
            x: Boundary.width * 6 + Boundary.width / 2,
            y: Boundary.height * 4 + Boundary.height / 2
        },
        speed: {
            x: 0,
            y: Ghost.speed1
        },
        color: 'green'
    })
]
board.forEach((row, a) => {
    row.forEach((str, b) => {
        switch (str) {
            case '-':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: 40 * b,
                            y: 40 * a
                        },
                        image: replaceImg('./boardimg/pipeHorizontal.png')
                    })
                )
                break
            case 'X':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: 40 * b,
                            y: 40 * a
                        },
                        image: replaceImg('./boardimg/pipeVertical.png')
                    })
                )
                break

            case '1':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: 40 * b,
                            y: 40 * a
                        },
                        image: replaceImg('./boardimg/pipeCorner1.png')
                    })
                )
                break

            case '2':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: 40 * b,
                            y: 40 * a
                        },
                        image: replaceImg('./boardimg/pipeCorner2.png')
                    })
                )
                break

            case '3':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: 40 * b,
                            y: 40 * a
                        },
                        image: replaceImg('./boardimg/pipeCorner3.png')
                    })
                )
                break

            case '4':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: 40 * b,
                            y: 40 * a
                        },
                        image: replaceImg('./boardimg/pipeCorner4.png')
                    })
                )
                break
            case 'T':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: 40 * b,
                            y: 40 * a
                        },
                        image: replaceImg('./boardimg/capTop.png')
                    })
                )
                break
            case 'B':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: 40 * b,
                            y: 40 * a
                        },
                        image: replaceImg('./boardimg/capBottom.png')
                    })
                )
                break
            case 'L':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: 40 * b,
                            y: 40 * a
                        },
                        image: replaceImg('./boardimg/capLeft.png')
                    })
                )
                break
            case 'R':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: 40 * b,
                            y: 40 * a
                        },
                        image: replaceImg('./boardimg/capRight.png')
                    })
                )
                break
            case 'CB':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: 40 * b,
                            y: 40 * a
                        },
                        image: replaceImg('./boardimg/pipeConnectorBottom.png')
                    })
                )
                break
            case 'CT':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: 40 * b,
                            y: 40 * a
                        },
                        image: replaceImg('./boardimg/pipeConnectorTop.png')
                    })
                )
                break
            case 'CL':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: 40 * b,
                            y: 40 * a
                        },
                        image: replaceImg('./boardimg/pipeConnectorLeft.png')
                    })
                )
                break
            case 'CR':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: 40 * b,
                            y: 40 * a
                        },
                        image: replaceImg('./boardimg/pipeConnectorRight.png')
                    })
                )
                break
            case 'O':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: 40 * b,
                            y: 40 * a
                        },
                        image: replaceImg('./boardimg/block.png')
                    })
                )
                break

            case 'C':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: 40 * b,
                            y: 40 * a
                        },
                        image: replaceImg('./boardimg/pipeCross.png')
                    })
                )
                break
            case 'e':
                eatables.push(
                    new Eatable({
                        position: {
                            x: Boundary.width * b + Boundary.width / 2,
                            y: Boundary.height * a + Boundary.height / 2
                        }
                    })
                )
                break

            case 'p':
                powerUps.push(
                    new Powerup({
                        position: {
                            x: Boundary.width * b + Boundary.width / 2,
                            y: Boundary.height * a + Boundary.height / 2
                        }
                    })
                )
                break

        }
    })
})




const pacman = new Pacman({
    position: {
        x: Boundary.width + Boundary.width / 2, y: Boundary.height + Boundary.height / 2
    },
    speed: {
        x: 0, y: 0
    }
})
let prev = ''
let points = 0

function collision({
    circle,
    rectangle
}) {
    return (circle.position.y - circle.size + circle.speed.y <= rectangle.position.y + rectangle.height &&
        circle.position.x + circle.size + circle.speed.x >= rectangle.position.x &&
        circle.position.y + circle.size + circle.speed.y >= rectangle.position.y &&
        circle.position.x - circle.size + circle.speed.x <= rectangle.position.x + rectangle.width)

}

function animate() {
    animationId = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    if (keys.w.down && prev === 'w') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]

            if (collision({
                circle: {
                    ...pacman,
                    velocity: {
                        x: 0,
                        y: -3
                    }
                },
                rectangle: boundary
            })
            ) {
                pacman.speed.y = 0
                break
            }
            else {
                pacman.speed.y = -3
            }
        }
    }
    if (keys.a.down && prev === 'a') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]

            if (collision({
                circle: { ...pacman, velocity: { x: -3, y: 0 } },
                rectangle: boundary
            })) {
                pacman.speed.x = 0
                break
            }
            else {
                pacman.speed.x = -3
            }
        }
    }
    if (keys.s.down && prev === 's') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]

            if (collision({
                circle: { ...pacman, velocity: { x: 0, y: 3 } },
                rectangle: boundary
            })) {
                pacman.speed.y = 0
                break
            }
            else {
                pacman.speed.y = 3
            }
        }
    }
    if (keys.d.down && prev === 'd') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]

            if (collision({
                circle: { ...pacman, velocity: { x: 3, y: 0 } },
                rectangle: boundary
            })) {
                pacman.speed.x = 0
                break
            }
            else {
                pacman.speed.x = 3
            }
        }
    }

    for (let i = ghosts.length - 1; 0 <= i; i--) {
        const ghost = ghosts[i]
        if (Math.hypot(
            ghost.position.x - pacman.position.x,
            ghost.position.y - pacman.position.y
        ) <
            ghost.size + pacman.size 
        ) {
            if(ghost.scared){
                ghosts.splice(i, 1)
            }
            else{
            cancelAnimationFrame(animationId)
            win.innerHTML = "You Lose!"
            }
        }
        
    }
    for (let i = powerUps.length - 1; 0 <= i; i--) {
        const powerup = powerUps[i]
        powerup.playerCreate()
        if (Math.hypot(
            powerup.position.x - pacman.position.x,
            powerup.position.y - pacman.position.y
        ) <
            powerup.size + pacman.size
        ) {
            powerUps.splice(i, 1)
            ghosts.forEach((ghost) => {
                ghost.scared = true
                setTimeout(() => {
                    ghost.scared = false
                }, 5000)
            })
        }
    }
    if (eatables.length == 0) {
        console.log('you win')
        cancelAnimationFrame(animationId)
    }
    
    for (let i = eatables.length - 1; 0 < i; i--) {
        const eatable = eatables[i]
        eatable.playerCreate()
        if (Math.hypot(
            eatable.position.x - pacman.position.x,
            eatable.position.y - pacman.position.y
        ) <
            eatable.size + pacman.size
        ) {
            eatables.splice(i, 1)
            points += 10
            score.innerHTML = points
        }

    }


    function stop() {
        cancelAnimationFrame(animationId)
    }
    if ( points === 1290){
        const myTimeout = setTimeout(stop, 100);
        win.innerHTML = "You Win!"
    }


    boundaries.forEach((boundary) => {
        boundary.boundaryLook()
        if (collision({
            circle: pacman,
            rectangle: boundary
        })) {
            pacman.speed.x = 0
            pacman.speed.y = 0
        }
    })



    pacman.move()



    if (pacman.speed.x > 0) pacman.rotation = 0
    if (pacman.speed.x < 0) pacman.rotation = Math.PI
    if (pacman.speed.y > 0) pacman.rotation = Math.PI / 2
    if (pacman.speed.y < 0) pacman.rotation = Math.PI * 1.5

    ghosts.forEach((ghost) => {
        ghost.move()

        const collisions = []
        boundaries.forEach((boundary) => {
            if (!collisions.includes('right') && collision({
                circle: {
                    ...ghost,
                    speed: {
                        x: ghost.speed1,
                        y: 0
                    }
                },
                rectangle: boundary
            })
            ) {
                collisions.push('right')
            }
            else if (!collisions.includes('left') && collision({
                circle: {
                    ...ghost,
                    speed: {
                        x: -ghost.speed1,
                        y: 0
                    }
                },
                rectangle: boundary
            })
            ) {
                collisions.push('left')
            }
            else if (!collisions.includes('down') && collision({
                circle: {
                    ...ghost,
                    speed: {
                        x: 0,
                        y: ghost.speed1
                    }
                },
                rectangle: boundary
            })
            ) {
                collisions.push('down')
            }
            else if (!collisions.includes('up') && collision({
                circle: {
                    ...ghost,
                    speed: {
                        x: 0,
                        y: -ghost.speed1
                    }
                },
                rectangle: boundary
            })
            ) {
                collisions.push('up')
            }
        })
        console.log(collisions)
        if (collisions.length > ghost.prevCols.length)
            ghost.prevCols = collisions

        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCols)) {
            console.log('go')
            if (ghost.speed.x > 0) ghost.prevCols.push('right')
            else if (ghost.speed.x < 0) ghost.prevCols.push('left')
            else if (ghost.speed.y > 0) ghost.prevCols.push('down')
            else if (ghost.speed.y < 0) ghost.prevCols.push('up')

            const pathways = ghost.prevCols.filter((collision) => {
                return !collisions.includes(collision)
            })
            const directions = pathways[Math.floor(Math.random() * pathways.length)]

            switch (directions) {
                case 'down':
                    ghost.speed.y = ghost.speed1
                    ghost.speed.x = 0
                    break

                case 'up':
                    ghost.speed.y = -ghost.speed1
                    ghost.speed.x = 0
                    break

                case 'left':
                    ghost.speed.y = 0
                    ghost.speed.x = -ghost.speed1
                    break

                case 'right':
                    ghost.speed.y = 0
                    ghost.speed.x = ghost.speed1
                    break


            }
            ghost.prevCols = []
        }
    })

}
animate()
addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.down = false
            break

        case 'a':
            keys.a.down = false
            break

        case 's':
            keys.s.down = false
            break

        case 'd':
            keys.d.down = false
            break
    }
})

addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.down = true
            prev = 'w'
            break

        case 'a':
            keys.a.down = true
            prev = 'a'
            break

        case 's':
            keys.s.down = true
            prev = 's'
            break

        case 'd':
            keys.d.down = true
            prev = 'd'
            break
    }
})


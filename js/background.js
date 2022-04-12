let canvas, squares
const saturation = 40;
const brightness = 77;
let xoff = 0;
let yoff = 0;

class AveragedSquare {
    constructor(x, y, l, h) {
        this.x = x
        this.y = y
        this.l = l
        this.h = h
        this.hue = random(360)
        this.color = color(this.hue, saturation, brightness)
    }

    draw() {
        noStroke()
        fill(this.color)
        rect(this.x, this.y, this.l + 0.5, this.h + 0.5)
    }
}

class Squares {
    constructor() {
        this.squares = []
        this.NUM_SQUARES = 100
        this.SPACING = 20

        let l = displayWidth / (this.NUM_SQUARES + this.SPACING)
        let h = displayHeight / (this.NUM_SQUARES + this.SPACING)
        let lengthMargin = l / this.NUM_SQUARES
        let heightMargin = h / this.NUM_SQUARES

        for (let i = 0; i < this.NUM_SQUARES; i++) {
            let curRow = []
            let x = i * l + this.SPACING * i * lengthMargin + lengthMargin * this.SPACING / 2

            for (let j = 0; j < this.NUM_SQUARES; j++) {
                let y = j * h + this.SPACING * j * heightMargin + heightMargin * this.SPACING / 2

                curRow.push(new AveragedSquare(x, y, l, h))
            }

            this.squares.push(curRow)
        }
    }

    draw() {
        for (let i = 0; i < this.squares.length; i++) {
            for (let j = 0; j < this.squares[i].length; j++) {
                this.squares[i][j].draw()
            }
        }
    }

    update() {
        xoff = xoff + yoff
        for (let i = 0; i < this.squares.length; i++) {
            yoff = yoff + 0.001;
            for (let j = 0; j < this.squares[i].length; j++) {
                let targetHueX = 0
                let targetHueY = 0
                let curSquare = this.squares[i][j]
                const neighbors = [
                    [i - 1, j],
                    [i + 1, j],
                    [i, j - 1],
                    [i, j + 1],
                    [i - 1, j - 1],
                    [i - 1, j + 1],
                    [i + 1, j - 1],
                    [i + 1, j + 1]
                ];

                neighbors.forEach(neighbor => {
                    const neighborHue = this.getHue(neighbor[0], neighbor[1]);

                    if (neighborHue != -1) {
                        targetHueY += sin(neighborHue - (180 + (noise(xoff, yoff) + PI)))
                        targetHueX += cos(neighborHue - (180 + (noise(xoff, yoff) + PI)))
                    }
                })

                curSquare.hue = atan2(targetHueY, targetHueX) + 180
                curSquare.color = color(curSquare.hue, saturation, brightness)
            }
        }
    }

    getHue(row, col) {
        if (row < 0 || col < 0 || row == this.NUM_SQUARES || col == this.NUM_SQUARES) {
            return -1
        } else {
            return this.squares[row][col].hue
        }
    }
}

function setup() {
    frameRate(60)
    pixelDensity(2.0)
    noStroke()
    colorMode(HSB, 360, 100, 100)
    angleMode(DEGREES)
    createCanvas(displayWidth, displayHeight)

    squares = new Squares()
}

function draw() {
    clear()
    squares.update()
    squares.draw()
}

function windowResized() {
    resizeCanvas(displayWidth, displayHeight);
}
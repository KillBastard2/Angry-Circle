
const canvasElement = document.getElementById("MainWindow");
const ctx = canvasElement.getContext("2d");
let CANVAS_WIDTH = 1480;
let CANVAS_HEIGHT = 860;

class MainCharacter {
    constructor(color, radius, start_pos_x = 0, start_pos_y = 0) {
        this.color = color;
        this.radius = radius;
        this.x_pos = start_pos_x;
        this.y_pos = start_pos_y;
        this.acc =  10;
        this.dirx = 0;
        this.diry = 0;
        this.prevdirx = 0;
        this.prevdiry = 0;
        this.speed = 1;
        this.x_acc = 0;
        this.y_acc = 0;
        this.x_max_acc = 20;
        this.y_max_acc = 20;
        this.x_acc_step = 0.45;
        this.y_acc_step = 0.45;
    }

    update() {

        if(this.x_acc > this.y_acc && this.prevdiry != 0) {
            this.y_acc = this.x_acc;
        }
        else if(this.y_acc > this.x_acc && this.prevdirx != 0) {
            this.x_acc = this.y_acc;
        }

        if(this.dirx && (this.dirx == this.prevdirx || this.prevdirx == 0)) {
            this.x_pos += (this.dirx * this.speed) + (this.dirx * this.x_acc);
            this.prevdirx = this.dirx;
        }
        else if(this.x_acc != 0) {
            this.x_acc -= (this.x_acc_step)*0.5;
            if(this.x_acc < 0) {
                this.x_acc = 0;
                this.prevdirx = 0;
            }
            this.x_pos += (this.dirx * this.speed) + (this.prevdirx * this.x_acc);
        }
        
        if(this.diry && (this.diry == this.prevdiry || this.prevdiry == 0)) {
            this.y_pos += (this.diry * this.speed) + (this.diry * this.y_acc);
            this.prevdiry = this.diry;
        }
        else if(this.y_acc != 0) {
            this.y_acc -= (this.y_acc_step)*0.5;
            if(this.y_acc < 0) {
                this.y_acc = 0;
                this.prevdiry = 0;
            }
            this.y_pos += (this.diry * this.speed) + (this.prevdiry * this.y_acc);
        }

        // boundary check
        if(this.x_pos - this.radius < 0) {
            this.x_pos = this.radius;
            this.prevdirx = 1;
        }
        else if(this.x_pos + this.radius > CANVAS_WIDTH) {
            this.x_pos = CANVAS_WIDTH - this.radius;
            this.prevdirx = -1;
        }

        if(this.y_pos - this.radius < 0) {
            this.y_pos = this.radius;
            this.prevdiry = 1;
        }
        else if(this.y_pos + this.radius > CANVAS_HEIGHT) {
            this.y_pos = CANVAS_HEIGHT - this.radius;
            this.prevdiry = -1;
        }
    }

    render() {
        ctx.resetTransform();
        ctx.beginPath();
        ctx.arc(this.x_pos, this.y_pos, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class Triangle {
    constructor(color, sizeLength, start_pos_x, start_pos_y) {
        this.color = color;
        this.sizeLength = sizeLength;
        this.x_pos = start_pos_x;
        this.y_pos = start_pos_y;
        this.angle = 0;
    }

    update(target) {
        this.angle += 0.1;
        const pointsToCheck = [];

        for(let i = 0; i < 2000; i += target.radius) {
            let newX = (i) * Math.sin(this.angle * Math.PI/180);
            let newY = -(i) * Math.cos(this.angle * Math.PI/180);
            pointsToCheck.push(newX, newY);
            ctx.fillStyle = "orange";
            ctx.fillRect(newX+i, newY+i, 5, 5);
        }

        

        //console.log(pointsToCheck);
    }

    render() {
        const path = new Path2D();
        ctx.translate(this.x_pos, this.y_pos - this.sizeLength/1.25);
        ctx.rotate(this.angle * Math.PI/180);
        path.moveTo(0, -this.sizeLength/1.25);
        path.lineTo(-this.sizeLength/1.5, +this.sizeLength/1.5);
        path.lineTo(this.sizeLength/1.5, +this.sizeLength/1.5);
        path.lineTo(0,  -this.sizeLength/1.25);
        ctx.fillStyle = this.color;
        ctx.fillStyle = "red";
        ctx.fill(path);
        ctx.moveTo(0, -this.sizeLength/1.25);
        ctx.lineTo(0, -400);
        ctx.strokeStyle = "green";
        ctx.stroke();
        ctx.resetTransform();
    }
}

function ClearBackground() {
    ctx.resetTransform();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 2000, 2000);
}

const Circle = new MainCharacter("white", 30, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
const Harambi = new Triangle("blue", 100, 500, 400);

function HandleKeyPressDown(event) {
    switch (event.key) {
        case "ArrowLeft":
            Circle.dirx = -1;
            Circle.x_acc += Circle.x_acc_step;
            if(Circle.x_acc > Circle.x_max_acc) {
                Circle.x_acc = Circle.x_max_acc;
            }
            break;
        case "ArrowRight":
            Circle.dirx = 1;
            Circle.x_acc += Circle.x_acc_step;
            if(Circle.x_acc > Circle.x_max_acc) {
                Circle.x_acc = Circle.x_max_acc;
            }
            break;
        case "ArrowUp":
            Circle.diry = -1;
            Circle.y_acc += Circle.y_acc_step;
            if(Circle.y_acc > Circle.y_max_acc) {
                Circle.y_acc = Circle.y_max_acc;
            }
            break;
        case "ArrowDown":
            Circle.diry = 1;
            Circle.y_acc += Circle.y_acc_step;
            if(Circle.y_acc > Circle.y_max_acc) {
                Circle.y_acc = Circle.y_max_acc;
            }
            break;
    }
}

function HandleKeyPressUp(event) {
    switch (event.key) {
        case "ArrowLeft":
            Circle.dirx = 0;
            break;
        case "ArrowRight":
            Circle.dirx = 0;
            break;
        case "ArrowUp":
            Circle.diry = 0;
            break;
        case "ArrowDown":
            Circle.diry = 0;
            break;
    }
}

document.addEventListener('keydown', HandleKeyPressDown);
document.addEventListener('keyup', HandleKeyPressUp);

function loop() {
    ClearBackground();
    Circle.update();
    Harambi.update(Circle);
    Circle.render();
    Harambi.render();
    requestAnimationFrame(loop);
}

loop();
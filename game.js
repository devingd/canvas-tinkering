
var mario;
var coin;
var badGuy;

function startGame() {
    gamingArena.start();
    mario = new square(10, 10, "red", 0, 0);
    coin = new square(10, 10, "yellow", Math.floor((Math.random() * gamingArena.canvas.width) - 10), Math.floor((Math.random() * gamingArena.canvas.height) - 10));
    badGuy = new square(10, 10, "green", gamingArena.canvas.width - 10, gamingArena.canvas.height - 10);
}

var gamingArena = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGamingArena, 20);
        window.addEventListener('keydown', function (e) {
            gamingArena.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            gamingArena.key = false;
        })
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function square(width, height, color, x, y) {
    this.gamearena = gamingArena;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;

    // define edges of canvas
    var top = 0;
    var rightEdge = this.gamearena.canvas.width - this.width;
    var bottom = this.gamearena.canvas.height - this.height;
    var leftEdge = 0;

    this.update = function () {
        ctx = gamingArena.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        this.detectEdge();
    }
    this.detectEdge = function () {
        if (this.y < top) {
            this.y = top;
            this.speedY = 0;
        }
        if (this.x > rightEdge) {
            this.x = rightEdge;
            this.speedX = 0;
        }
        if (this.y > bottom) {
            this.y = bottom;
            this.speedY = 0;
        }
        if (this.x < leftEdge) {
            this.x = leftEdge;
            this.speedX = 0;
        }
    }
}

function updateGamingArena() {
    gamingArena.clear();
    if (gamingArena.key && gamingArena.key == 37) {  // Left Arrow
        if (mario.x > 0) {
            mario.speedX = -1;
            mario.speedY = 0;
        }
    }
    if (gamingArena.key && gamingArena.key == 39) {  // Right Arrow
        if (mario.x < (gamingArena.canvas.width - mario.width)) {
            mario.speedX = 1;
            mario.speedY = 0;
        }
    }
    if (gamingArena.key && gamingArena.key == 38) { // Up Arrow
        if (mario.y > 0) {
            mario.speedY = -1;
            mario.speedX = 0;
        }
    }
    if (gamingArena.key && gamingArena.key == 40) { // Down Arrow
        if (mario.y < (gamingArena.canvas.height - mario.height)) {
            mario.speedY = 1;
            mario.speedX = 0;
        }
    }

    mario.newPos();
    mario.update();
    coin.newPos();
    coin.update();
    if(mario.x > badGuy.x) {
        badGuy.speedX = .5;
        badGuy.speedY = 0;
    }
    else if (mario.x == badGuy.x) {
        badGuy.speedX = 0;
        badGuy.speedY = .5;
    }
    else {
        badGuy.speedX = -.5;
        badGuy.speedY = 0;
    }
    if(mario.y > badGuy.y) {
        badGuy.speedY = .5;
    }
    else if (mario.y == badGuy.y) {
        badGuy.speedY = 0;
    }
    else {
        badGuy.speedY = -.5;
    }
    badGuy.newPos();
    badGuy.update();
}

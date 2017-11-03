
var goodGuy;

function startGame() {
    gamingArena.start();
    goodGuy = new square(10, 10, "blue", 0, 0);
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
    this.update = function () {
        ctx = gamingArena.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        this.hitEdge();
    }
    this.hitEdge = function () {
        var top = 0;
        var rightEdge = this.gamearena.canvas.width - this.width;
        var bottom = this.gamearena.canvas.height - this.height;
        var leftEdge = 0;
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
        if (goodGuy.x > 0) {
            goodGuy.speedX = -1;
            goodGuy.speedY = 0;
        }
    }
    if (gamingArena.key && gamingArena.key == 39) {  // Right Arrow
        if (goodGuy.x < (gamingArena.canvas.width - goodGuy.width)) {
            goodGuy.speedX = 1;
            goodGuy.speedY = 0;
        }
    }
    if (gamingArena.key && gamingArena.key == 38) { // Up Arrow
        if (goodGuy.y > 0) {
            goodGuy.speedY = -1;
            goodGuy.speedX = 0;
        }
    }
    if (gamingArena.key && gamingArena.key == 40) { // Down Arrow
        if (goodGuy.y < (gamingArena.canvas.height - goodGuy.height)) {
            goodGuy.speedY = 1;
            goodGuy.speedX = 0;
        }
    }
    goodGuy.newPos();
    goodGuy.update();
}

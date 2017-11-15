
var mario;
var coin;
var badGuy;
var score; 

function loadGame () {
    gamingArena.load();
}

function startGame () {
    gamingArena.start();
    mario = new square(10, 10, "red", 0, 0);
    badGuy = new square(10, 10, "green", gamingArena.canvas.width - 10, gamingArena.canvas.height - 10);
    coin = new square(10, 10, "gold", Math.floor((Math.random() * gamingArena.canvas.width) - 10), Math.floor((Math.random() * gamingArena.canvas.height) - 10));
    score = new scoreBoard();
}

var gamingArena = {
    canvas: document.createElement("canvas"),
    load: function () {
        this.canvas.width = 300;
        this.canvas.height = 300;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);      

        var button = document.createElement("button");
        button.innerHTML = "Restart";
        button.id = "restart-button";
        button.onclick = startGame;
        document.body.appendChild(button);
        
        window.addEventListener('resize', this.resizeCanvas, false);
        window.addEventListener('orientationchange', this.resizeCanvas, false);
        this.resizeCanvas();
        
        startGame();
    },
    start: function () {
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
    },
    stop: function () {
        clearInterval(this.interval);
    },
    resizeCanvas: function () {
        gamingArena.canvas.width = window.innerWidth - 20;
        gamingArena.canvas.height = window.innerWidth - 20;
        if (mario) mario.updateEdges();
        if (badGuy) badGuy.updateEdges();
        if (coin) coin.updateEdges();
    }
}

function scoreBoard () {
    this.update = function(text, posX, posY) {
        ctx = gamingArena.context;
        ctx.font = "15pt Consolas";
        ctx.fillStyle = "black";
        ctx.fillText(text, posX, posY);
    }
}

function square(width, height, color, x, y) {
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.hasMoved = false;

    // define edges of canvas
    var top = 0;
    var rightEdge = gamingArena.canvas.width - this.width;
    var bottom = gamingArena.canvas.height - this.height;
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

    this.collectCoin = function (c) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = c.x;
        var otherright = c.x + (c.width);
        var othertop = c.y;
        var otherbottom = c.y + (c.height);
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            return false;
        }
        return true;
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

    this.updateEdges = function () {
        rightEdge = gamingArena.canvas.width - this.width;
        bottom = gamingArena.canvas.height - this.height;
    }
}

function updateGamingArena() {
    gamingArena.clear();
    if (mario.score == 5) {
        score.update("YOU WIN!", gamingArena.canvas.width / 2 - 60, gamingArena.canvas.height / 2 - 20);
        gamingArena.stop();
    } else if (badGuy.score == 5) {
        score.update("YOU LOSE...", gamingArena.canvas.width / 2 - 60, gamingArena.canvas.height / 2 - 20);
        gamingArena.stop();
    } else {
        // Detect keyboard press
        if (gamingArena.key && gamingArena.key == 37) {  // Left Arrow
            mario.hasMoved = true;
            if (mario.x > 0) {
                mario.speedX = -3;
                mario.speedY = 0;
            }
        }
        if (gamingArena.key && gamingArena.key == 39) {  // Right Arrow
            mario.hasMoved = true;
            if (mario.x < (gamingArena.canvas.width - mario.width)) {
                mario.speedX = 3;
                mario.speedY = 0;
            }
        }
        if (gamingArena.key && gamingArena.key == 38) { // Up Arrow
            mario.hasMoved = true;
            if (mario.y > 0) {
                mario.speedY = -3;
                mario.speedX = 0;
            }
        }
        if (gamingArena.key && gamingArena.key == 40) { // Down Arrow
            mario.hasMoved = true;
            if (mario.y < (gamingArena.canvas.height - mario.height)) {
                mario.speedY = 3;
                mario.speedX = 0;
            }
        }

        // update score
        if (mario.collectCoin(coin)) {
            mario.score++;
            coin = new square(10, 10, "gold", Math.floor((Math.random() * gamingArena.canvas.width) - 10), Math.floor((Math.random() * gamingArena.canvas.height) - 10));
        } else if (badGuy.collectCoin(coin)) {
            badGuy.score++;
            coin = new square(10, 10, "gold", Math.floor((Math.random() * gamingArena.canvas.width) - 10), Math.floor((Math.random() * gamingArena.canvas.height) - 10));
        }
        score.update("Score: " + mario.score + " - " + badGuy.score, gamingArena.canvas.width / 2 - 60, 20);

        // update player position
        mario.newPos();
        mario.update();
        coin.newPos();
        coin.update();
        if(mario.hasMoved) {
            if(coin.x > badGuy.x) {
                badGuy.speedX = 1.5;
                badGuy.speedY = 0;
            }
            else if (coin.x == badGuy.x) {
                badGuy.speedX = 0;
                badGuy.speedY = 1.5;
            }
            else {
                badGuy.speedX = -1.5;
                badGuy.speedY = 0;
            }
            if(coin.y > badGuy.y) {
                badGuy.speedY = 1.5;
            }
            else if (coin.y == badGuy.y) {
                badGuy.speedY = 0;
            }
            else {
                badGuy.speedY = -1.5;
            }
        }
        badGuy.newPos();
        badGuy.update();
    }
}

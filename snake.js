// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set the scale for the game (size of each snake part and fruit)
const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;
let score = 0;

// Snake setup
class Snake {
    constructor() {
        this.body = [];
        this.body[0] = {x: 240, y: 240};
        this.newDirection = 'Right';
        this.direction = 'Right';
    }

    reset() {
        this.body = [];
        this.body[0] = {x: 240, y: 240};
        this.direction = 'Right';
        this.newDirection = 'Right';
        // Reset fruit and obstacles as well
        fruit.pickLocation();
        generateObstacles(5); // Assuming you want to regenerate obstacles
        score = 0; // Reset score
        document.getElementById('score').innerText = `Score: ${score}`; // Update score display
    }

    draw() {
        ctx.fillStyle = "#006400"; // Drawing the snake in dark green
        for (let i = 0; i < this.body.length; i++) {
            ctx.fillRect(this.body[i].x, this.body[i].y, scale, scale);
        }
    }

    update() {
        if ((this.direction === 'Right' && this.newDirection !== 'Left') ||
            (this.direction === 'Left' && this.newDirection !== 'Right') ||
            (this.direction === 'Up' && this.newDirection !== 'Down') ||
            (this.direction === 'Down' && this.newDirection !== 'Up')) {
            this.direction = this.newDirection;
        }

        let head = {x: this.body[0].x, y: this.body[0].y};
        switch (this.direction) {
            case 'Right':
                head.x += scale;
                break;
            case 'Left':
                head.x -= scale;
                break;
            case 'Up':
                head.y -= scale;
                break;
            case 'Down':
                head.y += scale;
                break;
        }

        if (head.x >= canvas.width) {
            head.x = 0;
        } else if (head.x < 0) {
            head.x = canvas.width - scale;
        }
        if (head.y >= canvas.height) {
            head.y = 0;
        } else if (head.y < 0) {
            head.y = canvas.height - scale;
        }

        for (let i = 0; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                this.reset();
                return;
            }
        }

        // Check for collision with obstacles
        for (let i = 0; i < obstacles.length; i++) {
            if (head.x === obstacles[i].x && head.y === obstacles[i].y) {
                this.reset(); // Reset the game or handle collision
                return;
            }
        }

        this.body.unshift(head);

        if (head.x === fruit.x && head.y === fruit.y) {
            fruit.pickLocation();
            score += 1; // Increase score
            document.getElementById('score').innerText = `Score: ${score}`; // Update score display
        } else {
            this.body.pop();
        }
    }

    changeDirection(direction) {
        this.newDirection = direction;
    }
}

class Obstacle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        ctx.fillStyle = "grey";
        ctx.fillRect(this.x, this.y, scale, scale);
    }
}

let obstacles = [];

function generateObstacles(number) {
    obstacles = []; // Clear existing obstacles
    for (let i = 0; i < number; i++) {
        let obstacleX = (Math.floor(Math.random() * (canvas.width / scale)) * scale);
        let obstacleY = (Math.floor(Math.random() * (canvas.height / scale)) * scale);
        obstacles.push(new Obstacle(obstacleX, obstacleY));
    }
}

function drawObstacles() {
    obstacles.forEach(obstacle => obstacle.draw());
}

// Fruit setup
class Fruit {
    constructor() {
        this.x;
        this.y;
        this.pickLocation(); // Pick initial location for fruit
    }

    pickLocation() {
        // Randomly place fruit on the canvas
        this.x = (Math.floor(Math.random() * columns - 1) + 1) * scale;
        this.y = (Math.floor(Math.random() * rows - 1) + 1) * scale;
    }

    draw() {
        ctx.fillStyle = "#FF0000"; // Fruit color
        ctx.fillRect(this.x, this.y, scale, scale); // Draw fruit
    }
}

// Create snake and fruit objects
let snake = new Snake();
let fruit = new Fruit();
generateObstacles(5); // Generate 5 obstacles

// Game loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    fruit.draw(); // Draw fruit
    snake.update(); // Update snake position
    snake.draw(); // Draw snake    
    drawObstacles(); // Draw obstacles
}

// Handle keyboard input for snake direction
window.addEventListener('keydown', e => {
    const direction = e.key.replace('Arrow', ''); // Remove "Arrow" from the key name
    snake.changeDirection(direction); // Change snake direction based on key press
});

// Start the game loop
setInterval(update, 100); // Update game state every 100ms
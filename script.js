const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const backgroundMusic = document.getElementById('backgroundMusic');
const startButton = document.getElementById('startButton');

let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = getRandomFoodPosition();
let score = 0;
let gameInterval = null;

// Set initial volume
backgroundMusic.volume = 0.1;

startButton.addEventListener('click', startGame);

function startGame() {
    startButton.style.display = 'none';
    canvas.style.display = 'block';
    backgroundMusic.play();
    document.addEventListener('keydown', changeDirection);
    gameInterval = setInterval(update, 100);
}

function update() {
    moveSnake();
    if (snakeCollision()) {
        alert('Game Over');
        resetGame();
    }
    if (eatFood()) {
        score++;
        backgroundMusic.volume = Math.min(1, backgroundMusic.volume + 0.05);
        food = getRandomFoodPosition();
    }
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
}

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, 20, 20);
        ctx.strokeStyle = '#003300';
        ctx.strokeRect(part.x, part.y, 20, 20);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 20, 20);
    ctx.strokeStyle = '#8B0000';
    ctx.strokeRect(food.x, food.y, 20, 20);
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        return;
    }
    snake.pop();
}

function changeDirection(event) {
    const key = event.keyCode;
    const UP = 38;
    const DOWN = 40;
    const LEFT = 37;
    const RIGHT = 39;

    const goingUp = direction.y === -20;
    const goingDown = direction.y === 20;
    const goingRight = direction.x === 20;
    const goingLeft = direction.x === -20;

    if (key === LEFT && !goingRight) {
        direction = { x: -20, y: 0 };
    }
    if (key === UP && !goingDown) {
        direction = { x: 0, y: -20 };
    }
    if (key === RIGHT && !goingLeft) {
        direction = { x: 20, y: 0 };
    }
    if (key === DOWN && !goingUp) {
        direction = { x: 0, y: 20 };
    }
}

function getRandomFoodPosition() {
    let newFoodPosition;
    while (true) {
        newFoodPosition = {
            x: Math.floor(Math.random() * canvas.width / 20) * 20,
            y: Math.floor(Math.random() * canvas.height / 20) * 20
        };
        if (!snake.some(part => part.x === newFoodPosition.x && part.y === newFoodPosition.y)) {
            return newFoodPosition;
        }
    }
}

function snakeCollision() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function eatFood() {
    return snake[0].x === food.x && snake[0].y === food.y;
}

function resetGame() {
    clearInterval(gameInterval); // Clear the previous interval
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 };
    food = getRandomFoodPosition();
    score = 0;
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    backgroundMusic.volume = 0.1;
    startButton.style.display = 'block';
    canvas.style.display = 'none';
}

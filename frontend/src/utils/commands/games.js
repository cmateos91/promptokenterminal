class Game {
  constructor() {
    this.isActive = false;
    this.canvas = [];
    this.width = 60;  // Increased size for better space usage
    this.height = 30; // Increased size for better space usage
    this.gameInterval = null;
    this.keyListener = null;
    this.updateCallback = null;
  }

  initCanvas() {
    this.canvas = Array(this.height).fill().map(() => Array(this.width).fill(' '));
  }

  render() {
    let output = '┏' + '━'.repeat(this.width) + '┓\n';
    for (let row of this.canvas) {
      output += '┃' + row.join('') + '┃\n';
    }
    output += '┗' + '━'.repeat(this.width) + '┛';
    return output;
  }

  setPixel(x, y, char) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.canvas[y][x] = char;
    }
  }

  clearCanvas() {
    this.initCanvas();
  }

  setUpdateCallback(callback) {
    this.updateCallback = callback;
  }

  updateDisplay(content) {
    if (this.updateCallback) {
      this.updateCallback(content);
    }
  }

  stop() {
    this.isActive = false;
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }
    if (this.keyListener) {
      document.removeEventListener('keydown', this.keyListener);
      this.keyListener = null;
    }
    // Clean up game display element
    if (gameDisplayElement) {
      gameDisplayElement.remove();
      gameDisplayElement = null;
    }
  }
}

class SnakeGame extends Game {
  constructor() {
    super();
    this.snake = [{ x: Math.floor(this.width/2), y: Math.floor(this.height/2) }];
    this.direction = { x: 1, y: 0 };
    this.food = { x: 15, y: 8 };
    this.score = 0;
    this.speed = 150;
  }

  start() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.initCanvas();
    this.generateFood();
    
    // Remove any existing listeners
    if (this.keyListener) {
      document.removeEventListener('keydown', this.keyListener);
    }
    
    this.keyListener = (e) => {
      if (!this.isActive) return;
      
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          if (this.direction.y === 0) this.direction = { x: 0, y: -1 };
          break;
        case 's':
        case 'arrowdown':
          if (this.direction.y === 0) this.direction = { x: 0, y: 1 };
          break;
        case 'a':
        case 'arrowleft':
          if (this.direction.x === 0) this.direction = { x: -1, y: 0 };
          break;
        case 'd':
        case 'arrowright':
          if (this.direction.x === 0) this.direction = { x: 1, y: 0 };
          break;
        case 'escape':
          this.stop();
          return;
      }
      e.preventDefault();
    };
    
    document.addEventListener('keydown', this.keyListener);
    
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
    }
    
    this.gameInterval = setInterval(() => {
      this.update();
    }, this.speed);
    
    this.draw();
  }

  generateFood() {
    do {
      this.food = {
        x: Math.floor(Math.random() * this.width),
        y: Math.floor(Math.random() * this.height)
      };
    } while (this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y));
  }

  update() {
    if (!this.isActive) return;
    
    const head = { ...this.snake[0] };
    head.x += this.direction.x;
    head.y += this.direction.y;
    
    // Check collision with walls
    if (head.x < 0 || head.x >= this.width || head.y < 0 || head.y >= this.height) {
      this.gameOver();
      return;
    }
    
    // Check collision with self
    if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      this.gameOver();
      return;
    }
    
    this.snake.unshift(head);
    
    // Check food collision
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.generateFood();
      // Increase speed slightly
      if (this.score % 5 === 0 && this.speed > 80) {
        this.speed -= 5;
        clearInterval(this.gameInterval);
        this.gameInterval = setInterval(() => {
          this.update();
        }, this.speed);
      }
    } else {
      this.snake.pop();
    }
    
    this.draw();
  }

  draw() {
    this.clearCanvas();
    
    // Draw snake
    this.snake.forEach((segment, index) => {
      this.setPixel(segment.x, segment.y, index === 0 ? '●' : '○');
    });
    
    // Draw food
    this.setPixel(this.food.x, this.food.y, '◆');
    
    const content = `🐍 SNAKE GAME - Score: ${this.score} - Length: ${this.snake.length}
ESC to quit | WASD or Arrow Keys to move | Speed: ${151 - this.speed}

${this.render()}`;
    
    this.updateDisplay(content);
  }

  gameOver() {
    this.stop();
    const content = `💀 GAME OVER!
Final Score: ${this.score}
Snake Length: ${this.snake.length}

${this.render()}

Press any key to return to terminal...`;
    
    this.updateDisplay(content);
    
    const endListener = () => {
      document.removeEventListener('keydown', endListener);
      // Game cleanup is handled by stop() method
    };
    document.addEventListener('keydown', endListener);
  }
}

class ArkanoidGame extends Game {
  constructor() {
    super();
    this.paddle = { x: Math.floor(this.width/2) - 3, y: this.height - 3, width: 6 };
    this.ball = { x: Math.floor(this.width/2), y: this.height - 5, dx: 1, dy: -1 };
    this.blocks = [];
    this.score = 0;
    this.speed = 120;
    this.initBlocks();
  }

  initBlocks() {
    this.blocks = [];
    const blockRows = 8;
    const blockCols = Math.floor(this.width / 4);
    const startY = 3;
    
    for (let y = 0; y < blockRows; y++) {
      for (let x = 0; x < blockCols; x++) {
        this.blocks.push({ 
          x: x * 4 + 2, 
          y: startY + y,
          width: 3,
          active: true 
        });
      }
    }
  }

  start() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.initCanvas();
    
    if (this.keyListener) {
      document.removeEventListener('keydown', this.keyListener);
    }
    
    this.keyListener = (e) => {
      if (!this.isActive) return;
      
      switch(e.key.toLowerCase()) {
        case 'a':
        case 'arrowleft':
          if (this.paddle.x > 0) this.paddle.x -= 2;
          break;
        case 'd':
        case 'arrowright':
          if (this.paddle.x < this.width - this.paddle.width) this.paddle.x += 2;
          break;
        case 'escape':
          this.stop();
          return;
      }
      e.preventDefault();
    };
    
    document.addEventListener('keydown', this.keyListener);
    
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
    }
    
    this.gameInterval = setInterval(() => {
      this.update();
    }, this.speed);
    
    this.draw();
  }

  update() {
    if (!this.isActive) return;
    
    // Move ball
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;
    
    // Ball collision with walls
    if (this.ball.x <= 0 || this.ball.x >= this.width - 1) {
      this.ball.dx = -this.ball.dx;
    }
    if (this.ball.y <= 0) {
      this.ball.dy = -this.ball.dy;
    }
    
    // Ball collision with paddle
    if (this.ball.y >= this.paddle.y - 1 && this.ball.y <= this.paddle.y &&
        this.ball.x >= this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width) {
      this.ball.dy = -Math.abs(this.ball.dy);
      // Add angle based on paddle hit position
      const hitPos = (this.ball.x - this.paddle.x) / this.paddle.width;
      if (hitPos < 0.2) this.ball.dx = -2;
      else if (hitPos < 0.4) this.ball.dx = -1;
      else if (hitPos > 0.8) this.ball.dx = 2;
      else if (hitPos > 0.6) this.ball.dx = 1;
      else this.ball.dx = 0;
    }
    
    // Ball collision with blocks
    this.blocks.forEach(block => {
      if (block.active && 
          this.ball.x >= block.x && this.ball.x < block.x + block.width &&
          this.ball.y >= block.y && this.ball.y <= block.y) {
        block.active = false;
        this.ball.dy = -this.ball.dy;
        this.score += 10;
      }
    });
    
    // Check game over
    if (this.ball.y >= this.height) {
      this.gameOver();
      return;
    }
    
    // Check win condition
    if (this.blocks.every(block => !block.active)) {
      this.gameWin();
      return;
    }
    
    this.draw();
  }

  draw() {
    this.clearCanvas();
    
    // Draw blocks
    this.blocks.forEach(block => {
      if (block.active) {
        for (let i = 0; i < block.width; i++) {
          this.setPixel(block.x + i, block.y, '█');
        }
      }
    });
    
    // Draw paddle
    for (let i = 0; i < this.paddle.width; i++) {
      this.setPixel(this.paddle.x + i, this.paddle.y, '▄');
    }
    
    // Draw ball
    this.setPixel(this.ball.x, this.ball.y, '●');
    
    const activeBlocks = this.blocks.filter(b => b.active).length;
    const content = `🧱 ARKANOID - Score: ${this.score} - Blocks: ${activeBlocks}
A/D or ←/→ to move paddle, ESC to quit

${this.render()}`;
    
    this.updateDisplay(content);
  }

  gameOver() {
    this.stop();
    const content = `💀 GAME OVER!
Final Score: ${this.score}

${this.render()}

Press any key to return to terminal...`;
    
    this.updateDisplay(content);
    this.endGame();
  }

  gameWin() {
    this.stop();
    const content = `🎉 CONGRATULATIONS!
You cleared all blocks!
Final Score: ${this.score}

${this.render()}

Press any key to return to terminal...`;
    
    this.updateDisplay(content);
    this.endGame();
  }

  endGame() {
    const endListener = () => {
      document.removeEventListener('keydown', endListener);
      // Game cleanup is handled by stop() method
    };
    document.addEventListener('keydown', endListener);
  }
}

class PongGame extends Game {
  constructor() {
    super();
    this.playerPaddle = { x: 2, y: Math.floor(this.height/2) - 2, height: 5 };
    this.aiPaddle = { x: this.width - 3, y: Math.floor(this.height/2) - 2, height: 5 };
    this.ball = { x: Math.floor(this.width/2), y: Math.floor(this.height/2), dx: 1, dy: 1 };
    this.playerScore = 0;
    this.aiScore = 0;
    this.speed = 100;
  }

  start() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.initCanvas();
    
    if (this.keyListener) {
      document.removeEventListener('keydown', this.keyListener);
    }
    
    this.keyListener = (e) => {
      if (!this.isActive) return;
      
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          if (this.playerPaddle.y > 0) this.playerPaddle.y--;
          break;
        case 's':
        case 'arrowdown':
          if (this.playerPaddle.y < this.height - this.playerPaddle.height) this.playerPaddle.y++;
          break;
        case 'escape':
          this.stop();
          return;
      }
      e.preventDefault();
    };
    
    document.addEventListener('keydown', this.keyListener);
    
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
    }
    
    this.gameInterval = setInterval(() => {
      this.update();
    }, this.speed);
    
    this.draw();
  }

  update() {
    if (!this.isActive) return;
    
    // Move ball
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;
    
    // Ball collision with top/bottom walls
    if (this.ball.y <= 0 || this.ball.y >= this.height - 1) {
      this.ball.dy = -this.ball.dy;
    }
    
    // Ball collision with player paddle
    if (this.ball.x === this.playerPaddle.x + 1 && 
        this.ball.y >= this.playerPaddle.y && 
        this.ball.y < this.playerPaddle.y + this.playerPaddle.height) {
      this.ball.dx = Math.abs(this.ball.dx);
      const hitPos = (this.ball.y - this.playerPaddle.y) / this.playerPaddle.height;
      this.ball.dy = Math.round((hitPos - 0.5) * 3);
    }
    
    // Ball collision with AI paddle
    if (this.ball.x === this.aiPaddle.x - 1 && 
        this.ball.y >= this.aiPaddle.y && 
        this.ball.y < this.aiPaddle.y + this.aiPaddle.height) {
      this.ball.dx = -Math.abs(this.ball.dx);
      const hitPos = (this.ball.y - this.aiPaddle.y) / this.aiPaddle.height;
      this.ball.dy = Math.round((hitPos - 0.5) * 3);
    }
    
    // AI movement (with some delay for fairness)
    if (Math.random() > 0.1) {
      const ballCenter = this.ball.y;
      const paddleCenter = this.aiPaddle.y + this.aiPaddle.height / 2;
      if (ballCenter < paddleCenter - 1 && this.aiPaddle.y > 0) {
        this.aiPaddle.y--;
      } else if (ballCenter > paddleCenter + 1 && this.aiPaddle.y < this.height - this.aiPaddle.height) {
        this.aiPaddle.y++;
      }
    }
    
    // Scoring
    if (this.ball.x <= 0) {
      this.aiScore++;
      this.resetBall();
    } else if (this.ball.x >= this.width - 1) {
      this.playerScore++;
      this.resetBall();
    }
    
    // Check win condition
    if (this.playerScore >= 5 || this.aiScore >= 5) {
      this.gameOver();
      return;
    }
    
    this.draw();
  }

  resetBall() {
    this.ball = { 
      x: Math.floor(this.width/2), 
      y: Math.floor(this.height/2), 
      dx: Math.random() > 0.5 ? 1 : -1, 
      dy: Math.random() > 0.5 ? 1 : -1 
    };
  }

  draw() {
    this.clearCanvas();
    
    // Draw center line
    for (let y = 0; y < this.height; y += 3) {
      this.setPixel(Math.floor(this.width / 2), y, '┊');
      this.setPixel(Math.floor(this.width / 2), y + 1, '┊');
    }
    
    // Draw paddles
    for (let i = 0; i < this.playerPaddle.height; i++) {
      this.setPixel(this.playerPaddle.x, this.playerPaddle.y + i, '█');
    }
    for (let i = 0; i < this.aiPaddle.height; i++) {
      this.setPixel(this.aiPaddle.x, this.aiPaddle.y + i, '█');
    }
    
    // Draw ball
    this.setPixel(this.ball.x, this.ball.y, '●');
    
    const content = `🏓 PONG - Player: ${this.playerScore} | AI: ${this.aiScore} | First to 5 wins!
W/S or ↑/↓ to move paddle, ESC to quit

${this.render()}`;
    
    this.updateDisplay(content);
  }

  gameOver() {
    this.stop();
    const winner = this.playerScore >= 5 ? 'Player' : 'AI';
    const content = `${winner === 'Player' ? '🎉' : '💀'} GAME OVER!
${winner} Wins!
Final Score - Player: ${this.playerScore} | AI: ${this.aiScore}

${this.render()}

Press any key to return to terminal...`;
    
    this.updateDisplay(content);
    
    const endListener = () => {
      document.removeEventListener('keydown', endListener);
      // Game cleanup is handled by stop() method
    };
    document.addEventListener('keydown', endListener);
  }
}

let currentGame = null;
let gameDisplayElement = null;

export const gameCommands = {
  play: (args) => {
    // Stop any running game first
    if (currentGame && currentGame.isActive) {
      currentGame.stop();
      currentGame = null;
    }

    // Clean up existing game display
    if (gameDisplayElement) {
      gameDisplayElement.remove();
      gameDisplayElement = null;
    }

    if (args.length === 0) {
      return {
        type: 'result',
        content: `🎮 GAME ARCADE 🎮
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Available Games:

1. snake     │ Classic Snake game - eat food, grow longer!
             │ Controls: WASD or Arrow Keys
             │ 
2. arkanoid  │ Break all the blocks with your paddle!
             │ Controls: A/D or ←/→ to move paddle
             │ 
3. pong      │ Classic Pong vs AI - first to 5 wins!
             │ Controls: W/S or ↑/↓ to move paddle

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usage: play <game>
Example: play snake

Pro tip: Press ESC anytime to quit a game and return to terminal!`
      };
    }

    const gameName = args[0].toLowerCase();
    
    switch (gameName) {
      case 'snake':
        currentGame = new SnakeGame();
        break;
      case 'arkanoid':
      case 'breakout':
        currentGame = new ArkanoidGame();
        break;
      case 'pong':
        currentGame = new PongGame();
        break;
      default:
        return {
          type: 'error',
          content: `❌ Unknown game: ${gameName}\nAvailable games: snake, arkanoid, pong\nType "play" to see game descriptions.`
        };
    }

    // Create a dedicated game display element
    gameDisplayElement = document.createElement('div');
    gameDisplayElement.className = 'game-display';
    gameDisplayElement.style.cssText = `
      font-family: 'Courier New', monospace;
      line-height: 1.2;
      white-space: pre;
      background: #000;
      color: #00ff00;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #333;
      border-radius: 4px;
      overflow: hidden;
    `;

    // Append to terminal output
    const terminalOutput = document.querySelector('.terminal-output') || document.body;
    terminalOutput.appendChild(gameDisplayElement);

    // Setup efficient callback for updating display
    const gameCallback = (content) => {
      if (gameDisplayElement) {
        gameDisplayElement.textContent = content;
      }
    };

    currentGame.setUpdateCallback(gameCallback);

    // Start the game
    setTimeout(() => {
      if (currentGame) {
        currentGame.start();
      }
    }, 100);

    return {
      type: 'result',
      content: `🎮 Starting ${gameName.charAt(0).toUpperCase() + gameName.slice(1)}...\n\nGame will appear below. Use ESC to quit anytime.`
    };
  }
};

// Clean up function
window.addEventListener('beforeunload', () => {
  if (currentGame && currentGame.isActive) {
    currentGame.stop();
  }
  if (gameDisplayElement) {
    gameDisplayElement.remove();
    gameDisplayElement = null;
  }
});

// Export cleanup function for manual use
export const cleanupGames = () => {
  if (currentGame && currentGame.isActive) {
    currentGame.stop();
    currentGame = null;
  }
  if (gameDisplayElement) {
    gameDisplayElement.remove();
    gameDisplayElement = null;
  }
};
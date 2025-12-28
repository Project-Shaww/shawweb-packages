(function () {
  'use strict';

  class SnakeGame {
    constructor(container, fs, shawOS) {
      this.container = container;
      this.fs = fs;
      this.packageContext = packageContext;

      const html = window.getPackageFile('index.html');
      const css = window.getPackageFile('style.css');

      if (!html || !css) {
        container.innerHTML = '<p style="color:red;">Error: Faltan archivos del paquete</p>';
        return;
      }

      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);

      container.innerHTML = html;
      this.initGame();
    }

    loadHighScore() {
      if (this.fs.fileExists('snake_highscore.txt')) {
        return parseInt(this.fs.readFile('snake_highscore.txt')) || 0;
      }
      return 0;
    }

    saveHighScore(score) {
      this.fs.writeFile('snake_highscore.txt', score.toString());
    }

    randomFood(snake, tileCount) {
      let newFood;
      do {
        newFood = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount)
        };
      } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
      return newFood;
    }

    initGame() {
      const canvas = this.container.querySelector('#gameCanvas');
      const ctx = canvas.getContext('2d');
      const scoreEl = this.container.querySelector('#score');
      const highScoreEl = this.container.querySelector('#highScore');
      const startBtn = this.container.querySelector('#startBtn');
      const gameOverEl = this.container.querySelector('#gameOver');

      const gridSize = 20;
      const tileCount = canvas.width / gridSize;

      let snake = [{ x: 10, y: 10 }];
      let food = { x: 15, y: 15 };
      let dx = 0;
      let dy = 0;
      let score = 0;
      let highScore = this.loadHighScore();
      let gameRunning = false;
      let gameLoop = null;

      highScoreEl.textContent = highScore;

      const handleKeyDown = (e) => {
        if (!gameRunning) return;
        switch (e.key) {
          case 'ArrowUp': if (dy === 0) { dx = 0; dy = -1; } break;
          case 'ArrowDown': if (dy === 0) { dx = 0; dy = 1; } break;
          case 'ArrowLeft': if (dx === 0) { dx = -1; dy = 0; } break;
          case 'ArrowRight': if (dx === 0) { dx = 1; dy = 0; } break;
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      const draw = () => {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#16213e';
        ctx.lineWidth = 1;
        for (let i = 0; i < tileCount; i++) {
          ctx.beginPath();
          ctx.moveTo(i * gridSize, 0);
          ctx.lineTo(i * gridSize, canvas.height);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, i * gridSize);
          ctx.lineTo(canvas.width, i * gridSize);
          ctx.stroke();
        }
        snake.forEach((segment, index) => {
          ctx.fillStyle = index === 0 ? '#00ff41' : '#00cc33';
          ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
          if (index === 0) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(segment.x * gridSize + 5, segment.y * gridSize + 5, 3, 3);
            ctx.fillRect(segment.x * gridSize + 12, segment.y * gridSize + 5, 3, 3);
          }
        });
        ctx.fillStyle = '#ff0066';
        ctx.beginPath();
        ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
      };

      const endGame = () => {
        gameRunning = false;
        if (gameLoop) clearInterval(gameLoop);
        gameOverEl.style.display = 'block';
        startBtn.textContent = 'Jugar de nuevo';
      };

      const update = () => {
        if (!gameRunning) return;
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
          endGame();
          return;
        }
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
          endGame();
          return;
        }
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
          score += 10;
          scoreEl.textContent = score;
          food = this.randomFood(snake, tileCount);
          if (score > highScore) {
            highScore = score;
            highScoreEl.textContent = highScore;
            this.saveHighScore(highScore);
          }
        } else {
          snake.pop();
        }
        draw();
      };

      const startGame = () => {
        snake = [{ x: 10, y: 10 }];
        food = this.randomFood(snake, tileCount);
        dx = 1;
        dy = 0;
        score = 0;
        gameRunning = true;
        gameOverEl.style.display = 'none';
        startBtn.textContent = 'Reiniciar';
        scoreEl.textContent = score;
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(update, 100);
      };

      startBtn.addEventListener('click', () => {
        if (!gameRunning) startGame();
      });

      draw();
    }

    static appSettings() {
      return {
        window: ['snake', 'Snake Game', '', 500, 600],
        needsSystem: false
      };
    }
  }

  if (!window.ShawOSPackages) window.ShawOSPackages = {};
  window.ShawOSPackages.snake = SnakeGame;
  console.log('🐍 Snake Game instalado');

})();

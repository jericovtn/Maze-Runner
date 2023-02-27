// JavaScript file dedicated to the Game Proper
class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.timer = 0;
    this.SPEED = 0;
    this.controls = new Controls(this);
    this.controls.setKeyBindings();
    this.items = [];
    this.gameStarted = Date.now();
    this.gameScore = 0;
    this.setUpGame(10);
  }

  setUpGame (level) {
    // Game Size Configuration
    this.level = level;
    this.rows = this.level;
    this.columns = this.level;
    this.cellWidth = parseInt(this.width / this.columns);
    this.cellHeight = parseInt(this.height / this.rows);
    this.center = parseInt((this.cellWidth / 2) / 2);

    // Generate Maze
    this.maze = new MazeGenerator(this);

    // Items
    this.items = [];
    this.enemies = [new Enemy(this), new Enemy(this)];
    for (let i = 0; i < 1 + (this.level - 10) / 2; i++) {
      this.enemies.push(new Enemy(this));
    }

    // Setting the Probability of Appearance of Each Item 
    const probabilityOfHavingItems = 1 + (this.level - 10) / 3;

    for (let i = 0; i < probabilityOfHavingItems; i++) {
      this.items.push(new Armour(this));
    }
    for (let i = 0; i < probabilityOfHavingItems; i++) {
      this.items.push(new MoreTime(this));
    }
    for (let i = 0; i < probabilityOfHavingItems; i++) {
      this.items.push(new LessTime(this));
    }
    for (let i = 0; i < probabilityOfHavingItems; i++) {
      this.items.push(new Potion(this));
    }
    for (let i = 0; i < probabilityOfHavingItems; i++) {
      this.items.push(new MoreScore(this));
    }
    for (let i = 0; i < probabilityOfHavingItems; i++) {
      this.items.push(new LessScore(this));
    }
    this.escape = new Escape(this);
  }

  // Reset the Game
  reset() {
    this.setUpGame(10);
  }
  
  // Level Up the Game by 1 if player escape the Maze 
  levelUp() {
    this.setUpGame(this.level + 1);
    this.character.row = 0;
    this.character.col = 0;
    this.character.cellHeight = this.cellHeight;
    this.character.cellWidth = this.cellWidth;
    this.gameScore += parseInt((((this.character.time - this.timer / 1000)) * 2));
  }

  // React to whatever control is pressed
  handleControl(direction) {
    switch (direction) {
      case 'up':
        this.character.move('up');
        break;
      case 'right':
        this.character.move('right');
        break;
      case 'down':
        this.character.move('down');
        break;
      case 'left':
        this.character.move('left');
        break;
    }
  }

  // Show Home Screen
  homeGame() {
    this.hideScreen('canvas')
    this.showScreen('home')
    this.hideScreen('scorescreen')
    this.hideScreen('gameover')
  }

  // Start the Game
  startGame() {
    this.loop(0);
  }
  
  loop(timestamp) {
    this.timer = Date.now() - (this.gameStarted || 0);    
    this.gameTime = this.time_convert((this.character.time) - parseInt(this.timer / 1000));
    this.update();
    this.draw();
    window.requestAnimationFrame((timestamp) => this.loop(timestamp));
  }

  // Hide Specific screen
  hideScreen(id) {
    let screen = document.getElementById(id);
    screen.style.display = "none";
  }
  // Show Specific screen
  showScreen(id) {
    let screen = document.getElementById(id);
    screen.style.display = "flex";
  }

  // Show Canvas Screen
  showCanvasScreen(character) {
    switch (character) {
      case 'amazon':
        this.character = new Amazon(this);
        break;
      case 'barbarian':
        this.character = new Barbarian(this);
        break;
    }
    this.hideScreen('home');
    this.showScreen("canvas");
    this.showScreen("scorescreen");
    this.startGame();
  }
  time_convert(num)
  { 
   var minutes = Math.floor(num / 60);  
   var seconds = num % 60;

   return minutes + ":" + seconds;         
 }
  updateMenu() {
    let $LIFE = document.getElementById('life')
    $LIFE.innerHTML = " Life: " + this.character.life

    let $TIME = document.getElementById('time')
    $TIME.innerHTML = " Time: " + this.gameTime;


    let $SPEED = document.getElementById('speed')
    $SPEED.innerHTML = " Level: " + (this.level-9);
    let $SCORE = document.getElementById('score')
    $SCORE.innerHTML = " Score: " + this.gameScore;
  }

  update() {    
    this.updateMenu()
    this.checkGameOver();
  }

  draw () {
    this.context.clearRect(0, 0, this.width, this.height);
    this.maze.draw()
    for (let enemy of this.enemies) {
      enemy.draw()
    }
    for (let item of this.items) {
      item.draw();
    }
    this.escape.draw();
    this.character.draw()
  }

  // Check if Game is Over
  checkGameOver() {
    if (parseInt(this.gameTime) < 0) {
      console.log('epa')
      this.gameOver()
    }
  }

  // Game Over Page
  gameOver() {
    this.hideScreen('canvas');
    this.hideScreen('scorescreen');
    this.showScreen('gameover');
    const $finalScore = document.getElementById('finalScore');
  $finalScore.innerHTML = "Your final score is: " + this.gameScore;
  }

}
const lessScoreImage = new Image();
lessScoreImage.src = './../img/items/old-key.png';

class LessScore extends Item {
  constructor(game) {
    super(game);
    this.image = lessScoreImage;
  }

  draw() {
    this.game.context.drawImage(this.image, this.col + this.game.center, this.row, this.sizeX, this.sizeY);
  }

  catch() {
this.game.gameScore -= 50;
    this.col = 9000;
  }
}
class Background {
  constructor(game) {
    this.game = game;
    this.img = new Image();
    this.img.src = "../images/bg.png";
    this.img.onload = () => {
      this.x = 0;
      this.y = this.game.height - this.img.height;
      this.repeatNums = Math.ceil(this.game.width / this.img.width) + 1;
      this.loaded = true;
    };
  }

  update() {
    if (this.x < -this.img.width) {
      this.x = 0;
    } else {
      this.x += -1;
    }
  }

  render() {
    if (this.loaded) {
      this.game.context.beginPath();
      this.game.context.fillStyle = "#84C2CC";
      this.game.context.fillRect(0, 0, this.game.width, this.game.height);
      this.game.context.beginPath();
      for (let index = 0; index < this.repeatNums; index++) {
        this.game.context.drawImage(
          this.img,
          this.x + this.img.width * index,
          this.y
        );
      }
    }
  }

  
}

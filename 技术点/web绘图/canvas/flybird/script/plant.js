class Plant {
  constructor(game) {
    this.game = game;
    this.img = new Image();
    this.img.src = "../images/fg.png";
    this.img.onload = () => {
      this.loaded = true;
      this.width = this.img.width;
      this.height = this.img.height;
      this.x = 0;
      this.y = this.game.height - this.height;
      this.repeatNums = Math.ceil(this.game.width / this.width) + 1;
    };
  }

  update() {
    if (this.x < -this.width) {
      this.x = 0;
    } else {
      this.x -= 1;
    }
  }

  render() {
    if (this.loaded) {
      for (let index = 0; index < this.repeatNums; index++) {
        this.game.context.drawImage(
          this.img,
          this.x + this.width * index,
          this.y
        );
      }
    }
  }
}

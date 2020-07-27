class Bird {
  constructor(game) {
    this.game = game;
    this.rotateNum = 0;
    this.changeY = 0; // 加速度
    this.status = "down"; // down || up
    this.initImg();
    this.initEvent();
  }

  initImg() {
    this.img = new Image();
    this.img.src = "../images/bird.png"; // 40 x 28
    this.img.onload = () => {
      this.width = this.img.width;
      this.height = this.img.height;
      this.loaded = true;
      this.x = 50;
      this.y = 0;
    };
  }

  eventFunc = () => {
    this.status = "up";
    this.changeY = 3;
    this.rotateNum = -16;
    const flySound =  document.getElementById('flySound');
    flySound.currentTime = 0;
    flySound.play();
  }

  initEvent() {
    this.game.canvas.addEventListener("click", this.eventFunc);
  }

  cancelEvent() {
    this.game.canvas.removeEventListener("click", this.eventFunc);
  }

  update() {
    if (this.status === "down") {
      this.changeY += 0.05;
      this.y += this.changeY;
      this.rotateNum += 1;
      if (this.rotateNum >= 128) {
        this.rotateNum = 0;
      }
    } else if (this.status === "up") {
      this.y -= this.changeY;
      this.changeY -= 0.2;
      this.changeY <= 0 ? (this.status = "down") : null;
      this.y <= 0 ? (this.y = 0) : null;
    }

    // 记录小鸟png 上下左右的x,y值用于碰撞检测
    this.detectCrash();
  }

  render() {
    if (this.loaded) {
      this.update();
      this.game.context.save();
      this.game.context.translate(this.x, this.y);
      this.game.context.rotate((Math.PI / 64) * this.rotateNum);
      this.game.context.drawImage(this.img, -this.width / 2, -this.height / 2);
      this.game.context.restore();
    }
  }

  detectCrash() {
    this.x1 = this.x - this.width / 2;
    this.x2 = this.x + this.width / 2;
    this.y1 = this.y - this.height / 2;
    this.y2 = this.y + this.height / 2;

    if (this.y + this.height / 2 >= this.game.height - this.game.plant.height) {
      this.y = this.game.height - this.game.plant.height - this.height / 2;
      if (this.game.gameTimer) {
        window.cancelAnimationFrame(this.game.gameTimer);
        this.cancelEvent();
        this.game.gameStep = 'end';
        this.game.begin();
      }
    }

    this.game.pipe.cachePipe.forEach(cacheItem => {
      if (
        this.x2 >= cacheItem.x1 &&
        this.x1 <= cacheItem.x2 &&
        (this.y1 <= cacheItem.y1 || this.y2 >= cacheItem.y2)
      ) {
        if (this.game.gameTimer) {
          window.cancelAnimationFrame(this.game.gameTimer);
          this.cancelEvent();
          this.game.gameStep = 'end';
          this.game.begin();
        }
      }

      if (this.x1 > cacheItem.x2) {
        if (this.game.score < cacheItem.id) {
          document.getElementById('scoreSound').play();
          this.game.score++;
        }
      }
    });
  }
}

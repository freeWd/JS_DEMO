class Game {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    this.gameStep = "start"; // start | playing | end
    this.gameTimer = null;
    this.score = 0;
  }

  initCanvasSize() {
    let clientWidth = window.innerWidth;
    let clientHeight = window.innerHeight;
    this.width = clientWidth > 420 ? 420 : clientWidth;
    this.height = clientHeight > 700 ? 700 : clientHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  begin() {
    this.background = new Background(this);
    this.pipe = new Pipe(this);
    this.plant = new Plant(this);
    this.bird = new Bird(this);
    switch (this.gameStep) {
      case "start":
        this.drawStartPage();
        break;
      case "playing":
        this.drawPlayingPage();
        break;
      default:
        this.drawEndPage();
        break;
    }
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  drawStartPage() {
    setTimeout(() => {
      this.clear();
      this.background.render();
      this.bird.x = this.width / 2;
      this.bird.y = 270;
      this.bird.render();
      this.context.beginPath();
      this.context.font = "60px serif";
      this.context.strokeStyle = "#eee";
      this.context.lineWidth = 3;
      this.context.strokeText("Flappy Bird", 80, 150);
      this.context.beginPath();
      this.context.fillStyle = "#eaeaea";
      this.context.fillRect(140, 350, 150, 60);
      this.context.beginPath();
      this.context.fillStyle = "#000";
      this.context.font = "30px serif";
      this.context.fillText("开始游戏", 155, 390);
      this.addStartEventBind();
    });
  }

  drawPlayingPage() {
    const render = () => {
      this.gameTimer = window.requestAnimationFrame(render);
      this.clear();
      this.background.update();
      this.background.render();
      this.plant.update();
      this.plant.render();
      this.pipe.update();
      this.pipe.render();
      this.bird.update();
      this.bird.render();
      this.context.beginPath();
      this.context.font = "14px serif";
      this.context.fillStyle = "red";
      this.context.fillText("当前分数:" + this.score, 5, 20);
    };
    render();
  }

  drawEndPage() {
    setTimeout(() => {
      this.clear();
      this.background.render();

      this.context.beginPath();
      this.context.fillStyle = "red";
      this.context.font = "30px serif";
      this.context.fillText(`总分：${this.score}`, 150, 300);
      this.context.beginPath();
      this.context.fillStyle = "#eaeaea";
      this.context.fillRect(140, 350, 150, 60);
      this.context.beginPath();
      this.context.fillStyle = "#000";
      this.context.font = "30px serif";
      this.context.fillText("重新开始", 155, 390);
      this.addEndEventBind();
    });
  }

  addStartEventBind() {
    const mouseMoveEvent = event => {
      let x = event.clientX - this.canvas.getBoundingClientRect().left;
      let y = event.clientY - this.canvas.getBoundingClientRect().top;
      if (x > 140 && x < 290 && y > 350 && y < 410) {
        // 在按钮所在的区域内，修改鼠标样式
        this.canvas.style.cursor = "pointer";
      } else {
        this.canvas.style.cursor = "default";
      }
    };

    const mouseClickEvent = event => {
      let x = event.clientX - this.canvas.getBoundingClientRect().left;
      let y = event.clientY - this.canvas.getBoundingClientRect().top;
      if (x > 140 && x < 290 && y > 350 && y < 410) {
        this.canvas.removeEventListener("mousemove", mouseMoveEvent);
        this.canvas.removeEventListener("click", mouseClickEvent);
        this.gameStep = "playing";
        this.begin();
      }
    };

    this.canvas.addEventListener("mousemove", mouseMoveEvent);
    this.canvas.addEventListener("click", mouseClickEvent);
  }

  addEndEventBind() {
    const mouseMoveEvent = event => {
      let x = event.clientX - this.canvas.getBoundingClientRect().left;
      let y = event.clientY - this.canvas.getBoundingClientRect().top;
      if (x > 140 && x < 290 && y > 350 && y < 410) {
        // 在按钮所在的区域内，修改鼠标样式
        this.canvas.style.cursor = "pointer";
      } else {
        this.canvas.style.cursor = "default";
      }
    };

    const mouseClickEvent = event => {
      let x = event.clientX - this.canvas.getBoundingClientRect().left;
      let y = event.clientY - this.canvas.getBoundingClientRect().top;
      if (x > 140 && x < 290 && y > 350 && y < 410) {
        this.canvas.removeEventListener("mousemove", mouseMoveEvent);
        this.canvas.removeEventListener("click", mouseClickEvent);
        this.gameStep = "playing";
        this.score = 0;
        this.begin();
      }
    };

    this.canvas.addEventListener("mousemove", mouseMoveEvent);
    this.canvas.addEventListener("click", mouseClickEvent);
  }
}

let game = new Game();
game.initCanvasSize();
game.begin();

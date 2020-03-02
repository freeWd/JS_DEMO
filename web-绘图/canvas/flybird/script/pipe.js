class Pipe {
  constructor(game) {
    this.game = game;
    this.loadNums = 0;
    this.cachePipe = [];
    this.pipeSum = 1;

    this.widthSpacing = 150; // 每两根柱子的水平间隔是150px
    this.hightSpacing = 200; // 上下两个柱子的空隙高度是120px
    this.miniHeight = 50; // 每个管子允许的最小的高度
    this.pipeHeaderHigh = 22; // 管子头部的高度

    this.loadImg("imgNorth", "../images/pipeNorth.png"); // 50 x 242
    this.loadImg("imgSouth", "../images/pipeSouth.png"); // 50 x 376
  }

  loadImg(attr, path) {
    this[attr] = {
      img: new Image(),
      width: 0,
      height: 0,
      loaded: false
    };

    this[attr].img.src = path;
    this[attr].img.onload = () => {
      this[attr].loaded = true;
      this.width = this[attr].img.width;
      this.x = this.game.width - this.width;
      this[attr].width = this[attr].img.width;
      this[attr].height = this[attr].img.height;
    };
  }

  update() {
    this.pipeHeight = this.game.height - this.game.plant.height - this.hightSpacing; // 上下两个管子的总高度
    this.x -= 1;
  }

  render() {
    if (this.imgNorth.loaded && this.imgSouth.loaded && this.game.plant.loaded) {
      let renderNums = Math.ceil(
        (this.game.width - this.x) / this.widthSpacing
      );
      let size = this.cachePipe.length;

      if (size < renderNums) {
        for (let index = 0; index < renderNums - size; index++) {
          let randomHeight = parseInt(Math.random() * this.pipeHeight);
          let northHeight =
            randomHeight < this.miniHeight ? this.miniHeight : randomHeight;
          let southHeight = this.pipeHeight - northHeight;
          this.cachePipe.push({
            id: this.pipeSum++,
            northHeight,
            southHeight
          });
        }
      }

      this.cachePipe.forEach((cacheItem, index) => {
        cacheItem.currentX = this.x + (this.widthSpacing + this.width) * index;
        cacheItem.x1 = cacheItem.currentX;
        cacheItem.x2 = cacheItem.currentX + this.width;
        cacheItem.y1 = cacheItem.northHeight;
        cacheItem.y2 = cacheItem.northHeight + this.hightSpacing;
        this.drawPipe(
          cacheItem.currentX,
          cacheItem.northHeight,
          cacheItem.southHeight,
        );
      });

      // 当第一个管道已经完全移动出canvas的左边，就将其删除，并修改x的值。
      if (this.x < -this.width) {
        this.x = this.widthSpacing;
        this.cachePipe.shift();
      }
    }
  }

  drawPipe(currentX, northHeight, southHeight) {
    this.drawNorthPipe(currentX, 0, northHeight);
    this.drawSouthPipe(currentX, northHeight + this.hightSpacing, southHeight);
  }

  drawNorthPipe(currentX, currentY, northHeight) {
    this.game.context.drawImage(
      this.imgNorth.img,
      0,
      0,
      this.width,
      this.imgNorth.height - this.pipeHeaderHigh,
      currentX,
      currentY,
      this.width,
      northHeight - this.pipeHeaderHigh
    );
    this.game.context.drawImage(
      this.imgNorth.img,
      0,
      this.imgNorth.height - this.pipeHeaderHigh,
      this.width,
      this.pipeHeaderHigh,
      currentX,
      northHeight - this.pipeHeaderHigh,
      this.width,
      this.pipeHeaderHigh
    );
  }

  drawSouthPipe(currentX, currentY, southHeight) {
    this.game.context.drawImage(
      this.imgSouth.img,
      0,
      0,
      this.width,
      this.pipeHeaderHigh,
      currentX,
      currentY,
      this.width,
      this.pipeHeaderHigh
    );
    this.game.context.drawImage(
      this.imgSouth.img,
      0,
      this.pipeHeaderHigh,
      this.width,
      this.imgSouth.height - this.pipeHeaderHigh,
      currentX,
      currentY + this.pipeHeaderHigh,
      this.width,
      southHeight - this.pipeHeaderHigh
    );
  }
}

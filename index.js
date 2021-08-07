const gameFieldMethods = {
  init: function () {
    this.setCanvasAndContext();
    this.setCanvasMatrix();
    this.addListenersForMouseEvent();
    requestAnimationFrame(this.updateCanvas.bind(this));
  },

  setCanvasAndContext: function () {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.canvas.className += 'field-canvas';
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    const app = document.getElementById('app');

    app.appendChild(this.canvas);
  },

  setCanvasMatrix: function () {
    this.matrix = Array.from({ length: this.canvas.height }, () =>
      Array.from({ length: this.canvas.width }, () => 0)
    );
  },

  updateCanvas: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.mouseIsPressed && this.endX && this.endY) {
      this.drawDragRect();
    }

    requestAnimationFrame(this.updateCanvas.bind(this));
  },

  addListenersForMouseEvent: function () {
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
  },

  handleMouseUp: function (event) {
    this.mouseIsPressed = false;
    this.endX = null;
    this.endY = null;
  },

  handleMouseDown: function (event) {
    const { offsetX, offsetY } = event;
    this.matrix[offsetY][offsetX] = 1;
    this.startX = offsetX;
    this.startY = offsetY;

    this.mouseIsPressed = true;
  },

  handleMouseMove: function (event) {
    if (this.mouseIsPressed) {
      const { offsetX, offsetY } = event;
      this.matrix[offsetY][offsetX] = 1;
      this.endX = offsetX;
      this.endY = offsetY;

      this.drawDragRect();
    }
  },

  drawBackground: function () {
    this.matrix.forEach((row, y) => {
      row.forEach((col, x) => {
        if (col === 0) {
          this.ctx.fillRect(x, y, x + 1, y + 1);
        }
      });
    });
  },

  drawDragRect: function () {
    this.ctx.strokeStyle = 'green'; // 선 색깔은 그린
    this.ctx.lineWidth = 1;

    this.ctx.beginPath();
    this.ctx.rect(
      this.startX,
      this.startY,
      this.endX - this.startX,
      this.endY - this.startY
    );
    this.ctx.stroke();
  },
};

const gameField = {
  canvas: null,
  ctx: null,
  matrix: null,
  mouseIsPressed: false,
  startX: null,
  startY: null,
  endY: null,
  endX: null,
};

Object.setPrototypeOf(gameField, gameFieldMethods);

gameField.init();

const gameFieldMethods = {
  init: function () {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.className += 'field-canvas';
    const app = document.getElementById('app');
    this.ctx.fillStyle = 'white';

    app.appendChild(this.canvas);

    console.log(this.matrix);

    this.addListenersForMouseEvent();
  },

  updateField: function () {},

  addListenersForMouseEvent: function () {
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
  },

  handleMouseUp: function (event) {
    console.log(event);

    this.mouseIsPressed = false;
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

      this.drawDragRect(this.startX, this.startY, offsetX, offsetY);
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

  drawDragRect: function (startX, startY, endX, endY) {
    this.ctx.strokeStyle = 'green'; // 선 색깔은 그린
    this.ctx.lineWidth = 2;

    this.ctx.beginPath();
    this.ctx.rect(startX, startY, endX - startX, endY - startY);
    this.ctx.stroke();
  },
};

const gameField = {
  matrix: Array.from({ length: window.innerHeight }, () =>
    Array.from({ length: window.innerWidth }, () => 0)
  ),
  canvas: null,
  ctx: null,
  mouseIsPressed: false,
  startX: null,
  startY: null,
};

Object.setPrototypeOf(gameField, gameFieldMethods);

gameField.init();
gameField.drawBackground();

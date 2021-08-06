const gameFieldMethods = {
  init: function () {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.className += 'field-canvas';
    const app = document.getElementById('app');

    app.appendChild(this.canvas);
    this.ctx.fillStyle = 'green';

    this.addListenersForMouseEvent();
  },

  addListenersForMouseEvent: function () {
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);
  },

  handleMouseUp: function (event) {
    console.log(event);
  },

  handleMouseDown: function (event) {
    console.log(event);
  },

  handleMouseMove: function (event) {},

  draw: function () {
    this.matrix.forEach((row, y) => {
      row.forEach((col, x) => {
        if (col === 0) {
          this.ctx.fillRect(10 * x, 10 * y, 10 * (x + 1), 10 * (y + 1));
        }
      });
    });
  },
};

const gameField = {
  matrix: Array.from({ length: 100 }, () =>
    Array.from({ length: 100 }, () => 0)
  ),
  canvas: null,
  ctx: null,
  mouseIsPressed: false,
};

Object.setPrototypeOf(gameField, gameFieldMethods);

gameField.init();
gameField.draw();

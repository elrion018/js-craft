const gameFieldMethods = {
  init: function () {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.className += 'field-canvas';
    const app = document.getElementById('app');

    app.appendChild(this.canvas);
    this.ctx.fillStyle = 'green';

    console.log(this.matrix);

    this.addListenersForMouseEvent();
  },

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
    this.matrix[event.offsetY][event.offsetX] = 1;
    this.mouseIsPressed = true;
  },

  handleMouseMove: function (event) {
    if (this.mouseIsPressed) {
      this.matrix[event.offsetY][event.offsetX] = 1;
    }
  },

  draw: function () {
    this.matrix.forEach((row, y) => {
      row.forEach((col, x) => {
        if (col === 0) {
          this.ctx.fillRect(x, y, x + 1, y + 1);
        }
      });
    });
  },
};

const gameField = {
  matrix: Array.from({ length: window.innerHeight }, () =>
    Array.from({ length: window.innerWidth }, () => 0)
  ),
  canvas: null,
  ctx: null,
  mouseIsPressed: false,
};

Object.setPrototypeOf(gameField, gameFieldMethods);

gameField.init();
gameField.draw();

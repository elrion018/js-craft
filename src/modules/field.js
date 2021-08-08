export const field = {
  init: function (app, gameSystem) {
    this.gameSystem = gameSystem;
    this.endX = null;
    this.endY = null;

    this.setCanvasAndContext(app);
    this.gameSystem.setMatrix(this.canvas.height, this.canvas.width);
    this.addListenersForMouseEvent();

    requestAnimationFrame(this.updateCanvas.bind(this));
  },

  setCanvasAndContext: function (app) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.canvas.className += 'field-canvas';
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    app.appendChild(this.canvas);
  },

  updateCanvas: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.mouseIsPressed && this.endX && this.endY) this.drawDragRect();

    if (this.gameSystem.units.length) this.drawUnits();

    requestAnimationFrame(this.updateCanvas.bind(this));
  },

  addListenersForMouseEvent: function () {
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener(
      'contextmenu',
      this.handleContextMenu.bind(this)
    );
  },

  handleMouseUp: function (event) {
    this.mouseIsPressed = false;

    if (this.isDraged) {
      this.gameSystem.selectUnitsWithDrag(
        this.startX,
        this.startY,
        this.endX,
        this.endY
      );

      this.isDraged = false;
    }

    if (!this.isDraged && !this.endX && !this.endY) {
      this.gameSystem.selectUnitWithOneTouch(this.startX, this.startY);
    }

    this.endX = null;
    this.endY = null;
  },

  handleMouseDown: function (event) {
    if (event.which === 1) {
      const { offsetX, offsetY } = event;
      this.startX = offsetX;
      this.startY = offsetY;

      this.mouseIsPressed = true;
    }
  },

  handleMouseMove: function (event) {
    if (this.mouseIsPressed) {
      const { offsetX, offsetY } = event;
      this.endX = offsetX;
      this.endY = offsetY;
      this.isDraged = true;

      this.drawDragRect();
    }
  },

  handleContextMenu: function (event) {
    event.preventDefault();
  },

  drawBackground: function () {
    this.gameSystem.getMatrix().forEach((row, y) => {
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
    this.ctx.strokeStyle = 'black';
  },

  drawUnits: function () {
    this.gameSystem.getUnits().forEach(unit => {
      const { positionX, positionY, radius } = unit;
      this.ctx.beginPath();
      this.ctx.arc(positionX, positionY, radius, 0, 2 * Math.PI);

      if (unit.isSelected) this.ctx.fill();
      this.ctx.stroke();
    }, this);
  },
};

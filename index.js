const gameFieldMethods = {
  init: function init() {
    const canvas = document.createElement('canvas')
    this.ctx = canvas.getContext('2d')
    canvas.className += 'field-canvas'
    const app = document.getElementById('app')

    app.appendChild(canvas)
    this.ctx.fillStyle = 'green'
  },

  draw: function draw() {
    this.matrix.forEach((row, y) => {
      row.forEach((col, x) => {
        if (col === 0) {
          this.ctx.fillRect(10 * x , 10 * y, 10 * (x + 1), 10 * (y + 1))
        }
      })
    })
  }
}

const gameField = {
  matrix: Array.from({length: 10}, () => Array.from({length: 10}, () => 0)),
  ctx : null,
}

Object.setPrototypeOf(gameField, gameFieldMethods)

gameField.init()
gameField.draw()
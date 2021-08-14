export const Resource = {
  resourceInit: function (positionX, positionY, id, gameSystem) {
    this.gameSystem = gameSystem;
    this.type = 'resource';
    this.id = `resource-${id}`;
    this.positionX = positionX;
    this.positionY = positionY;
    this.isSelected = false;
    this.size = 50;
    this.reserves = 3000;

    this.setResourceInMatrix(
      this.positionX,
      this.positionY,
      this.size,
      this.id
    );
  },

  getID: function () {
    return this.id;
  },

  setResourceInMatrix: function (positionX, positionY, size, id) {
    for (let y = positionY - size / 2; y < positionY + size / 2; y++) {
      for (let x = positionX - size / 2; x < positionX + size / 2; x++) {
        this.gameSystem.setMatrix(x, y, id);
      }
    }
  },

  setIsSelected: function (isSelected) {
    this.isSelected = isSelected;
  },
};

export const Resource = {
  resourceInit: function (positionX, positionY, resourceID, gameSystem) {
    this.gameSystem = gameSystem;
    this.resourceID = resourceID;
    this.positionX = positionX;
    this.positionY = positionY;
    this.isSelected = false;
    this.size = 50;
    this.reserves = 3000;
  },

  getResourceID: function () {
    return this.resourceID;
  },

  serResourceInMatrix: function (positionX, positionY, size, resourceID) {
    for (let y = positionY - size / 2; y < positionY + size / 2; y++) {
      for (let x = positionX - size / 2; x < positionX + size / 2; x++) {
        this.gameSystem.setMatrix(y, x, resourceID);
      }
    }
  },

  setIsSelected: function (isSelected) {
    this.isSelected = isSelected;
  },
};

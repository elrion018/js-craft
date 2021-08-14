export const Resource = {
  resourceInit: function (positionX, positionY, resourceID, gameSystem) {
    this.gameSystem = gameSystem;
    this.resourceID = `resource-${resourceID}`;
    this.positionX = positionX;
    this.positionY = positionY;
    this.isSelected = false;
    this.size = 50;
    this.reserves = 3000;

    this.setResourceInMatrix(
      this.positionX,
      this.positionY,
      this.size,
      this.resourceID
    );
  },

  getResourceID: function () {
    return this.resourceID;
  },

  setResourceInMatrix: function (positionX, positionY, size, resourceID) {
    for (let y = positionY - size / 2; y < positionY + size / 2; y++) {
      for (let x = positionX - size / 2; x < positionX + size / 2; x++) {
        this.gameSystem.setMatrix(x, y, resourceID);
      }
    }
  },

  setIsSelected: function (isSelected) {
    this.isSelected = isSelected;
  },
};

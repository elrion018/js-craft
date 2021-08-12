export const Building = {
  buildingInit: function (positionX, positionY, buildingID, gameSystem) {
    this.gameSystem = gameSystem;
    this.buildingID = `building-${buildingID}`;
    this.positionX = positionX;
    this.positionY = positionY;
    this.constructionProgress = 0;
    this.isSelected = false;
    this.isCompleted = false;
    this.size = 100;

    this.setBuildingInMatrix(positionX, positionY, this.size, this.buildingID);
  },

  setBuildingInMatrix: function (positionX, positionY, size, buildingID) {
    for (let y = positionY; y < positionY + size; y++) {
      for (let x = positionX; x < positionX + size; x++) {
        this.gameSystem.setMatrix(y, x, buildingID);
      }
    }
  },
};

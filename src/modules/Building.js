export const Building = {
  buildingInit: function (positionX, positionY, buildingID, gameSystem) {
    this.gameSystem = gameSystem;
    this.buildingID = `building-${buildingID}`;
    this.positionX = positionX;
    this.positionY = positionY;
    this.constructionProgress = 0;
    this.isSelected = false;
    this.isCompleted = false;
    this.size = 100; // 짝수로 할 것

    this.setBuildingInMatrix(positionX, positionY, this.size, this.buildingID);
  },

  getBuildingID: function () {
    return this.buildingID;
  },

  setBuildingInMatrix: function (positionX, positionY, size, buildingID) {
    for (let y = positionY - size / 2; y < positionY + size / 2; y++) {
      for (let x = positionX - size / 2; x < positionX + size / 2; x++) {
        this.gameSystem.setMatrix(y, x, buildingID);
      }
    }
  },

  setIsSelected: function (isSelected) {
    this.isSelected = isSelected;
  },
};

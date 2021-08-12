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
  },
};

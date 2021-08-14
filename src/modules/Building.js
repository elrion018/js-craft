export const Building = {
  buildingInit: function (positionX, positionY, id, gameSystem) {
    this.gameSystem = gameSystem;
    this.type = 'building';
    this.id = `building-${id}`;
    this.positionX = positionX;
    this.positionY = positionY;
    this.constructionProgress = 0;
    this.isSelected = false;
    this.isCompleted = false;
    this.size = 100; // 짝수로 할 것

    this.setBuildingInMatrix(positionX, positionY, this.size, this.id);
  },

  getBuildingID: function () {
    return this.id;
  },

  setBuildingInMatrix: function (positionX, positionY, size, id) {
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

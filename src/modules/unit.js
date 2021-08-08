export const unit = {
  init: function (positionX, positionY) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.radius = 20;
    this.isSelected = false;
  },

  getPositions: function () {
    return {
      positionX: this.positionX,
      positionY: this.positionY,
    };
  },

  setIsSelected: function (isSelected) {
    this.isSelected = isSelected;
  },
};

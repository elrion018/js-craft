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

  move: function (targetX, targetY) {
    const angle = this.getAngleBetweenTarget(targetX, targetY);
    console.log(angle);
  },

  getAngleBetweenTarget: function (targetX, targetY) {
    return Math.atan2(targetY - this.positionY, targetX - this.positionX);
  },
};

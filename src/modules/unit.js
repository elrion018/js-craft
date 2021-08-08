export const unit = {
  init: function (positionX, positionY) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.targetX = null;
    this.targetY = null;
    this.radius = 20;
    this.speed = 100;
    this.isSelected = false;
    this.isMoving = false;
  },

  updateStatus: function (diff) {
    if (this.isMoving) {
      this.move(diff);
    }
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

  setTargetForMove: function (targetX, targetY) {
    this.isMoving = true;
    this.targetX = targetX;
    this.targetY = targetY;
  },

  move: function (diff) {
    const angle = this.getAngleBetweenTarget(this.targetX, this.targetY);

    this.positionX += Math.cos(angle) * this.speed * diff;
    this.positionY += Math.sin(angle) * this.speed * diff;
  },

  getAngleBetweenTarget: function (targetX, targetY) {
    return Math.atan2(targetY - this.positionY, targetX - this.positionX);
  },
};

export const unit = {
  init: function (positionX, positionY, gameSystem) {
    this.gameSystem = gameSystem;
    this.gameSystem.matrix[positionY][positionX] = 1;

    this.positionX = positionX;
    this.positionY = positionY;
    this.targetX = null;
    this.targetY = null;
    this.radius = 20;
    this.speed = 1000;
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
    const angle = this.getAngleBetweenTarget();
    const calculatedDistanceX = Math.cos(angle) * this.speed * diff;
    const calculatedDistanceY = Math.sin(angle) * this.speed * diff;

    this.setPositionXWithMove(calculatedDistanceX);
    this.setPositionYWithMove(calculatedDistanceY);

    if (this.getDistanceBetweenTarget() <= 1) this.isMoving = false;
  },

  setPositionXWithMove: function (calculatedDistanceX) {
    if (
      (calculatedDistanceX > 0 &&
        this.positionX + calculatedDistanceX >= this.targetX) ||
      (calculatedDistanceX < 0 &&
        this.positionX + calculatedDistanceX <= this.targetX)
    ) {
      this.positionX = this.targetX;
    } else this.positionX += calculatedDistanceX;
  },

  setPositionYWithMove: function (calculatedDistanceY) {
    if (
      (calculatedDistanceY > 0 &&
        this.positionY + calculatedDistanceY >= this.targetY) ||
      (calculatedDistanceY < 0 &&
        this.positionY + calculatedDistanceY <= this.targetY)
    ) {
      this.positionY = this.targetY;
    } else this.positionY += calculatedDistanceY;
  },

  getAngleBetweenTarget: function () {
    return Math.atan2(
      this.targetY - this.positionY,
      this.targetX - this.positionX
    );
  },

  getDistanceBetweenTarget: function () {
    return Math.sqrt(
      Math.pow(this.positionX - this.targetX, 2) +
        Math.pow(this.positionY - this.targetY, 2)
    );
  },
};

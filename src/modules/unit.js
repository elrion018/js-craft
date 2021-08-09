export const unit = {
  init: function (positionX, positionY, gameSystem) {
    this.gameSystem = gameSystem;
    this.positionX = positionX;
    this.positionY = positionY;
    this.targetX = null;
    this.targetY = null;
    this.radius = 10;
    this.speed = 1000;
    this.isSelected = false;
    this.isMoving = false;

    // 메트릭스에 유닛 배치
    this.setUnitInMatrix(positionX, positionY, this.radius, 1);
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
    const prevPositionX = this.positionX;
    const prevPositionY = this.positionY;
    const calculatedDistanceX = Math.ceil(Math.cos(angle) * this.speed * diff);
    const calculatedDistanceY = Math.ceil(Math.sin(angle) * this.speed * diff);

    const newPositionXWithMove = this.getNewPositionXWithMove(
      calculatedDistanceX
    );
    const newPositionYWithMove = this.getNewPositionYWithMove(
      calculatedDistanceY
    );

    // 이전 위치와 완전 동일하다면
    if (
      newPositionXWithMove === prevPositionX &&
      newPositionYWithMove === prevPositionY
    )
      return;

    this.setUnitInMatrix(prevPositionX, prevPositionY, this.radius, 0);

    // 이동할 위치에 다른 유닛이 이미 존재한다면
    if (
      this.checkUnitInMatrix(
        newPositionXWithMove,
        newPositionYWithMove,
        this.radius
      )
    ) {
      return;
    }

    this.positionX = newPositionXWithMove;
    this.positionY = newPositionYWithMove;

    this.setUnitInMatrix(
      newPositionXWithMove,
      newPositionYWithMove,
      this.radius,
      1
    );

    if (this.getDistanceBetweenTarget() <= 1) this.isMoving = false;
  },

  setUnitInMatrix: function (positionX, positionY, radius, type) {
    for (let y = positionY - radius; y < positionY + radius; y++) {
      for (let x = positionX - radius; x < positionX + radius; x++) {
        this.gameSystem.matrix[y][x] = type;
      }
    }
  },

  checkUnitInMatrix: function (positionX, positionY, radius) {
    for (let y = positionY - radius; y < positionY + radius; y++) {
      for (let x = positionX - radius; x < positionX + radius; x++) {
        if (this.gameSystem.matrix[y][x] !== 0) {
          return true;
        }
      }
    }

    return false;
  },

  getNewPositionXWithMove: function (calculatedDistanceX) {
    const newPositionXWithMove = this.positionX + calculatedDistanceX;

    if (
      (calculatedDistanceX > 0 && newPositionXWithMove >= this.targetX) ||
      (calculatedDistanceX < 0 && newPositionXWithMove <= this.targetX)
    ) {
      return this.targetX;
    } else return newPositionXWithMove;
  },

  getNewPositionYWithMove: function (calculatedDistanceY) {
    const newPositionYWithMove = this.positionY + calculatedDistanceY;

    if (
      (calculatedDistanceY > 0 && newPositionYWithMove >= this.targetY) ||
      (calculatedDistanceY < 0 && newPositionYWithMove <= this.targetY)
    ) {
      return this.targetY;
    } else return newPositionYWithMove;
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

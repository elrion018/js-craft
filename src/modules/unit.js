export const Unit = {
  unitInit: function (positionX, positionY, id, gameSystem) {
    this.gameSystem = gameSystem;
    this.type = 'unit';
    this.id = `unit-${id}`;
    this.positionX = positionX;
    this.positionY = positionY;
    this.startX = null;
    this.startY = null;
    this.targetX = null;
    this.targetY = null;
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
  getID: function () {
    return this.id;
  },

  getIsSelected: function () {
    return this.isSelected;
  },

  setIsSelected: function (isSelected) {
    this.isSelected = isSelected;
  },

  setTargetForMove: function (targetX, targetY) {
    this.isMoving = true;
    this.isMining = false;
    this.startX = this.positionX;
    this.startY = this.positionY;
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

    // 이동할 위치에 다른 유닛이 이미 존재하는 지 체크
    const unitExistCheckResult = this.checkObjectInMatrix(
      newPositionXWithMove,
      newPositionYWithMove,
      this.radius,
      this.id
    );

    if (unitExistCheckResult && this.isMining) {
      const tempX = this.targetX;
      const tempY = this.targetY;

      this.targetX = this.startX;
      this.targetY = this.startY;
      this.startX = tempX;
      this.startY = tempY;

      return;
    }

    if (unitExistCheckResult) return;

    this.setUnitInMatrix(prevPositionX, prevPositionY, this.radius, 0);

    this.positionX = newPositionXWithMove;
    this.positionY = newPositionYWithMove;

    this.setUnitInMatrix(
      newPositionXWithMove,
      newPositionYWithMove,
      this.radius,
      this.id
    );

    const distanceBetweenTarget = this.getDistanceBetweenTarget();

    if (distanceBetweenTarget <= 1 && this.isMining) {
      const tempX = this.targetX;
      const tempY = this.targetY;

      this.targetX = this.startX;
      this.targetY = this.startY;
      this.startX = tempX;
      this.startY = tempY;

      return;
    }

    if (distanceBetweenTarget <= 1) {
      this.isMoving = false;
    }
  },

  setUnitInMatrix: function (positionX, positionY, radius, id) {
    for (let y = positionY - radius; y < positionY + radius; y++) {
      for (let x = positionX - radius; x < positionX + radius; x++) {
        this.gameSystem.setMatrix(x, y, id);
      }
    }
  },

  checkObjectInMatrix: function (positionX, positionY, radius, id) {
    const matrix = this.gameSystem.getMatrix();

    for (let y = positionY - radius; y < positionY + radius; y++) {
      for (let x = positionX - radius; x < positionX + radius; x++) {
        if (matrix[y][x] !== id && matrix[y][x] !== 0) {
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

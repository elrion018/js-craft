import { Unit } from './Unit.js';

export const Workman = {
  workmanInit: function (positionX, positionY, id, gameSystem) {
    this.unitInit(positionX, positionY, id, gameSystem);
    this.subtype = 'workman';
    this.isMining = false;
    this.radius = 10;
    this.speed = 250;
    this.targetResource = {};
    this.targetHeadquarters = {};

    this.setUnitInMatrix(positionX, positionY, this.radius, this.id);
  },

  setTargetForMining: function (targetResource, targetX, targetY) {
    this.isMining = true;

    this.targetHeadquarters = {};
    this.startX = this.positionX;
    this.startY = this.positionY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.targetResource = targetResource;

    this.pathIndex = 0;
    this.paths = this.searchPathsForMoving(
      this.startX,
      this.startY,
      this.targetX,
      this.targetY
    );
  },

  mine: function (diff) {
    let prevPathIndex = this.pathIndex;

    // paths 배열 내에서 index가 바뀌게끔 컨트롤
    if (!(this.pathIndex >= 0 && this.pathIndex <= this.paths.length - 1))
      return;
    const distance = Math.floor(1 * this.speed * diff);
    this.pathIndex =
      this.pathIndex + distance < this.paths.length - 1
        ? this.pathIndex + distance
        : this.paths.length - 1;

    const newPositionXWithMove = this.paths[this.pathIndex][0];
    const newPositionYWithMove = this.paths[this.pathIndex][1];

    // 이전 위치와 완전 동일하다면
    if (
      newPositionXWithMove === this.positionX &&
      newPositionYWithMove === this.positionY
    )
      return;

    // 이동할 위치에 다른 오브젝트가 이미 존재하는 지 확인
    const objectInPosition = this.checkObjectInPosition(
      newPositionXWithMove,
      newPositionYWithMove,
      this.radius,
      this.id
    );

    // 오브젝트가 target resource라면
    if (
      Object.keys(this.targetResource).length &&
      objectInPosition === this.targetResource.id
    ) {
      console.log('call');
      // this.pathIndex = 0
      // return
    }

    if (objectInPosition) {
      // 이전 인덱스로 돌아가서 기다린다.
      this.pathIndex = prevPathIndex;

      return;
    }

    // 위치 갱신
    this.setUnitInMatrix(this.positionX, this.positionY, this.radius, 0);
    this.setUnitInMatrix(newPositionXWithMove, newPositionYWithMove);

    this.positionX = newPositionXWithMove;
    this.positionY = newPositionYWithMove;

    if (this.pathIndex === this.paths.length - 1) {
      this.paths = []; // 경로 초기화
      this.pathIndex = 0; // 경로 인덱스 초기화
    }
  },

  checkObjectInPosition: function (positionX, positionY) {
    const matrix = this.gameSystem.getMatrix();

    for (let y = positionY - this.radius; y < positionY + this.radius; y++) {
      for (let x = positionX - this.radius; x < positionX + this.radius; x++) {
        if (matrix[y][x] !== this.id && matrix[y][x] !== 0) {
          return matrix[y][x];
        }
      }
    }

    return null;
  },

  searchPathsForMining: function (startX, startY, targetX, targetY) {
    return aStar({
      matrix: this.gameSystem.getMatrix(),
      startX,
      startY,
      targetX,
      targetY,
      unit: this,
    });
  },
};

Object.setPrototypeOf(Workman, Unit);

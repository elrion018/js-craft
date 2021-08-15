import { Unit } from './Unit.js';

export const Workman = {
  workmanInit: function (positionX, positionY, id, gameSystem) {
    this.unitInit(positionX, positionY, id, gameSystem);
    this.subtype = 'workman';
    this.isMining = false;
    this.radius = 10;
    this.speed = 1000;
    this.targetResource = {};
    this.targetHeadquarters = {};

    this.setUnitInMatrix(positionX, positionY, this.radius, this.id);
  },

  setTargetForMining: function (targetResource, targetX, targetY) {
    this.isMining = true;
    this.isMoving = true;
    this.startX = this.positionX;
    this.startY = this.positionY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.targetResource = targetResource;
  },

  // 가장 가까운 본부(커맨더 센터 등)을 BFS를 통해 찾는 메서드
  searchTargetHeadquarters: function (startX, startY) {
    const matrix = this.gameSystem.getMatrix();

    // 방문한 위치를 저장하가 위한 visited 배열 생성
    const visited = Array.from({ length: matrix.length }, () =>
      Array.from({ length: matrix[0].length }, () => 0)
    );

    // 시작 위치를 큐에 넣어 준다.
    const queue = [[startX, startY]];

    // 시작 위치는 방문 처리
    visited[startY][startX] = true;
  },

  BFSForSearch: function () {},
};

Object.setPrototypeOf(Workman, Unit);

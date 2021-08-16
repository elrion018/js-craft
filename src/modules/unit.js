import { shuffle } from '../utils/shuffle.js';
import { getPaths } from '../utils/getPaths.js';

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
    this.paths = [];
    this.pathIndex = 0;
  },

  updateStatus: function (diff) {
    if (this.isMoving && this.paths.length) {
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
    this.startX = this.positionX;
    this.startY = this.positionY;
    this.targetX = targetX;
    this.targetY = targetY;
  },

  // 목표 지점에 도달하기 위한 최단거리 경로를 구하는 메소드
  searchForMoving: function (startX, startY, targetX, targetY) {
    const matrix = this.gameSystem.getMatrix();

    // 방문한 위치를 저장하가 위한 visited 배열 생성
    const YLength = matrix.length;
    const XLength = matrix[0].length;
    const visited = Array.from({ length: YLength }, () =>
      Array.from({ length: XLength }, () => 0)
    );

    // 시작 위치를 큐에 넣어 준다.
    const queue = [[startX, startY]];

    // 시작 위치는 방문 처리
    visited[startY][startX] = 999;

    // 방향 이동 처리를 위한 배열 선언

    const defaultDX = [-1, 1, -1, 1, 1, -1, 0, 0]; // 북서 북동 남서 남동 동 서 남 북
    const defaultDY = [-1, -1, 1, 1, 0, 0, 1, -1];

    const dx = [1, -1, 0, 0];
    const dy = [0, 0, 1, -1];

    while (queue.length) {
      let [x, y] = queue.shift();

      // let dx = shuffle(defaultDX);
      // let dy = shuffle(defaultDY);

      for (let i = 0; i < dx.length; i++) {
        let ax = x + dx[i];
        let ay = y + dy[i];

        if (ax === targetX && ay === targetY && visited[ay][ax] === 0) {
          visited[ay][ax] = [x, y];

          return getPaths(visited, [[ax, ay]], ax, ay);
        }

        if (ax >= 0 && ax < XLength && ay >= 0 && ay < YLength) {
          let objectID = matrix[ay][ax];

          if (
            (objectID === 0 || objectID === this.id) &&
            visited[ay][ax] === 0
          ) {
            visited[ay][ax] = [x, y];

            queue.push([ax, ay]);
          }
        }
      }
    }

    return [];
  },

  move: function (diff) {
    // paths 배열 내에서 index가 바뀌게끔 컨트롤
    if (this.pathIndex >= 0 && this.pathIndex <= this.paths.length - 1) {
      const distance = Math.floor(1 * this.speed * diff);
      this.pathIndex =
        this.pathIndex + distance < this.paths.length - 1
          ? this.pathIndex + distance
          : this.paths.length - 1;
    }

    const newPositionXWithMove = this.paths[this.pathIndex][0];
    const newPositionYWithMove = this.paths[this.pathIndex][1];

    // 이전 위치와 완전 동일하다면
    if (
      newPositionXWithMove === this.positionX &&
      newPositionYWithMove === this.positionY
    )
      return;

    // 이동할 위치에 다른 오브젝트가 이미 존재하는 지 확인
    const objectInPosition = this.getObjectInPosition(
      newPositionXWithMove,
      newPositionYWithMove,
      this.radius,
      this.id
    );

    // 존재한다면
    if (objectInPosition) {
      // 충돌이 일어난 것이므로 경로를 재탐색 함
      this.searchForMoving(
        this.positionX,
        this.positionY,
        this.targetX,
        this.targetY
      );
    }

    // 위치 갱신
    this.setUnitInMatrix(this.positionX, this.positionY, this.radius, 0);
    this.setUnitInMatrix(
      newPositionXWithMove,
      newPositionYWithMove,
      this.radius,
      this.id
    );

    this.positionX = newPositionXWithMove;
    this.positionY = newPositionYWithMove;

    if (this.pathIndex === this.paths.length - 1) {
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

  // 해당 위치에
  getObjectInPosition: function (positionX, positionY, radius, id) {
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

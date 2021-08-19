import { shuffle } from '../utils/shuffle.js';
import { getPaths } from '../utils/getPaths.js';
import { priorityQueue } from '../utils/priorityQueue.js';

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
    const YLength = matrix.length;
    const XLength = matrix[0].length;

    // 방향 설정을 위한 dx, dy 배열
    const dx = [1, -1, 0, 0, -1, 1, -1, 1]; // 동 서 남 북 북서 북동 남서 남동
    const dy = [0, 0, 1, -1, -1, -1, 1, 1];

    // adjacent list 생성
    const adjList = Array.from({ length: XLength * YLength }, () => []);

    let count = -1;

    // adjacent list 채우기
    for (let y = 0; y < YLength; y++) {
      for (let x = 0; x < XLength; x++) {
        count += 1;

        for (let k = 0; k < dx.length; k++) {
          let ax = x + dx[k];
          let ay = y + dy[k];

          if (ax >= 0 && ax < XLength && ay >= 0 && ay < YLength) {
            if (Math.abs(dx[k]) === Math.abs(dy[k])) {
              adjList[count].push([1.4, ay * XLength + ax]);
            } else {
              adjList[count].push([1, ay * XLength + ax]);
            }
          }
        }
      }
    }

    // 에이스타 알고리즘 시작
    // 초기화

    const inf = Number.MAX_SAFE_INTEGER;
    const pq = Object.create(priorityQueue);
    pq.priorityQueueInit();
    const distances = Array.from({ length: XLength * YLength }, () => inf);
    const visited = Array.from({ length: YLength }, () =>
      Array.from({ length: XLength }, () => 0)
    );

    distances[startY * XLength + startX] = 0;
    visited[startY][startX] = 999;

    pq.enqueue(distances[startY * XLength + startX], startY * XLength + startX);

    while (!pq.isEmpty()) {
      let { priority: nowDistance, value: nowNode } = pq.dequeue();

      if (distances[nowNode] !== nowDistance) continue;

      let nowY = Math.floor(nowNode / XLength);
      let nowX = nowNode % XLength;

      if (nowY === targetY && nowX === targetX) {
        console.log('call');
        break;
      }

      let euclideanDistance = Math.sqrt(
        Math.pow(targetX - nowX, 2) + Math.pow(targetY - nowY, 2)
      );

      for (let i = 0; i < adjList[nowNode].length; i++) {
        let nextNode = adjList[nowNode][i][1];
        let nextY = Math.floor(nextNode / XLength);
        let nextX = nextNode % XLength;

        // 장애물이 있다면 피하도록 처리
        if (matrix[nextY][nextX] !== 0 && matrix[nextY][nextX] !== this.id)
          continue;

        let weight = adjList[nowNode][i][0];

        let calculatedDistance =
          distances[nowNode] + weight + euclideanDistance;

        if (distances[nextNode] > calculatedDistance) {
          distances[nextNode] = calculatedDistance;
          visited[nextY][nextX] = [
            nowNode % XLength,
            Math.floor(nowNode / XLength),
          ];

          pq.enqueue(distances[nextNode], nextNode);
        }
      }
    }

    return getPaths(visited, [[targetX, targetY]], targetX, targetY);
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

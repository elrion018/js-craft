import { Unit } from './Unit.js';
import { getPaths } from '../utils/getPaths.js';

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
    this.isMoving = true;
    this.targetHeadquarters = {};
    this.startX = this.positionX;
    this.startY = this.positionY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.targetResource = targetResource;
  },

  setTargetForMoveToWorkman: function (targetX, targetY) {
    this.isMoving = true;
    this.isMining = false;
    this.targetHeadquarters = {};
    this.startX = this.positionX;
    this.startY = this.positionY;
    this.targetX = targetX;
    this.targetY = targetY;

    this.paths = this.searchPathsForMoving(
      this.startX,
      this.startY,
      this.targetX,
      this.targetY
    );
  },

  // 가장 가까운 본부(커맨더 센터 등)을 BFS를 통해 찾는 메서드
  // 찾으면 targetHeadQuater 도 설정해준다.
  searchForMining: function (startX, startY) {
    // 일단 빌딩 object 구하기
    const buildingsObjects = {};

    this.gameSystem.getBuildings().forEach(building => {
      buildingsObjects[building.id] = building;
    });

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
    visited[startY][startX] = [[startX, startY]];

    // 방향 이동 처리를 위한 배열 선언
    const dx = [1, -1, 0, 0];
    const dy = [0, 0, 1, -1];

    while (queue.length) {
      let [x, y] = queue.shift();

      for (let i = 0; i < 4; i++) {
        let ax = x + dx[i];
        let ay = y + dy[i];

        if (ax >= 0 && ax < XLength && ay >= 0 && ay < YLength) {
          let objectID = matrix[ay][ax];
          let building = buildingsObjects[objectID];

          if (
            (objectID === 0 || objectID === this.targetResource.id) &&
            visited[ay][ax] === 0
          ) {
            visited[ay][ax] = visited[y][x];
            queue.push([ax, ay]);

            continue;
          }

          if (
            objectID !== 0 &&
            objectID !== this.targetResource.id &&
            building &&
            visited[ay][ax] === 0
          ) {
            visited[ay][ax] = visited[y][x];
            this.targetHeadquarters = building;

            this.paths = getPaths(visited, [[ax, ay]], ax, ay);

            return true;
          }
        }
      }
    }

    return false;
  },

  mine: function (diff) {
    const prevPositionX = this.positionX;
    const prevPositionY = this.positionY;

    // paths 배열 내에서 index가 바뀌게끔 컨트롤
    if (this.pathIndex >= 0 && this.pathIndex <= this.paths.length - 1) {
      const distance = Math.floor(1 * 100 * diff);
      this.pathIndex =
        this.pathIndex + distance < this.paths.length - 1
          ? this.pathIndex + distance
          : this.paths.length - 1;
    }

    const newPositionXWithMove = this.paths[this.pathIndex][0];
    const newPositionYWithMove = this.paths[this.pathIndex][1];

    // 이전 위치와 동일하다면
    if (
      newPositionXWithMove === prevPositionX &&
      newPositionYWithMove === prevPositionY
    )
      return;

    // 이동할 위치에 다른 유닛이 이미 존재하는 지 체크
    const unitExistCheckResult = this.getObjectInPosition(
      newPositionXWithMove,
      newPositionYWithMove,
      this.radius,
      this.id
    );

    // 충돌이 일어났고 채굴 중이라면
    if (
      unitExistCheckResult &&
      this.isMining &&
      Object.keys(this.targetHeadquarters).length === 0
    ) {
      this.pathIndex = 0;
      this.paths = this.searchTargetHeadquarters(
        this.positionX,
        this.positionY
      );

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
};

Object.setPrototypeOf(Workman, Unit);

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
    this.isMoving = true;
    this.startX = this.positionX;
    this.startY = this.positionY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.targetResource = targetResource;
  },

  // 가장 가까운 본부(커맨더 센터 등)을 BFS를 통해 찾는 메서드
  searchTargetHeadquarters: function (startX, startY) {
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
    visited[startY][startX] = true;

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
            visited[ay][ax] !== 1
          ) {
            visited[ay][ax] = 1;
            queue.push([ax, ay]);
          }

          if (
            objectID !== 0 &&
            objectID !== this.targetResource.id &&
            building &&
            visited[ay][ax] !== 1
          ) {
            this.targetHeadquarters = building;

            return [ax, ay];
          }
        }
      }
    }

    return null;
  },
};

Object.setPrototypeOf(Workman, Unit);

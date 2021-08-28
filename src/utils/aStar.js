import { priorityQueue } from './priorityQueue.js';
import { getPaths } from './getPaths.js';

// 에이스타 알고리즘
export const aStar = function ({
  matrix,
  startX,
  startY,
  targetX,
  targetY,
  unit,
}) {
  // 타겟 조정
  ({ targetX, targetY } = adjustTarget({ targetX, targetY, matrix, unit }));

  const YLength = matrix.length;
  const XLength = matrix[0].length;

  // 방향 설정을 위한 dx, dy 배열
  const dx = [1, -1, 0, 0, -1, 1, -1, 1]; // 동 서 남 북 북서 북동 남서 남동
  const dy = [0, 0, 1, -1, -1, -1, 1, 1];

  // adjacent list 초기화
  const adjList = initAdjList({ XLength, YLength, dx, dy });

  // visited 초기화
  const visited = initVisited(XLength, YLength);

  // distances 초기화
  const distances = initDistances(XLength, YLength);

  // 우선순위 큐 초기화
  const pq = Object.create(priorityQueue);
  pq.priorityQueueInit();

  const targetID =
    matrix[targetY][targetX] !== 0 ? matrix[targetY][targetX] : undefined;

  // 시작점 처리하고 우선순위 큐에 넣기
  distances[startY * XLength + startX] = 0;
  visited[startY][startX] = 999;

  pq.enqueue(distances[startY * XLength + startX], startY * XLength + startX);

  // 탐색 시작

  while (!pq.isEmpty()) {
    let { priority: nowDistance, value: nowNode } = pq.dequeue();

    if (distances[nowNode] !== nowDistance) continue;

    let nowY = Math.floor(nowNode / XLength);
    let nowX = nowNode % XLength;

    if (nowY === targetY && nowX === targetX) {
      return getPaths(visited, [[targetX, targetY]], targetX, targetY);
    }

    if (targetID && matrix[nowY][nowX] === targetID) {
      return getPaths(visited, [[nowX, nowY]], nowX, nowY);
    }

    let euclideanDistance = Math.sqrt(
      Math.pow(targetX - nowX, 2) + Math.pow(targetY - nowY, 2)
    );

    for (let i = 0; i < adjList[nowNode].length; i++) {
      let nextNode = adjList[nowNode][i][1];
      let nextY = Math.floor(nextNode / XLength);
      let nextX = nextNode % XLength;

      // 장애물이 있다면 피하도록 처리
      if (
        checkExistingObject({
          nextX,
          nextY,
          matrix,
          unit,
          targetID,
        })
      ) {
        continue;
      }

      let weight = adjList[nowNode][i][0];

      let calculatedDistance = distances[nowNode] + weight + euclideanDistance;

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
};

// adjacent list 를 초기화하는 함수
const initAdjList = function ({ XLength, YLength, dx, dy }) {
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
            // 대각선 이동은 가중치를 1.4로
            adjList[count].push([1.4, ay * XLength + ax]);
          } else {
            // 직선 이동은 가중치를 1로
            adjList[count].push([1, ay * XLength + ax]);
          }
        }
      }
    }
  }

  return adjList;
};

const initVisited = function (XLength, YLength) {
  return Array.from({ length: YLength }, () =>
    Array.from({ length: XLength }, () => 0)
  );
};

/**
 * distance 배열을 초기화하는 함수
 * @param {*} XLength
 * @param {*} YLength
 * @returns
 */
const initDistances = function (XLength, YLength) {
  const inf = Number.MAX_SAFE_INTEGER;

  return Array.from({ length: XLength * YLength }, () => inf);
};

/**
 * 경로 중에 장애물이 있는지 체크하는 함수
 * @param {object}
 * @returns
 */
const checkExistingObject = function ({
  nextX,
  nextY,
  matrix,
  unit,
  targetID,
}) {
  const YLength = matrix.length;
  const XLength = matrix[0].length;

  if (
    (nextY + unit.radius < YLength &&
      matrix[nextY + unit.radius][nextX] !== 0 &&
      matrix[nextY + unit.radius][nextX] !== unit.id &&
      (matrix[nextY + unit.radius][nextX] !== unit.id) !== targetID) ||
    (nextY - unit.radius >= 0 &&
      matrix[nextY - unit.radius][nextX] !== 0 &&
      matrix[nextY - unit.radius][nextX] !== unit.id &&
      matrix[nextY - unit.radius][nextX] !== targetID) ||
    (nextX + unit.radius < XLength &&
      matrix[nextY][nextX + unit.radius] !== 0 &&
      matrix[nextY][nextX + unit.radius] !== unit.id &&
      matrix[nextY][nextX + unit.radius] !== targetID) ||
    (nextX - unit.radius >= 0 &&
      matrix[nextY][nextX - unit.radius] !== 0 &&
      matrix[nextY][nextX - unit.radius] !== unit.id &&
      matrix[nextY][nextX - unit.radius] !== targetID) ||
    (nextY + unit.radius < YLength &&
      nextX + unit.radius < XLength &&
      matrix[nextY + unit.radius][nextX + unit.radius] !== 0 &&
      matrix[nextY + unit.radius][nextX + unit.radius] !== unit.id &&
      matrix[nextY + unit.radius][nextX + unit.radius] !== targetID) ||
    (nextY + unit.radius < YLength &&
      nextX - unit.radius >= 0 &&
      matrix[nextY + unit.radius][nextX - unit.radius] !== 0 &&
      matrix[nextY + unit.radius][nextX - unit.radius] !== unit.id &&
      matrix[nextY + unit.radius][nextX - unit.radius] !== targetID) ||
    (nextY - unit.radius >= 0 &&
      nextX + unit.radius < XLength &&
      matrix[nextY - unit.radius][nextX + unit.radius] !== 0 &&
      matrix[nextY - unit.radius][nextX + unit.radius] !== unit.id &&
      matrix[nextY - unit.radius][nextX + unit.radius] !== targetID) ||
    (nextY - unit.radius >= 0 &&
      nextX - unit.radius >= 0 &&
      matrix[nextY - unit.radius][nextX - unit.radius] !== 0 &&
      matrix[nextY - unit.radius][nextX - unit.radius] !== unit.id &&
      matrix[nextY - unit.radius][nextX - unit.radius] !== targetID)
  )
    return true;

  return false;
};

const adjustTarget = function ({ targetX, targetY, matrix, unit }) {
  const YLength = matrix.length;
  const XLength = matrix[0].length;

  if (
    targetY + unit.radius < YLength &&
    matrix[targetY + unit.radius][targetX] !== 0 &&
    matrix[targetY + unit.radius][targetX] !== unit.id
  )
    targetY -= unit.radius;

  if (
    targetY - unit.radius >= 0 &&
    matrix[targetY - unit.radius][targetX] !== 0 &&
    matrix[targetY - unit.radius][targetX] !== unit.id
  )
    targetY += unit.radius;

  if (
    targetX + unit.radius < XLength &&
    matrix[targetY][targetX + unit.radius] !== 0 &&
    matrix[targetY][targetX + unit.radius] !== unit.id
  )
    targetX -= unit.radius;

  if (
    targetX - unit.radius >= 0 &&
    matrix[targetY][targetX - unit.radius] !== 0 &&
    matrix[targetY][targetX - unit.radius] !== unit.id
  )
    targetX += unit.radius;

  if (
    targetY + unit.radius < YLength &&
    targetX + unit.radius < XLength &&
    matrix[targetY + unit.radius][targetX + unit.radius] !== 0 &&
    matrix[targetY + unit.radius][targetX + unit.radius] !== unit.id
  ) {
    targetX -= unit.radius;
    targetY -= unit.radius;
  }

  if (
    targetY + unit.radius < YLength &&
    targetX - unit.radius >= 0 &&
    matrix[targetY + unit.radius][targetX - unit.radius] !== 0 &&
    matrix[targetY + unit.radius][targetX - unit.radius] !== unit.id
  ) {
    targetX += unit.radius;
    targetY -= unit.radius;
  }

  if (
    targetY - unit.radius >= 0 &&
    targetX + unit.radius < XLength &&
    matrix[targetY - unit.radius][targetX + unit.radius] !== 0 &&
    matrix[targetY - unit.radius][targetX + unit.radius] !== unit.id
  ) {
    targetX -= unit.radius;
    targetY += unit.radius;
  }

  if (
    targetY - unit.radius >= 0 &&
    targetX - unit.radius >= 0 &&
    matrix[targetY - unit.radius][targetX - unit.radius] !== 0 &&
    matrix[targetY - unit.radius][targetX - unit.radius] !== unit.id
  ) {
    targetX += unit.radius;
    targetY += unit.radius;
  }

  return {
    targetX,
    targetY,
  };
};

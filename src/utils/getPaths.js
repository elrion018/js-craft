export const getPaths = function (visited, tempPath, x, y) {
  if (visited[y][x] !== 0 && visited[y][x] !== 999) {
    const [nextX, nextY] = visited[y][x];
    tempPath.push([nextX, nextY]);

    return getPaths(visited, tempPath, nextX, nextY);
  }

  return tempPath.reverse();
};

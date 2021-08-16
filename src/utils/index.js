export const getPaths = function (visited, tempPath, x, y) {
  if (visited[y][x] !== 0 && visited[y][x] !== 999) {
    const [nextX, nextY] = visited[y][x];
    tempPath.push([nextX, nextY]);

    return getPaths(visited, tempPath, nextX, nextY);
  } else {
    return tempPath.reverse();
  }
};

export const shuffle = function (a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
};

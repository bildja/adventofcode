import { fitsTheMatr } from "../utils/fitsTheMatr";
import { day17input } from "./day17input";

const smallRawInput = `
2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;

const parse = (rawInput: string) =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => line.split("").map(Number));

type Coord = [number, number];
type QueueStep = {
  coord: Coord;
  path: Coord[];
  curSum: number;
};

const cEq = ([i1, j1]: Coord, [i2, j2]: Coord) => i1 === i2 && j1 === j2;

const getDirectionKey = ([i1, j1]: Coord, [i2, j2]: Coord): string => {
  const coordDiff = (i2 - i1) * 10 + (j2 - j1);
  const symbolMap: Record<number, string> = {
    10: "v",
    "-10": "^",
    1: ">",
    "-1": "<",
  };
  return symbolMap[coordDiff];
};

const getLastNPositions = (path: Coord[], coord: Coord, count = 4) => [
  ...(path.length > count ? path.slice(path.length - (count - 1)) : path),
  coord,
];

const getDirectionKeyFromPath = (path: Coord[], coord: Coord) => {
  const lastPositions = getLastNPositions(path, coord, 4);
  //   const keyPath: string[] = [];
  const n = lastPositions.length;
  if (n < 2) {
    return "";
  }

  let i = n - 1;
  const lastDirectionKey = getDirectionKey(
    lastPositions[i - 1],
    lastPositions[i]
  );
  let count = 0;
  while (
    i >= 1 &&
    getDirectionKey(lastPositions[i - 1], lastPositions[i]) === lastDirectionKey
  ) {
    count++;
    i--;
  }
  return `${lastDirectionKey}${count}`;
  //   for (let i = lastPositions.length - 1; i >= 1; i--) {
  //     keyPath.unshift(getDirectionKey(lastPositions[i - 1], lastPositions[i]));
  //   }
  //   return keyPath.join("");
};

const getCoordKey = ([i, j]: Coord) => `${i},${j}`;

const getVisitedKey = (path: Coord[], coord: Coord): string => {
  const coordKey = getCoordKey(coord);
  const directionKey = getDirectionKeyFromPath(path, coord);
  const prevKey = path.length > 0 ? getDirectionKey(path.at(-1)!, coord) : "";
  return `${directionKey || prevKey}||${coordKey}`;
};

const isAllowed = (coord: Coord, path: Coord[], curCoord: Coord) => {
  if (path.length < 3) {
    return true;
  }

  const lastFourPositions = getLastNPositions([...path, curCoord], coord, 5);
  const lastFourDiff = (lastFourPositions as Coord[]).reduce(
    (acc, [i, j], ind) => {
      if (ind === 0) {
        return acc;
      }
      const [prevI, prevJ] = lastFourPositions[ind - 1];
      return [...acc, [i - prevI, j - prevJ]] as Coord[];
    },
    [] as Coord[]
  );
  const allFourSame = (coordNumber: 0 | 1) =>
    Math.abs(
      lastFourDiff.map((coord) => coord[coordNumber]).reduce((a, b) => a + b, 0)
    ) === 4;

  for (const coordNum of [0, 1] as const) {
    if (allFourSame(coordNum)) {
      return (
        coord[coordNum] - curCoord[coordNum] !== lastFourDiff.at(-1)![coordNum]
      );
    }
  }
  return true;
};

const day17p1 = (rawInput: string) => {
  const map = parse(rawInput);

  const insertIntoQueue = (queue: QueueStep[], step: QueueStep) => {
    const getValue = ({ curSum, coord: [i, j] }: QueueStep) =>
      curSum + map[i][j];
    const queueValues = queue.map(getValue);
    const stepValue = getValue(step);
    let start = 0;
    let end = queue.length - 1;
    while (start < end) {
      const mid = Math.floor((start + end) / 2);
      if (stepValue < queueValues[mid]) {
        end = mid;
      } else {
        start = mid + 1;
      }
    }
    queue.splice(start, 0, step);
  };

  const start: Coord = [0, 0];
  const target: Coord = [map.length - 1, map[map.length - 1].length - 1];

  let queue: QueueStep[] = [{ coord: start, path: [], curSum: 0 }];
  const memo: Record<string, number> = {};
  const targetValues: number[] = [];

  let iters = 0;
  const startTime = performance.now();

  while (queue.length) {
    iters++;
    if (iters % 10 ** 5 === 0) {
      console.log(
        iters,
        Object.keys(memo).length,
        queue.length,
        `${((performance.now() - startTime) / 1000).toFixed(2)}s`
      );
    }
    const { coord: curCoord, path, curSum } = queue.shift()!;
    const [curI, curJ] = curCoord;
    const newPath: Coord[] = [...path, curCoord];
    const visitedKey = getVisitedKey(path, curCoord);
    const newCurSum = curSum + map[curI][curJ];
    if (cEq(curCoord, target)) {
      memo[visitedKey] = Math.min(newCurSum, memo[visitedKey] ?? Infinity);
      targetValues.push(memo[visitedKey]);
      continue;
    }
    if (memo[visitedKey] <= newCurSum) {
      continue;
    }
    memo[visitedKey] = newCurSum;

    const allNextSteps: Coord[] = [
      [curI, curJ + 1],
      [curI, curJ - 1],
      [curI + 1, curJ],
      [curI - 1, curJ],
    ];
    const isStepBackwards = (coord: Coord) =>
      path.length > 0 && cEq(path.at(-1)!, coord);

    const nextSteps: Coord[] = allNextSteps
      .filter((coord) => fitsTheMatr(coord, map))
      .filter((coord) => !isStepBackwards(coord))
      .filter((coord) => isAllowed(coord, path, curCoord))
      .filter((coord) => {
        const nextVisitedKey = getVisitedKey(newPath, coord);
        const [nextI, nextJ] = coord;
        return (
          memo[nextVisitedKey] === undefined ||
          memo[nextVisitedKey] > newCurSum + map[nextI][nextJ]
        );
      });
    if (!nextSteps.length) {
      continue;
    }

    for (const nextStep of nextSteps) {
      insertIntoQueue(queue, {
        coord: nextStep,
        path: newPath,
        curSum: newCurSum,
      });
    }
  }

  return Math.min(...targetValues) - map[0][0];
};

const day17p2 = (rawInput: string) => {
  const map = parse(rawInput);

  const insertIntoQueue = (queue: QueueStep[], step: QueueStep) => {
    const getValue = ({ curSum, coord: [i, j] }: QueueStep) =>
      curSum + map[i][j];
    const queueValues = queue.map(getValue);
    const stepValue = getValue(step);
    let start = 0;
    let end = queue.length - 1;
    while (start < end) {
      const mid = Math.floor((start + end) / 2);
      if (stepValue < queueValues[mid]) {
        end = mid;
      } else {
        start = mid + 1;
      }
    }
    queue.splice(start, 0, step);
  };

  const start: Coord = [0, 0];
  const target: Coord = [map.length - 1, map[map.length - 1].length - 1];

  let queue: QueueStep[] = [{ coord: start, path: [], curSum: 0 }];
  const memo: Record<string, number> = {};
  const targetValues: number[] = [];

  while (queue.length) {
    const { coord: curCoord, path, curSum } = queue.shift()!;
    const [curI, curJ] = curCoord;
    const newPath: Coord[] = [...path, curCoord];
    const visitedKey = getVisitedKey(path, curCoord);
    const newCurSum = curSum + map[curI][curJ];
    if (cEq(curCoord, target)) {
      memo[visitedKey] = Math.min(newCurSum, memo[visitedKey] ?? Infinity);
      targetValues.push(memo[visitedKey]);
      continue;
    }
    if (memo[visitedKey] <= newCurSum) {
      continue;
    }
    memo[visitedKey] = newCurSum;

    const allNextSteps: Coord[] = [
      [curI, curJ + 1],
      [curI, curJ - 1],
      [curI + 1, curJ],
      [curI - 1, curJ],
    ];
    const isStepBackwards = (coord: Coord) =>
      path.length > 0 && cEq(path.at(-1)!, coord);

    const nextSteps: Coord[] = allNextSteps
      .filter((coord) => fitsTheMatr(coord, map))
      .filter((coord) => !isStepBackwards(coord))
      .filter((coord) => isAllowed(coord, path, curCoord))
      .filter((coord) => {
        const nextVisitedKey = getVisitedKey(newPath, coord);
        const [nextI, nextJ] = coord;
        return (
          memo[nextVisitedKey] === undefined ||
          memo[nextVisitedKey] > newCurSum + map[nextI][nextJ]
        );
      });
    if (!nextSteps.length) {
      continue;
    }

    for (const nextStep of nextSteps) {
      insertIntoQueue(queue, {
        coord: nextStep,
        path: newPath,
        curSum: newCurSum,
      });
    }
  }

  return Math.min(...targetValues) - map[0][0];
};

console.log(day17p1(smallRawInput));
console.log(day17p1(day17input));

console.log("\n ========== P2 ======== \n");

console.log(day17p2(smallRawInput));

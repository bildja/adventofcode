import { Coord, cEq } from "../utils/Coord";
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

type QueueStep = {
  coord: Coord;
  path: Coord[];
  curSum: number;
};

const getDirectionKey = ([i1, j1]: Coord, [i2, j2]: Coord): Direction => {
  const coordDiff = (i2 - i1) * 10 + (j2 - j1);
  const symbolMap: Record<number, Direction> = {
    10: "v",
    "-10": "^",
    1: ">",
    "-1": "<",
  };
  return symbolMap[coordDiff];
};

type Direction = "^" | "v" | ">" | "<";

const getDirectionKeyData = (
  path: Coord[],
  coord: Coord
): null | { direction: Direction; count: number } => {
  const lastPositions = [...path, coord];
  const n = lastPositions.length;
  if (n < 2) {
    return null;
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
  return { count, direction: lastDirectionKey };
};

const getDirectionKeyFromPath = (path: Coord[], coord: Coord) => {
  const directionKeyData = getDirectionKeyData(path, coord);
  if (!directionKeyData) {
    return "";
  }
  const { direction, count } = directionKeyData;
  return `${direction}${count}`;
};

const getCoordKey = ([i, j]: Coord) => `${i},${j}`;

const getVisitedKey = (path: Coord[], coord: Coord): string => {
  const coordKey = getCoordKey(coord);
  const directionKey = getDirectionKeyFromPath(path, coord);
  return `${directionKey}||${coordKey}`;
};

const isAllowed = (
  coord: Coord,
  path: Coord[],
  curCoord: Coord,
  min = 1,
  max = 3
) => {
  const directionKeyData = getDirectionKeyData(path, curCoord);
  if (!directionKeyData) {
    return true;
  }
  const newDirection = getDirectionKey(curCoord, coord);
  if (
    directionKeyData.count < min &&
    newDirection !== directionKeyData.direction
  ) {
    return false;
  }
  if (
    directionKeyData.count >= max &&
    directionKeyData.direction === newDirection
  ) {
    return false;
  }
  return true;
};

const day17 = (rawInput: string, min: number, max: number) => {
  const map = parse(rawInput);

  const insertIntoQueue = (queue: QueueStep[], step: QueueStep) => {
    if (!queue.length) {
      queue.push(step);
      return;
    }
    const getValue = ({ curSum, coord: [i, j] }: QueueStep) =>
      curSum + map[i][j];
    const queueValues = queue.map(getValue);
    const stepValue = getValue(step);
    if (queue.length === 1) {
      const [existingStepValue] = queueValues;
      if (existingStepValue > stepValue) {
        queue.unshift(step);
      } else {
        queue.push(step);
      }
      return;
    }

    let start = 0;
    let end = queue.length - 1;

    while (start < end) {
      const mid = Math.ceil((start + end) / 2);
      if (stepValue < queueValues[mid]) {
        end = mid - 1;
      } else {
        start = mid;
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
      .filter((coord) => isAllowed(coord, path, curCoord, min, max))
      .filter((coord) => {
        const directionKeyData = getDirectionKeyData(newPath, coord);
        if (!directionKeyData) {
          return true;
        }
        const { direction, count } = directionKeyData;
        const mustMake = min - (count - 1);

        const maxDistances: Record<Direction, number> = {
          "<": curJ,
          ">": map[curI].length - curJ - 1,
          "^": curI,
          v: map.length - curI - 1,
        };
        return maxDistances[direction] >= mustMake;
      })
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

const day17p1 = (rawInput: string) => day17(rawInput, 1, 3);
const day17p2 = (rawInput: string) => day17(rawInput, 4, 10);

const smallerInputP2 = `
111111111111
999999999991
999999999991
999999999991
999999999991`;

console.log(day17p1(smallRawInput));
console.log(day17p1(day17input));

console.log("\n ========== P2 ======== \n");

console.log(day17p2(smallRawInput));
console.log(day17p2(smallerInputP2));
console.log(day17p2(day17input));

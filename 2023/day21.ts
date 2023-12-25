import { day21input } from "./day21input";
import { Coord } from "../utils/Coord";
import { getAllNeighbours } from "../utils/allNeighbours";

const smallRawInput = `
...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;

const parse = (rawInput: string) =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => line.split(""));

const findAndReplaceStart = (map: string[][]): Coord => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "S") {
        map[i][j] = ".";
        return [i, j];
      }
    }
  }
  throw Error("no start");
};

const day21p1 = (rawInput: string, steps: number) => {
  const map = parse(rawInput);
  const n = map.length;
  const m = map[0].length;
  const start = findAndReplaceStart(map);
  const getMapPoint = ([i, j]: Coord): string => {
    i = ((i % n) + n) % n;
    j = ((j % m) + m) % m;
    return map[i][j];
  };

  const key = ([i, j]: Coord) => `${i},${j}`;
  let visitedMap = new Map<string, Coord>();
  visitedMap.set(key(start), start);

  for (let k = 0; k < steps; k++) {
    const newVisitedMap = new Map<string, Coord>();
    for (const coord of visitedMap.values()) {
      for (const neigbhour of getAllNeighbours(coord).filter(
        (coord) => getMapPoint(coord) !== "#"
      )) {
        newVisitedMap.set(key(neigbhour), neigbhour);
      }
    }
    visitedMap = newVisitedMap;
  }
  return visitedMap.size;
};

const day21p2 = (rawInput: string, steps: number) => {
  const map = parse(rawInput);
  const n = map.length;
  const m = map[0].length;
  const start = findAndReplaceStart(map);
  const getMapPoint = ([i, j]: Coord): string => {
    i = ((i % n) + n) % n;
    j = ((j % m) + m) % m;
    return map[i][j];
  };

  const key = ([i, j]: Coord) => `${i},${j}`;
  let visitedMap = new Map<string, Coord>();
  visitedMap.set(key(start), start);
  const results: number[] = [];

  for (let k = 1; k <= n * 2 + (steps % n); k++) {
    const newVisitedMap = new Map<string, Coord>();
    for (const coord of visitedMap.values()) {
      for (const neigbhour of getAllNeighbours(coord).filter(
        (coord) => getMapPoint(coord) !== "#"
      )) {
        newVisitedMap.set(key(neigbhour), neigbhour);
      }
    }
    visitedMap = newVisitedMap;
    if (k % n === steps % n) {
      results.push(visitedMap.size);
    }
  }
  // f(x) – function defining amount of visited plots based on steps
  // it happened so, it repeats every n and depends quadratically
  // f(x) = ax^2 + bx^2 + c
  // so we can calculate three times and create a system of equations:
  // f(0) = a*0^2 + b*0 + c = firstResult
  // f(1) = a*1^2 + b*1 + c = secondResult
  // f(2) = a*2^2 + b*1 + c = thirdResult

  // c = firstResult
  // a + b + firstResult = secondResult
  // -
  // 4a + 2b + firstResult = thirdResult

  // b = secondResult - firstResult - a
  // 4a + 2*secondResult - 2*firstResult - 2*a = thirdResult - firstResult
  // 2a = thirdResult - 2*secondResult + firstResult
  // a  = (thirdResult + firstResult) / 2 - secondResult

  const [firstResult, secondResult, thirdResult] = results;
  const a = (thirdResult + firstResult) / 2 - secondResult;
  const b = secondResult - firstResult - a;
  const c = firstResult;

  const x = Math.floor(steps / n);
  return a * x * x + b * x + c;
};

console.log(day21p1(smallRawInput, 6));
console.log(day21p1(day21input, 64));

console.log("\n============== P2 ============\n");
console.log(day21p2(day21input, 26501365));

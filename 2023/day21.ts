import { day21input } from "./day21input";
import { createMatr } from "../utils/createMatr";
import { Coord, cEq } from "../utils/Coord";
import { getAllNeigbhours } from "../utils/allNeighbours";
import { fitsTheMatr } from "../utils/fitsTheMatr";

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

const getPrintedMap = (
  map: string[][],
  visitedMap: boolean[][],
  currentOs: Coord[] = []
) => {
  const printedMap = createMatr(map.length, map[0].length, ".");
  for (let i = 0; i < printedMap.length; i++) {
    for (let j = 0; j < printedMap[i].length; j++) {
      printedMap[i][j] =
        visitedMap[i][j] || currentOs.filter((c) => cEq(c, [i, j])).length
          ? "O"
          : map[i][j];
    }
  }
  return printedMap.map((line) => line.join("")).join("\n");
};

const day21p1 = (rawInput: string, steps: number) => {
  const map = parse(rawInput);
  const start = findAndReplaceStart(map);
  const visitedMap = createMatr(map.length, map[0].length, false);

  const printMap = (currentOs: Coord[]) => {
    console.log(getPrintedMap(map, visitedMap, currentOs), "\n");
  };
  let currentOs: Coord[] = [start];
  const getByCoord = ([i, j]: Coord) => {
    i %= map.length;
    j %= map[i].length;
    return map[i][j];
  };

  for (let k = 0; k < steps; k++) {
    // console.log("step", k);
    // if (k % 2 === 0) {
    //   printMap(currentOs);
    // }
    const newCurrentOs: Coord[] = [];
    while (currentOs.length) {
      const [i, j] = currentOs.shift()!;
      if (k % 2 === 0 && k !== 0) {
        if (visitedMap[i][j]) {
          continue;
        }
        visitedMap[i][j] = true;
      }
      newCurrentOs.push(
        ...getAllNeigbhours([i, j])
          // .filter((coord) => fitsTheMatr(coord, map))
          .filter(([i1, j1]) => map[i1][j1] !== "#")
          .filter(([i1, j1]) => !visitedMap[i1][j1])
      );
    }
    currentOs = [...newCurrentOs];
  }
  while (currentOs.length) {
    const [i, j] = currentOs.shift()!;
    visitedMap[i][j] = true;
  }

  return visitedMap
    .map((line) => line.filter((a) => a).length)
    .reduce((a, b) => a + b, 0);
};

console.log(day21p1(smallRawInput, 6));
console.log(day21p1(day21input, 64));

console.log("\n============== P2 ============\n");
console.log(day21p1(smallRawInput, 10));

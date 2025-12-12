import { day7input } from "./day7input";
import { Coord, coordKey, CoordKey } from "../../utils/Coord";
import { fitsTheMatr } from "../../utils/fitsTheMatr";

const smallRawInput = `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`;

type MapPoint = "." | "|" | "^" | "S";
const parse = (rawInput: string): MapPoint[][] =>
  rawInput.split("\n").map((row) => row.split("") as MapPoint[]);

const day7p1 = (rawInput: string) => {
  const tachyonManifold = parse(rawInput);
  const start = tachyonManifold[0].findIndex((val) => val === "S");
  const visitedSplitters = new Set<CoordKey>();
  const height = tachyonManifold.length;
  const moveBeam = ([curI, curJ]: Coord) => {
    if (!fitsTheMatr([curI, curJ], tachyonManifold)) {
      return;
    }
    if (tachyonManifold[curI][curJ] === "|") {
      return;
    }
    if (curI + 1 >= height) {
      return;
    }

    if (tachyonManifold[curI + 1][curJ] === "^") {
      moveBeam([curI + 1, curJ - 1]);
      moveBeam([curI + 1, curJ + 1]);
      visitedSplitters.add(coordKey([curI + 1, curJ]));
      return;
    }
    tachyonManifold[curI][curJ] = "|";
    moveBeam([curI + 1, curJ]);
  };
  moveBeam([0, start]);
  return visitedSplitters.size;
};

console.log(day7p1(smallRawInput));
console.log(day7p1(day7input));

const day7p2 = (rawInput: string) => {
  const tachyonManifold = parse(rawInput);
  const start = tachyonManifold[0].findIndex((val) => val === "S");
  const cache: Record<CoordKey, { right: number; left: number }> = {};
  const height = tachyonManifold.length;
  const calculateAlternativeTimelines = ([curI, curJ]: Coord) => {
    if (!fitsTheMatr([curI, curJ], tachyonManifold)) {
      return 0;
    }
    while (curI < height && tachyonManifold[curI][curJ] !== "^") {
      curI++;
    }
    if (curI >= height) {
      return 1;
    }
    const curCoordKey = coordKey([curI, curJ]);
    if (!cache[curCoordKey]) {
      cache[curCoordKey] = {
        left: calculateAlternativeTimelines([curI + 1, curJ - 1]),
        right: calculateAlternativeTimelines([curI + 1, curJ + 1]),
      };
    }
    return cache[curCoordKey].left + cache[curCoordKey].right;
  };
  return calculateAlternativeTimelines([0, start]);
};

console.log("p2", day7p2(smallRawInput));
console.log("p2", day7p2(day7input));

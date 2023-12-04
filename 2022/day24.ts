import { day24input } from "./day24input";

const theSmallestInput = `
#.#####
#.....#
#>....#
#.....#
#...v.#
#.....#
#####.#`;

const smallInput = `
#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`;

const DIRECTIONS = [">", "<", "^", "v", "#"] as const;
type Direction = typeof DIRECTIONS[number];
type Blizzard = Direction;
type PointContent = Blizzard[];
type Field = PointContent[][];
type Coord = [number, number];

const parseInput = (input: string): Field =>
  input
    .trim()
    .split("\n")
    .map((row) =>
      row.split("").map((ch) => (ch === "." ? [] : [ch as Direction]))
    );

// const wrapCoord = (val: number, size: number) => (val + size) % size;
const wrapCoord = (val: number, size: number) => {
  let nextVal = val;
  if (nextVal > size - 2) {
    nextVal = 1;
  }
  if (nextVal < 1) {
    nextVal = size - 2;
  }
  return nextVal;
};

const printField = (field: Field, [curI, curJ]: Coord) => {
  const printedField = field
    .map((row, i) =>
      row
        .map((blizzards, j) =>
          i === curI && j === curJ
            ? "E"
            : blizzards.length === 0
            ? "."
            : blizzards.length === 1
            ? blizzards[0]
            : blizzards.length
        )
        .join("")
    )
    .join("\n");

  console.log("\n");
  console.log(printedField);
  console.log("\n");
};

export const day24 = (input: string) => {
  let field = parseInput(input);
  const h = field.length;
  const w = field[0].length;
  const [endI, endJ]: Coord = [h - 1, w - 2];

  const wrapI = (i: number) => wrapCoord(i, h);
  const wrapJ = (j: number) => wrapCoord(j, w);

  const getNextField = (field: Field) => {
    const nextField: Field = field.map((row) => row.map(() => []));

    const moveBlizzard = (coord: Coord, direction: Direction) => {
      const directionMovements: Record<Direction, (coord: Coord) => Coord> = {
        "<": ([i, j]) => [i, wrapJ(j - 1)],
        ">": ([i, j]) => [i, wrapJ(j + 1)],
        "^": ([i, j]) => [wrapI(i - 1), j],
        v: ([i, j]) => [wrapI(i + 1), j],
        "#": ([i, j]) => [i, j],
      };
      const [nextI, nextJ] = directionMovements[direction](coord);
      nextField[nextI][nextJ].push(direction);
    };

    for (let i = 0; i < field.length; i++) {
      for (let j = 0; j < field[i].length; j++) {
        const blizzards = field[i][j];
        for (let k = 0; k < blizzards.length; k++) {
          const blizzard = blizzards[k];
          moveBlizzard([i, j], blizzard);
        }
      }
    }
    return nextField;
  };

  const moveBlizzards = () => {
    field = getNextField(field);
  };

  const getCacheKey = (min: number, curCoord: Coord) =>
    `${min}||${curCoord.join(",")}`;

  let iters = 0;
  const findPath = ([startI, startJ]: Coord, [endI, endJ]: Coord): number => {
    type QueueItem = [number, number, number];
    const queue: QueueItem[] = [[startI, startJ, 0]];
    const visited = new Set();

    while (queue.length) {
      moveBlizzards();
      const qLen = queue.length;
      for (let k = 0; k < qLen; k++) {
        iters++;
        const [curI, curJ, minutes] = queue.shift() as QueueItem;

        if (curI === endI && curJ === endJ) {
          return minutes;
        }

        const allNeighbours: Coord[] = [
          [curI + 1, curJ],
          [curI - 1, curJ],
          [curI, curJ + 1],
          [curI, curJ - 1],
          [curI, curJ],
        ];

        const safeNeighbours: Coord[] = allNeighbours.filter(
          ([i, j]) => i < h && j < w && i >= 0 && j >= 0 && !field[i][j].length
        );
        for (let i = 0; i < safeNeighbours.length; i++) {
          const [nextI, nextJ] = safeNeighbours[i];

          const cacheKey = getCacheKey(minutes + 1, [nextI, nextJ]);
          if (visited.has(cacheKey)) {
            continue;
          }

          visited.add(cacheKey);
          queue.push([nextI, nextJ, minutes + 1]);
        }
      }
    }
    throw Error("this should not be happening");
  };

  // return findPath(field, [0, 1], [endI, endJ]);
  const first = findPath([0, 1], [endI, endJ]);
  // console.log("first", first);
  const second = findPath([endI, endJ], [0, 1]) + 1;
  // console.log("second", second);
  const last = findPath([0, 1], [endI, endJ]) + 1;
  // console.log(first, second, last);
  // console.log(iters);
  return first + second + last;
};

console.log("the smallest", day24(theSmallestInput));

console.log("small", day24(smallInput));
console.log("big", day24(day24input));

// 413 too high

// p2 818 too low

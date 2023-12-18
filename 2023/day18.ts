import { day18input } from "./day18input";

const smallRawInput = `
R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`;

type Direction = "R" | "L" | "D" | "U";

type Line = {
  direction: Direction;
  distance: number;
  hexColor: string;
};

const parse = (rawInput: string): Line[] =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => {
      const [direction, distance, hexColor] = line.split(" ");
      return {
        direction: direction as Direction,
        distance: Number(distance),
        hexColor: hexColor.slice(1, -1),
      };
    });

const DIR_ITERATORS: Record<Direction, [number, number]> = {
  R: [0, 1],
  L: [0, -1],
  D: [1, 0],
  U: [-1, 0],
};

const getPoints = (lines: Line[]): [number, number][] =>
  lines.reduce(
    (acc, { direction, distance }) => {
      const [lastI, lastJ] = acc.at(-1)!;
      const [di, dj] = DIR_ITERATORS[direction];
      return [...acc, [lastI + di * distance, lastJ + dj * distance]] as [
        number,
        number
      ][];
    },
    [[0, 0]]
  );

const shoeLace = (points: [number, number][]) => {
  let sum = 0;
  const n = points.length;

  for (let i = 0; i < n - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
};

const perimeter = (lines: Line[]) =>
  lines.map(({ distance }) => distance).reduce((a, b) => a + b, 0);

const getTotalArea = (lines: Line[]) => {
  const points = getPoints(lines);
  return shoeLace(points) + perimeter(lines) / 2 + 1;
};

const day18p1 = (rawInput: string) => getTotalArea(parse(rawInput));

const parseP2 = (rawInput: string): Line[] =>
  parse(rawInput).map(({ hexColor }) => {
    const distance = parseInt(hexColor.slice(1, 6), 16);
    const directionIndex = Number(hexColor.at(-1)!);
    const directions: Direction[] = ["R", "D", "L", "U"] as const;
    return {
      direction: directions[directionIndex],
      distance,
      hexColor,
    };
  });

const day18p2 = (rawInput: string) => getTotalArea(parseP2(rawInput));

console.log(day18p1(smallRawInput));
console.log(day18p1(day18input));

console.log("\n ========== P2 =========== \n");

console.log(day18p2(smallRawInput));
console.log(day18p2(day18input));

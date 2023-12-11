import { day11input } from "./day11input";

const smallRawInput = `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

const parse = (rawInput: string) =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => line.split(""));

const isAllDot = (line: string[]) => line.every((el) => el === ".");

const printUniverse = (universe: string[][]) =>
  universe.map((line) => line.join("")).join("\n");

const manhattanDistance = (
  [i1, j1]: [number, number],
  [i2, j2]: [number, number]
) => Math.abs(i1 - i2) + Math.abs(j1 - j2);

const getGalaxies = (universe: string[][]): [number, number][] =>
  universe.reduce(
    (acc, line, i) => [
      ...acc,
      ...line
        .reduce(
          (lineAcc, el, j) => (el === "#" ? [...lineAcc, j] : lineAcc),
          [] as number[]
        )
        .map((j) => [i, j] as [number, number]),
    ],
    [] as [number, number][]
  );

const getEmptyRows = (universe: string[][]): number[] =>
  universe.reduce(
    (emptyRows, line, i) => (isAllDot(line) ? [...emptyRows, i] : emptyRows),
    [] as number[]
  );

const getEmptyCols = (universe: string[][]): number[] => {
  const emptyCols: number[] = [];
  for (let j = 0; j < universe[0].length; j++) {
    let column: string[] = [];
    for (let i = 0; i < universe.length; i++) {
      column.push(universe[i][j]);
    }
    if (isAllDot(column)) {
      emptyCols.push(j);
    }
  }

  return emptyCols;
};

const day11p1 = (rawInput: string, times = 2) => {
  const universe = parse(rawInput);
  const emptyCols = getEmptyCols(universe);
  const emptyRows = getEmptyRows(universe);
  const galaxies = getGalaxies(universe);
  const galaxyCoord = ([i, j]: [number, number]): [number, number] => [
    i + (times - 1) * emptyRows.filter((ei) => ei < i).length,
    j + (times - 1) * emptyCols.filter((ej) => ej < j).length,
  ];

  let sum = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let k = i + 1; k < galaxies.length; k++) {
      sum += manhattanDistance(
        galaxyCoord(galaxies[i]),
        galaxyCoord(galaxies[k])
      );
    }
  }
  return sum;
};

const day11p2 = (rawInput: string, times = 1000000) => day11p1(rawInput, times);

console.log(day11p1(smallRawInput));
console.log(day11p1(day11input));

console.log("\n==== P2 ====\n");
console.log(day11p2(smallRawInput, 100));
console.log(day11p2(day11input));

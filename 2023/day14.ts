import { day14input } from "./day14input";

const smallRawInput = `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;

const parse = (rawInput: string) =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => line.split(""));

const swapRowsColumns = (map: readonly string[][]): string[][] => {
  const columns: string[][] = [];
  for (let j = 0; j < map[0].length; j++) {
    const col: string[] = [];
    for (let i = 0; i < map.length; i++) {
      col.push(map[i][j]);
    }
    columns.push(col);
  }
  return columns;
};

const rollToNorth = (columns: readonly string[][]): string[][] =>
  rollTo(columns, 1);

const rollTo = (
  columns: readonly string[][],
  direction: 1 | -1
): string[][] => {
  const newColumns: string[][] = [...columns.map((col) => [...col])];
  for (const column of newColumns) {
    const start = direction === 1 ? 0 : column.length - 1;
    const end = direction === 1 ? column.length - 1 : 0;
    let fallTo = start;
    for (let i = start; -direction * i >= -direction * end; i += direction) {
      if (column[i] === "#") {
        fallTo = i + direction;
        continue;
      }
      if (column[i] === ".") {
        continue;
      }
      const roundRock = column[i];
      column[i] = ".";
      column[fallTo] = roundRock;

      fallTo += direction;
    }
  }

  return newColumns;
};

const columnLoad = (column: string[]) =>
  column.reduce(
    (acc, ch, i) => (ch === "O" ? acc + column.length - i : acc),
    0
  );

const day14p1 = (rawInput: string) => {
  const map = parse(rawInput);
  const columns = swapRowsColumns(map);
  const mapRolled = rollToNorth(columns);
  return mapRolled.map(columnLoad).reduce((a, b) => a + b);
};

const cycle = (map: readonly string[][]): readonly string[][] => {
  // north
  let columns = swapRowsColumns(map);
  columns = rollTo(columns, 1);

  // west
  let rows = swapRowsColumns(columns);
  rows = rollTo(rows, 1);

  // south
  columns = swapRowsColumns(rows);
  columns = rollTo(columns, -1);

  // east
  rows = swapRowsColumns(columns);
  return rollTo(rows, -1);
};

const runCycles = (
  map: readonly string[][],
  neededIteration: number
): readonly string[][] => {
  const mem: Map<string, { res: readonly string[][]; firstTime: number }> =
    new Map();
  let cycled = map;
  for (let i = 0; i < neededIteration; i++) {
    const key = cycled.map((line) => line.join("")).join("\n");
    if (!mem.has(key)) {
      cycled = cycle(cycled);
      mem.set(key, {
        res: cycled,
        firstTime: i + 1,
      });
      continue;
    }
    const cached = mem.get(key)!;
    cycled = cached.res;
    const d = i + 1 - cached.firstTime;

    if ((neededIteration - cached.firstTime) % d === 0) {
      return cycled;
    }
  }
  return cycled;
};

const day14p2 = (rawInput: string) => {
  const map: readonly string[][] = parse(rawInput);

  const cycled = runCycles(map, 1000000000);

  return swapRowsColumns(cycled)
    .map(columnLoad)
    .reduce((a, b) => a + b);
};

console.log(day14p1(smallRawInput));
console.log(day14p1(day14input));

console.log("\n======== P2 ========\n");

console.log(day14p2(smallRawInput));
console.log(day14p2(day14input));

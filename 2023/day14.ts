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

const getColumns = (map: readonly string[][]): string[][] => {
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
    for (let i = start; direction === 1 ? i <= end : i >= end; i += direction) {
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

const columnLoad = (column: string[]) => {
  // const solidRocks = column.reduce((acc, rock, i) => rock === '#' ? [...acc, i] : acc, [] as number[]);
  //   const solidRocks = column.filter((rock) => rock === "#");
  //   let solidRocksLeft = solidRocks.length;
  let sum = 0;
  for (let i = 0; i < column.length; i++) {
    if (column[i] === "O") {
      sum += column.length - i;
    }
    // if (column[i] === "#") {
    //   solidRocksLeft--;
    // }
  }
  return sum;
};

const day14p1 = (rawInput: string) => {
  const map = parse(rawInput);
  const columns = getColumns(map);
  const mapRolled = rollToNorth(columns);
  //   console.log(
  //     getColumns(mapRolled)
  //       .map((col) => col.join(""))
  //       .join("\n")
  //   );
  return mapRolled.map(columnLoad).reduce((a, b) => a + b);
};

const memoize = (
  fn: (map: string[][]) => string[][]
): ((map: string[][], num: number) => string[][]) => {
  const mem: Map<string, { res: string[][]; nums: number[] }> = new Map();
  return (map, num) => {
    const key = map.map((line) => line.join("")).join("\n");
    // mem.forEach((val, key) => {
    //     if (val.nums.length > 1) {
    //         const d = val.nums[1] - val.nums[0];
    //         console.assert(val.nums[2] - val.nums[1] === d);
    //         if ((1000000000 - val.nums[0]) % d === 0) {
    //             console.log(val.nums[0], key);
    //         }
    //     }
    //     })
    if (mem.has(key)) {
      const cached = mem.get(key)!;
      cached.nums.push(num);
      return cached.res;
    }
    const res = fn(map);
    mem.set(key, { res, nums: [num] });
    return res;
  };
};

// const cycle = memoize((map: string[][]): string[][] => {
const cycle = (map: readonly string[][]): readonly string[][] => {
  // north
  let columns = getColumns(map);
  columns = rollTo(columns, 1);

  // west
  let rows = getColumns(columns);
  rows = rollTo(rows, 1);

  // south
  columns = getColumns(rows);
  columns = rollTo(columns, -1);

  // east
  rows = getColumns(columns);
  return rollTo(rows, -1);
};

const runCycles = (
  map: readonly string[][],
  neededIteration: number
): readonly string[][] => {
  const mem: Map<string, { res: readonly string[][]; nums: number[] }> =
    new Map();
  let i = 0;
  let cycled = map;
  while (i < neededIteration) {
    const key = cycled.map((line) => line.join("")).join("\n");
    if (mem.has(key)) {
      const cached = mem.get(key)!;
      cached.nums.push(i);

      if (cached.nums.length > 1) {
        const d = cached.nums[1] - cached.nums[0];
        if ((neededIteration - cached.nums[0]) % d === 0) {
          return cached.res;
        }
      }
      cycled = cached.res;
      i++;
      continue;
    }
    cycled = cycle(cycled);
    mem.set(key, {
      res: cycled,
      nums: [i],
    });
    i++;
  }
  return cycled;
};

const day14p2 = (rawInput: string, debug = 6) => {
  const map: readonly string[][] = parse(rawInput);
  //   let cycled = map;
  const expectedCycles = [
    `.....#....
      ....#...O#
      ...OO##...
      .OO#......
      .....OOO#.
      .O#...O#.#
      ....O#....
      ......OOOO
      #...O###..
      #..OO#....`,

    `.....#....
      ....#...O#
      .....##...
      ..O#......
      .....OOO#.
      .O#...O#.#
      ....O#...O
      .......OOO
      #..OO###..
      #.OOO#...O`,

    `.....#....
  ....#...O#
  .....##...
  ..O#......
  .....OOO#.
  .O#...O#.#
  ....O#...O
  .......OOO
  #...O###.O
  #.OOO#...O`,
  ].map((expectedCycle) =>
    expectedCycle
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .join("\n")
  );
  const cycled = runCycles(map, 1000000000);
  let cycled2 = map;
  for (let i = 0; i < debug; i++) {
    cycled2 = cycle(cycled);
    // if (i % 10000000 === 0) {
    //   console.log(i);
    // }
    console.log("\ncycle", i + 1, "\n");
    const cycleStr = cycled.map((line) => line.join("")).join("\n");
    console.log(cycleStr);
    if (expectedCycles[i]) {
      console.assert(expectedCycles[i] === cycleStr, i);
    }
  }
  console.log(
    "debug",
    getColumns(cycled2)
      .map(columnLoad)
      .reduce((a, b) => a + b)
  );
  return getColumns(cycled)
    .map(columnLoad)
    .reduce((a, b) => a + b);
};

console.log(day14p1(smallRawInput));
console.log(day14p1(day14input));

console.log("\n======== P2 ========\n");

console.log(day14p2(smallRawInput, 6));
// console.log(day14p2(day14input, 118));

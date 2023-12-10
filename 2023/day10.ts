import { day10input } from "./day10input";

const smallRawInput = `
-L|F7
7S-7|
L|7||
-L-J|
L|-JF`;

const smallRawInput2 = `
7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`;

const parse = (rawInput: string) =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => line.split(""));

const findStart = (pipeMap: string[][]): [number, number] => {
  for (let i = 0; i < pipeMap.length; i++) {
    for (let j = 0; j < pipeMap[i].length; j++) {
      if (pipeMap[i][j] === "S") {
        return [i, j];
      }
    }
  }
  throw Error("could not find start");
};

const fitsTheMap = <T>([i, j]: [number, number], map: T[][]) =>
  i >= 0 && j >= 0 && i < map.length && j < map[i].length;

type Neigbour = {
  coord: [number, number];
  possibleValues: string[];
  connectsTo: string[];
};

const getNeigbours = (curI: number, curJ: number, pipeMap: string[][]) => {
  const allNeigbours: Neigbour[] = [
    {
      coord: [curI, curJ - 1],
      possibleValues: ["-", "L", "F"],
      connectsTo: ["-", "J", "7"],
    },
    {
      coord: [curI, curJ + 1],
      possibleValues: ["-", "J", "7"],
      connectsTo: ["-", "L", "F"],
    },
    {
      coord: [curI - 1, curJ],
      possibleValues: ["|", "7", "F"],
      connectsTo: ["|", "L", "J"],
    },
    {
      coord: [curI + 1, curJ],
      possibleValues: ["|", "J", "L"],
      connectsTo: ["|", "7", "F"],
    },
  ];
  return allNeigbours.filter(
    ({ coord: [i, j], connectsTo, possibleValues }) =>
      fitsTheMap([i, j], pipeMap) &&
      possibleValues.includes(pipeMap[i][j]) &&
      ["S", ...connectsTo].includes(pipeMap[curI][curJ])
  );
};

const buildLoopPipeMap = (pipeMap: string[][]): string[][] => {
  const [startI, startJ] = findStart(pipeMap);
  const loopPipeMap: string[][] = new Array(pipeMap.length)
    .fill(undefined)
    .map((_, i) => new Array(pipeMap[i].length).fill("."));

  const visitedPipeMap: boolean[][] = new Array(pipeMap.length)
    .fill(undefined)
    .map((_, i) => new Array(pipeMap[i].length).fill(false));

  const queue: [number, number][] = [[startI, startJ]];
  while (queue.length) {
    const [curI, curJ] = queue.shift()!;
    visitedPipeMap[curI][curJ] = true;
    loopPipeMap[curI][curJ] = pipeMap[curI][curJ];

    const neigbours = getNeigbours(curI, curJ, pipeMap).filter(
      ({ coord: [i, j] }) => !visitedPipeMap[i][j]
    );
    for (const {
      coord: [i, j],
    } of neigbours) {
      queue.push([i, j]);
    }
  }

  return loopPipeMap;
};

const findLongestFromStart = (loopPipeMap: string[][]): number => {
  const [startI, startJ] = findStart(loopPipeMap);

  const traverseLoop = ([startWithI, startWithJ]: [number, number]) => {
    const visitedPipeMap: boolean[][] = new Array(loopPipeMap.length)
      .fill(undefined)
      .map((_, i) => new Array(loopPipeMap[i].length).fill(false));

    visitedPipeMap[startI][startJ] = true;
    const distancesMap: number[][] = new Array(loopPipeMap.length)
      .fill(undefined)
      .map(() => new Array(loopPipeMap[0].length).fill(-1));

    const queue: { coord: [number, number]; dist: number }[] = [
      { coord: [startWithI, startWithJ], dist: 1 },
    ];
    while (queue.length) {
      const {
        coord: [curI, curJ],
        dist: curDist,
      } = queue.shift()!;
      visitedPipeMap[curI][curJ] = true;
      distancesMap[curI][curJ] = curDist;

      const neigbours = getNeigbours(curI, curJ, loopPipeMap).filter(
        ({ coord: [i, j] }) => !visitedPipeMap[i][j]
      );

      for (const {
        coord: [i, j],
      } of neigbours) {
        queue.push({ coord: [i, j], dist: curDist + 1 });
      }
    }
    return distancesMap;
  };

  const [neigbour1, neigbour2] = getNeigbours(startI, startJ, loopPipeMap);
  const distMap11 = traverseLoop(neigbour1.coord);
  const distMap12 = traverseLoop(neigbour2.coord);
  const distMapRes = new Array(distMap11.length)
    .fill(undefined)
    .map((_, i) => new Array(distMap11[i].length).fill(0));
  for (let i = 0; i < distMapRes.length; i++) {
    for (let j = 0; j < distMapRes[i].length; j++) {
      distMapRes[i][j] = Math.min(distMap11[i][j], distMap12[i][j]);
    }
  }

  return distMapRes.reduce((acc, line) => Math.max(acc, Math.max(...line)), 0);
};

const day10p1 = (rawInput: string) => {
  const pipeMap = parse(rawInput);
  const loopPipeMap = buildLoopPipeMap(pipeMap);
  return findLongestFromStart(loopPipeMap);
};

const expandHorizontally = (
  pipeMap: string[][]
): { pipeMap: string[][]; newColumns: number[] } => {
  const pipeMapCopy = pipeMap.map((line) => [...line]);
  const connectedHorizontallyOptions = [
    "--",
    "L-",
    "LJ",
    "L7",
    "F7",
    "FJ",
    "F-",
    "-J",
    "-7",

    "S-",
    "SJ",
    "S7",
    "-S",
    "-S",
    "FS",
    "LS",
  ];
  const verticalSqueezeOptions = [
    "||",
    "|L",
    "|F",
    "J|",
    "7|",
    "7L",
    "7F",
    "JL",
    "JF",
  ];
  const newColumns: number[] = [];

  const expandOnColumn = (j: number) => {
    newColumns.push(j);
    for (let i = 0; i < pipeMapCopy.length; i++) {
      const cur = pipeMapCopy[i][j];
      const prev = pipeMapCopy[i][j - 1];
      const connection = `${prev}${cur}`;
      const elToInsert = connectedHorizontallyOptions.includes(connection)
        ? "-"
        : ".";
      const rowStart = pipeMapCopy[i].slice(0, j);
      const rowEnd = pipeMapCopy[i].slice(j);
      pipeMapCopy[i] = [...rowStart, elToInsert, ...rowEnd];
    }
  };

  for (let i = 0; i < pipeMapCopy.length; i++) {
    for (let j = 1; j < pipeMapCopy[i].length; j++) {
      const cur = pipeMapCopy[i][j];
      const prev = pipeMapCopy[i][j - 1];
      const connection = `${prev}${cur}`;
      if (verticalSqueezeOptions.includes(connection)) {
        expandOnColumn(j);
      }
    }
  }
  return { pipeMap: pipeMapCopy, newColumns };
};
const expandVertically = (
  pipeMap: string[][]
): { pipeMap: string[][]; newRows: number[] } => {
  const pipeMapCopy = pipeMap.map((line) => [...line]);
  const connectedVerticallyOptions = [
    "|L",
    "|J",
    "||",
    "7|",
    "7J",
    "7L",
    "FL",
    "FJ",
    "F|",

    "|S",
    "FS",
    "7S",
    "S|",
    "SJ",
    "SL",
  ];
  const horizontallySqueezeOptions = [
    "--",
    "-F",
    "-7",
    "L-",
    "L7",
    "LF",
    "J-",
    "J7",
    "JF",
  ];
  const newRows: number[] = [];

  const expandOnRow = (i: number) => {
    newRows.push(i);
    const newLine = new Array(pipeMapCopy[i].length).fill(".");

    for (let j = 0; j < pipeMapCopy[i].length; j++) {
      const cur = pipeMapCopy[i][j];
      const prev = pipeMapCopy[i - 1][j];
      const connection = `${prev}${cur}`;
      const elToInsert = connectedVerticallyOptions.includes(connection)
        ? "|"
        : ".";
      newLine[j] = elToInsert;
    }
    pipeMapCopy.splice(i, 0, newLine);
  };

  for (let j = 0; j < pipeMapCopy[0].length; j++) {
    for (let i = 1; i < pipeMapCopy.length; i++) {
      const cur = pipeMapCopy[i][j];
      const prev = pipeMapCopy[i - 1][j];
      const connection = `${prev}${cur}`;
      if (horizontallySqueezeOptions.includes(connection)) {
        expandOnRow(i);
      }
    }
  }
  return { pipeMap: pipeMapCopy, newRows };
};

const fillOutsides = (pipeMap: string[][]): string[][] => {
  const pipeMapCopy = [...pipeMap.map((line) => [...line])];
  const getEmptyNeigbours = (i: number, j: number): [number, number][] => {
    const allNeigbours: [number, number][] = [
      [i - 1, j],
      [i + 1, j],
      [i, j - 1],
      [i, j + 1],
    ];
    return allNeigbours.filter(
      ([i, j]) => fitsTheMap([i, j], pipeMapCopy) && pipeMapCopy[i][j] === "."
    );
  };
  const traverse = (startI: number, startJ: number) => {
    const queue: [number, number][] = [[startI, startJ]];
    while (queue.length) {
      const [curI, curJ] = queue.shift()!;
      if (pipeMapCopy[curI][curJ] !== ".") {
        continue;
      }
      pipeMapCopy[curI][curJ] = "O";
      for (const [i, j] of getEmptyNeigbours(curI, curJ)) {
        queue.push([i, j]);
      }
    }
  };

  for (const i of [0, pipeMapCopy.length - 1]) {
    for (let j = 0; j < pipeMapCopy[0].length; j++) {
      if (pipeMapCopy[i][j] === ".") {
        traverse(i, j);
      }
    }
  }
  for (let i = 0; i < pipeMapCopy.length; i++) {
    for (const j of [0, pipeMapCopy[i].length - 1]) {
      if (pipeMapCopy[i][j] === ".") {
        traverse(i, j);
      }
    }
  }

  return pipeMapCopy;
};

const removeAddedRows = (pipeMap: string[][], rows: number[]) => {
  for (let k = rows.length - 1; k >= 0; k--) {
    const i = rows[k];
    pipeMap.splice(i, 1);
  }
};

const removeAddedCols = (pipeMap: string[][], cols: number[]) => {
  for (let k = cols.length - 1; k >= 0; k--) {
    const j = cols[k];
    for (let i = 0; i < pipeMap.length; i++) {
      pipeMap[i].splice(j, 1);
    }
  }
};

const day10p2 = (rawInput: string) => {
  const pipeMap = parse(rawInput);
  const loopPipeMap = buildLoopPipeMap(pipeMap);
  const { pipeMap: expandedHorizontallyPipeMap, newColumns } =
    expandHorizontally(loopPipeMap);
  const { pipeMap: expandedPipeMap, newRows } = expandVertically(
    expandedHorizontallyPipeMap
  );
  const expandedPipeMapWithOutsides = fillOutsides(expandedPipeMap);
  removeAddedRows(expandedPipeMapWithOutsides, newRows);
  removeAddedCols(expandedPipeMapWithOutsides, newColumns);

  return expandedPipeMapWithOutsides
    .map((line) => line.filter((el) => el === ".").length)
    .reduce((a, b) => a + b);
};

const smallExampleP21 = `
...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`;

const smallExampleP22 = `
..........
.S------7.
.|F----7|.
.||OOOO||.
.||OOOO||.
.|L-7F-J|.
.|..||..|.
.L--JL--J.
..........`;

const largerExampleP2 = `
.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`;

const largerExampleP22 = `
FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`;

console.log(day10p1(smallRawInput));
console.log(day10p1(smallRawInput2));
console.log(day10p1(day10input));

console.log(day10p2(smallExampleP21));
console.log(day10p2(smallExampleP22));
console.log(day10p2(largerExampleP2));
console.log(day10p2(largerExampleP22));
console.log(day10p2(day10input));

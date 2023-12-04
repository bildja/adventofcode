import fs from "fs";
import path from "path";
import { day12input } from "./day12input";

const smallInput = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Sabqponm
// abcryxxl
// accszExk
// acctuvwj
// abdefghi

type Coord = [number, number];
type ParsedData = { matrix: number[][]; start: Coord; end: Coord };

const parseInput = (input: string): ParsedData => {
  const rows = input.split("\n");
  const n = rows.length;
  const m = rows[0].length;

  const charCodeA = "a".charCodeAt(0);
  const charCodeZ = "z".charCodeAt(0);
  const matrix = new Array(n).fill(undefined).map(() => new Array(m).fill(-1));
  let startingPosition: Coord | null = null;
  let endingPosition: Coord | null = null;

  const getEl = (i: number, j: number) => {
    const char = rows[i][j];
    switch (char) {
      case "S": {
        startingPosition = [i, j];
        return 0;
      }
      case "E": {
        endingPosition = [i, j];
        return charCodeZ - charCodeA;
      }
      default:
        return char.charCodeAt(0) - charCodeA;
    }
  };

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      matrix[i][j] = getEl(i, j);
    }
  }
  if (!startingPosition || !endingPosition) {
    throw Error(
      `could not find starting or ending position. Start: "${startingPosition}". End: ${endingPosition}`
    );
  }

  return { matrix, start: startingPosition, end: endingPosition };
};

const printMatrix = <T>(matrix: T[][], delimiter = "\t") => {
  const printed = matrix.map((row) => row.join(delimiter)).join("\n\n");
  console.log(printed);
  fs.writeFileSync(path.join(__dirname, "day12.txt"), printed);
};

const day12 = async (input: string) => {
  const { matrix, start, end } = parseInput(input);
  //   printMatrix(matrix);
  console.log(start, end);
  const [endI, endJ] = end;

  const n = matrix.length;
  const m = matrix[0].length;
  console.log(n, m);
  const visiting: boolean[][] = new Array(n)
    .fill(undefined)
    .map(() => new Array(m).fill(false));

  const visited: (null | Coord[])[][] = new Array(n)
    .fill(undefined)
    .map(() => new Array(m).fill(null));

  const visitedNum: (null | number)[][] = new Array(n)
    .fill(undefined)
    .map(() => new Array(m).fill(null));

  //   const visitedDirections: ("^" | "v" | ">" | "<" | ".")[][] = new Array(n)
  //     .fill(undefined)
  //     .map(() => new Array(m).fill("."));

  const findPath = ([i, j]: Coord): Coord[] => {
    if (visited[i][j] !== null) {
      //   console.log("returning null because visited", i, j);
      return visited[i][j] as Coord[];
    }
    if (i < 0 || i >= n || j < 0 || j >= m) {
      throw Error("we should not come here");
    }
    visiting[i][j] = true;

    if (endI === i && endJ === j) {
      visited[i][j] = [end];
      visitedNum[i][j] = 1;
      //   return 1;
      return [end];
    }
    const allPossibleMoves: (Coord | null)[] = [
      i > 0 ? [i - 1, j] : null,
      i < n - 1 ? [i + 1, j] : null,
      j > 0 ? [i, j - 1] : null,
      j < m - 1 ? [i, j + 1] : null,
    ];
    const neighbourMoves = allPossibleMoves.filter((move) => {
      if (move === null) {
        return false;
      }
      const [i2, j2] = move;
      if (visiting[i2][j2] && visited[i2][j2] === null) {
        return false;
      }
      return matrix[i2][j2] - matrix[i][j] <= 1;
    }) as [number, number][];

    if (!neighbourMoves.length) {
      visited[i][j] = [];
      visitedNum[i][j] = 0;
      //   return 0;
      return [];
    }

    // if (i === 19 && j === 2) {
    //   console.log("");
    // }
    const pathes = neighbourMoves
      .map(findPath)
      .filter((path) => path.length > 0);
    if (!pathes.length) {
      visited[i][j] = [];
      visitedNum[i][j] = 0;
      //   return 0;
      return [];
    }

    // let minPathLength = Number.MAX_SAFE_INTEGER;
    // let k = 0;
    // while (pathes[k])
    let minPath: Coord[] = pathes[0];
    // let minPath: number = pathes[0];
    for (const path of pathes) {
      if (path.length === 0) {
        continue;
      }
      if (path.length < minPath.length) {
        minPath = path;
      }
    }
    const val: Coord[] = [[i, j], ...minPath];
    // const val: number = 1 + minPath;
    visited[i][j] = val;
    visitedNum[i][j] = 1 + minPath.length;
    // visitedNum[i][j] = 1 + minPath;
    // return 1 + minPath;
    return [[i, j], ...minPath];
  };
  const minPath = findPath(start);
  const drawPath = async (paths: Coord[], n: number, m: number) => {
    const map = new Array(n).fill(undefined).map(() => new Array(m).fill("."));
    const fill = (str: string, len = 4) => {
      return str;
      const rawDiff = len - str.length;
      const diff = Math.floor(rawDiff / 2);
      const prefix = new Array(diff).fill(" ").join("");
      const suffix = rawDiff % 2 === 0 ? prefix : `${prefix} `;
      return `${prefix}${str}${suffix}`;
    };
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        map[i][j] = fill("💩");
        // map[i][j] = fill(input.split("\n")[i][j]);
      }
    }
    map[endI][endJ] = "💖";
    // console.log(JSON.stringify(paths));
    for (let k = 0; k < paths.length - 1; k++) {
      const [i, j] = paths[k];
      //   map[i][j] = fill(`${k + 1}${input.split("\n")[i][j]}`);
      map[i][j] = fill(`🧚`);
      console.clear();
      //   process.stdout.clearLine(0);
      printMatrix(map, "|");
      await delay(200);
      //   map[i][j] = `[${k + 1}]`;
    }
    map[endI][endJ] = "👻";
    console.clear();
    printMatrix(map, "|");
    await delay(200);
    // printMatrix(map, "|");
  };
  // console.log(JSON.stringify(minPath));
  //   console.log("min path", minPath);
  drawPath(minPath, n, m);
  //   printMatrix(visitedDirections, "");
  return minPath.length - 1;
  //   return minPath - 1;
};

const day12dp = (input: string) => {
  const { matrix, start, end } = parseInput(input);
  const n = matrix.length;
  const m = matrix[0].length;
  const [endI, endJ] = end;
  const [startI, startJ] = start;

  const dp = new Array(n).fill(undefined).map(() => new Array(m).fill(-1));

  const visit = (i: number, j: number, val: number) => {
    if (dp[i][j] !== -1 && dp[i][j] <= val) {
      return;
    }
    dp[i][j] = val;
    const allPossibleMoves: (Coord | null)[] = [
      i > 0 ? [i - 1, j] : null,
      i < n - 1 ? [i + 1, j] : null,
      j > 0 ? [i, j - 1] : null,
      j < m - 1 ? [i, j + 1] : null,
    ];
    const possibleMoves: Coord[] = allPossibleMoves.filter((move) => {
      if (move === null) {
        return false;
      }
      const [i2, j2] = move;
      return matrix[i][j] - matrix[i2][j2] <= 1;
    }) as Coord[];

    for (const [i2, j2] of possibleMoves) {
      visit(i2, j2, val + 1);
    }
  };
  visit(endI, endJ, 0);

  const pathLengths: number[] = [];
  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    for (let j = 0; j < row.length; j++) {
      const element = row[j];
      if (element === 0 && dp[i][j] !== -1) {
        pathLengths.push(dp[i][j]);
      }
    }
  }
  return Math.min(...pathLengths);
};

console.log("small", day12(smallInput));
// console.log("real", day12(day12input));

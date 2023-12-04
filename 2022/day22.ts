import fs from "fs";
import path from "path";

const smallInput = fs.readFileSync(
  path.join(__dirname, "day22small.txt"),
  "utf-8"
);
const day22input = fs.readFileSync(
  path.join(__dirname, "day22input.txt"),
  "utf-8"
);

type Cell = null | boolean;
type Field = Cell[][];
type Direction = "L" | "R";
type Path = [number, Direction][];

const parseField = (fieldRaw: string) => {
  const chMap = {
    " ": null,
    "#": true,
    ".": false,
  } as const;
  return fieldRaw
    .split("\n")
    .map((row) => row.split("").map((ch) => chMap[ch as keyof typeof chMap]));
};
const parsePath = (pathRaw: string): Path =>
  Array.from(pathRaw.matchAll(/(\d+)(R|L)?/g)).map(([, dist, dir]) => [
    Number(dist),
    (dir ?? "L") as Direction,
  ]);

const parseInput = (input: string): { field: Field; path: Path } => {
  const [fieldRaw, pathRaw] = input.split("\n\n");
  return { field: parseField(fieldRaw), path: parsePath(pathRaw) };
};

type Coord = [number, number];

const getFirstPosition = (field: Field): Coord => {
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      if (field[i][j] === false) {
        return [i, j];
      }
    }
  }
  throw Error("no place to start");
};

type Boundary = [number, number];

const getRowBoundaries = (field: Field): Boundary[] => {
  const boundaries: Boundary[] = [];
  for (let i = 0; i < field.length; i++) {
    let j = 0;
    const m = field[i].length;
    while (field[i][j] === null && j < m) {
      j++;
    }
    if (j === m) {
      throw Error(`row is empty, is it possible?`);
    }
    const start = j;
    j = m - 1;
    while (field[i][j] === null && j >= 0) {
      j--;
    }
    const end = j;
    boundaries.push([start, end]);
  }
  return boundaries;
};
const getColBoundaries = (field: Field): Boundary[] => {
  const boundaries: Boundary[] = [];
  const m = field[0].length;
  const n = field.length;
  for (let j = 0; j < m; j++) {
    let i = 0;
    while (field[i][j] === null && i < n) {
      i++;
    }
    if (i === n) {
      throw Error(`row is empty, is it possible?`);
    }
    const start = i;
    i = n - 1;
    while (field[i][i] === null && i >= 0) {
      i--;
    }
    const end = i;
    boundaries.push([start, end]);
  }
  return boundaries;
};

const day22 = (input: string) => {
  const { field, path } = parseInput(input);
  //   console.log(JSON.stringify(field), path);
  let curDirection = 90;
  const currentPosition = getFirstPosition(field);

  const turnLeft = () => {
    curDirection = (curDirection - 90 + 360) % 360;
  };
  const turnRight = () => {
    curDirection = (curDirection + 90) % 360;
  };
  const moveDirections = ["up", "right", "down", "left"] as const;
  const rowBoundaries = getRowBoundaries(field);
  const colBoundaries = getColBoundaries(field);

  const moveUp = (dist: number) => {
    const [i, j] = currentPosition;
    let curI = i;
    const [colStart, colEnd] = colBoundaries[j];
    for (let k = 0; k < dist; k++) {
      const nextI = curI - 1 < colStart ? colEnd : curI - 1;
      if (field[nextI][j]) {
        break;
      }
      curI = nextI;
    }
    currentPosition[0] = curI;
  };
  const moveRight = (dist: number) => {
    const [i, j] = currentPosition;
    let curJ = j;
    const [rowStart, rowEnd] = rowBoundaries[i];
    for (let k = 0; k < dist; k++) {
      const nextJ = curJ + 1 > rowEnd ? rowStart : curJ + 1;
      if (field[i][nextJ]) {
        break;
      }
      curJ = nextJ;
    }
    currentPosition[1] = curJ;
  };
  const moveDown = (dist: number) => {
    const [i, j] = currentPosition;
    let curI = i;
    const [colStart, colEnd] = colBoundaries[j];
    for (let k = 0; k < dist; k++) {
      const nextI = curI + 1 > colEnd ? colStart : curI + 1;
      if (field[nextI][j]) {
        break;
      }
      curI = nextI;
    }
    currentPosition[0] = curI;
  };
  const moveLeft = (dist: number) => {
    const [i, j] = currentPosition;
    let curJ = j;
    const [rowStart, rowEnd] = rowBoundaries[i];
    for (let k = 0; k < dist; k++) {
      const nextJ = curJ - 1 < rowStart ? rowEnd : curJ - 1;
      if (field[i][nextJ]) {
        break;
      }
      curJ = nextJ;
    }
    currentPosition[1] = curJ;
  };

  const getFacing = () => curDirection / 90;

  for (let i = 0; i < path.length; i++) {
    const curMoveDirection = moveDirections[getFacing()];
    const [dist, turn] = path[i];

    switch (curMoveDirection) {
      case "up": {
        moveUp(dist);
        break;
      }
      case "right": {
        moveRight(dist);
        break;
      }
      case "down": {
        moveDown(dist);
        break;
      }
      case "left": {
        moveLeft(dist);
        break;
      }
    }
    switch (turn) {
      case "L": {
        turnLeft();
        break;
      }
      case "R": {
        turnRight();
        break;
      }
      default:
        break;
    }
  }
  const [i, j] = currentPosition;

  return 1000 * (i + 1) + 4 * (j + 1) + getFacing();
};

console.log("small", day22(smallInput));
console.log("big", day22(day22input));

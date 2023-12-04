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

// a coord of top left vertex of the cube face. Edge size will be provided separately
type CubeFace = Coord;

type CubeFacesMatr = (-1 | number)[][];

const getCubeFacesMatr = (field: Field): CubeFacesMatr => {
  const m = Math.max(field.length, Math.max(...field.map((row) => row.length)));
  const n = field.length;
  const matr: CubeFacesMatr = new Array(n)
    .fill(-1)
    .map(() => new Array(m).fill(-1));
  let counter = 0;

  const edgeSize = m / 4;
  for (let i = 0; i < field.length; i += edgeSize) {
    for (let j = 0; j < field[i].length; j += edgeSize) {
      if (field[i][j] === null) {
        continue;
      }
      for (let i1 = i; i1 < i + edgeSize; i1++) {
        for (let j1 = j; j1 < j + edgeSize; j1++) {
          matr[i1][j1] = counter;
        }
      }
      counter++;
    }
  }
  return matr;
};

interface FaceWrapRules {
  up: readonly [number, number];
  right: readonly [number, number];
  down: readonly [number, number];
  left: readonly [number, number];
}

const smallFaceWraps: readonly FaceWrapRules[] = [
  /* 0 */ { up: [1, 180], right: [5, 180], down: [3, 0], left: [2, 90] },
  /* 1 */ { up: [0, 180], right: [2, 0], down: [4, 180], left: [5, 270] },
  /* 2 */ { up: [0, 270], right: [3, 0], down: [4, 90], left: [1, 0] },
  /* 3 */ { up: [0, 0], right: [5, 270], down: [4, 0], left: [2, 0] },
  /* 4 */ { up: [3, 0], right: [5, 0], down: [1, 180], left: [2, 270] },
  /* 5 */ { up: [3, 90], right: [0, 180], down: [1, 90], left: [4, 0] },
] as const;

const bigFaceWraps: readonly FaceWrapRules[] = [
  /* 0 */ { up: [5, 270], right: [1, 0], down: [2, 0], left: [3, 180] },
  /* 1 */ { up: [5, 0], right: [4, 180], down: [2, 270], left: [0, 0] },
  /* 2 */ { up: [0, 0], right: [1, 90], down: [4, 0], left: [3, 90] },
  /* 3 */ { up: [2, 270], right: [4, 0], down: [5, 0], left: [0, 180] },
  /* 4 */ { up: [2, 0], right: [1, 180], down: [5, 270], left: [3, 0] },
  /* 5 */ { up: [3, 0], right: [4, 90], down: [1, 0], left: [0, 90] },
] as const;

const getCubeFaces = (
  field: Field
): { cubeFaces: CubeFace[]; edgeSize: number } => {
  const edgeSize =
    Math.max(field.length, Math.max(...field.map((row) => row.length))) / 4;
  const cubeFaces: CubeFace[] = [];

  for (let i = 0; i < field.length; i += edgeSize) {
    for (let j = 0; j < field[i].length; j += edgeSize) {
      if (field[i][j] === null) {
        continue;
      }
      cubeFaces.push([i, j]);
    }
  }

  return { cubeFaces, edgeSize };
};

type CubePosition = [number, number, number];

const printField = (
  field: Field,
  currentPosition: [number, number],
  curDirection: number
) => {
  const characters = new Map([
    [null, "🫧"],
    [false, "⚪️"],
    [true, "🗿"],
  ]);
  const fieldEmoji = field.map((row) => row.map((ch) => characters.get(ch)));
  const directions = ["👆", "👉", "👇", "👈"];
  if (currentPosition) {
    const [i, j] = currentPosition;
    fieldEmoji[i][j] = directions[curDirection / 90];
  }
  console.clear();
  console.log(fieldEmoji.map((row) => row.join("")).join("\n"));
};

const day22 = (input: string, faceWraps: typeof smallFaceWraps) => {
  const { field, path } = parseInput(input);
  const matr = getCubeFacesMatr(field);
  const { cubeFaces, edgeSize } = getCubeFaces(field);

  let curDirection = 90;
  const currentPosition = getFirstPosition(field);

  const getRelative = ([i, j]: [number, number]): [number, number] => {
    const cube = matr[i][j];
    const [startI, startJ] = cubeFaces[cube];
    return [i - startI, j - startJ];
  };

  const getReal = (
    [relI, relJ]: [number, number],
    cube: number
  ): [number, number] => {
    const [startI, startJ] = cubeFaces[cube];
    return [startI + relI, startJ + relJ];
  };

  const normalizeDegrees = (degrees: number): number => (degrees + 360) % 360;

  const rotateRelativeCoordDegrees = (
    [relI, relJ]: [number, number],
    degrees: number
  ): [number, number] => {
    degrees = normalizeDegrees(degrees);
    switch (degrees) {
      case 0: {
        return [relI, relJ];
      }
      case 90: {
        return [edgeSize - relJ - 1, relI];
      }
      case 180: {
        return [edgeSize - relI - 1, edgeSize - relJ - 1];
      }
      case 270: {
        return [relJ, edgeSize - relI - 1];
      }
    }
    throw Error(`degrees is wrong ${degrees}`);
  };

  const turn = (degrees: number, draw = true) => {
    curDirection = normalizeDegrees(curDirection + degrees);
    // if (draw) {
    //   printField(field, currentPosition, curDirection);
    // }
  };

  const turnLeft = () => {
    turn(-90);
  };
  const turnRight = () => {
    turn(90);
  };

  const moveDirections = ["up", "right", "down", "left"] as const;

  const flip = (nextCoord: number) => edgeSize - nextCoord - 1;
  const minusOne = (n: number) => n - 1;
  const plusOne = (n: number) => n + 1;

  const identity = <T>(a: T): T => a;
  const move = (dist: number) => {
    const [i, j] = currentPosition;

    const getNextRelI = (nextRelI: number): number => {
      const direction = moveDirections[getFacing()];
      const nextFns = {
        up: flip,
        down: flip,
        left: identity,
        right: identity,
      } as const;
      return nextFns[direction](nextRelI);
    };
    const getNextRelJ = (nextRelJ: number): number => {
      const direction = moveDirections[getFacing()];
      const nextFns = {
        up: identity,
        down: identity,
        left: flip,
        right: flip,
      } as const;
      return nextFns[direction](nextRelJ);
    };

    const getNextI = (curI: number): number => {
      const direction = moveDirections[getFacing()];
      const nextFns = {
        up: minusOne,
        down: plusOne,
        left: identity,
        right: identity,
      } as const;
      return nextFns[direction](curI);
    };
    const getNextJ = (curJ: number): number => {
      const direction = moveDirections[getFacing()];
      const nextFns = {
        up: identity,
        down: identity,
        left: minusOne,
        right: plusOne,
      } as const;
      return nextFns[direction](curJ);
    };

    let curI = i;
    let curJ = j;
    let curCube = matr[i][j];

    for (let k = 0; k < dist; k++) {
      let nextI = getNextI(curI);
      let nextJ = getNextJ(curJ);
      let rotate = 0;
      let nextCube = curCube;
      if (
        nextI > matr.length - 1 ||
        nextI < 0 ||
        matr[nextI][nextJ] !== curCube
      ) {
        const [relI, relJ] = getRelative([curI, curJ]);
        const direction = moveDirections[getFacing()];
        [nextCube, rotate] = faceWraps[curCube as number][direction];
        const [nextRelI, nextRelJ] = rotateRelativeCoordDegrees(
          [getNextRelI(relI), getNextRelJ(relJ)],
          rotate
        );
        [nextI, nextJ] = getReal([nextRelI, nextRelJ], nextCube);
      }
      if (field[nextI][nextJ]) {
        break;
      }
      curI = nextI;
      curJ = nextJ;
      curCube = nextCube;
      turn(360 - rotate, false);
      // printField(field, [curI, curJ], curDirection);
    }
    currentPosition[0] = curI;
    currentPosition[1] = curJ;
    // printField(field, currentPosition, normalizeDegrees(curDirection));
  };

  const getFacing = () => curDirection / 90;
  // printField(field, currentPosition, curDirection);

  for (let i = 0; i < path.length; i++) {
    const [dist, turn] = path[i];
    move(dist);

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
  console.log(i + 1, j + 1, getFacing());

  return 1000 * (i + 1) + 4 * (j + 1) + getFacing();
};

console.log("small", day22(smallInput, smallFaceWraps));
console.log("big", day22(day22input, bigFaceWraps));

// 148207 too high

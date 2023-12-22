import { day22input } from "./day22input";

const smallRawInput = `
1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`;

type Coord3d = { x: number; y: number; z: number };
type CoordName = keyof Coord3d;
type Brick = {
  start: Coord3d;
  end: Coord3d;
  name: string;
};
type BrickRange = { range: Coord3d[]; name: string };

const parse = (rawInput: string): Brick[] =>
  rawInput
    .trim()
    .split("\n")
    .map((line, i) => {
      const [start, end] = line
        .split("~")
        .map((str) => str.split(",").map(Number))
        .map(([x, y, z]) => ({ x, y, z }));
      return { start, end, name: String.fromCharCode("a".charCodeAt(0) + i) };
    });

const getMaxMins = (bricks: Brick[]) => {
  const getAllCoords = (coordName: CoordName) =>
    bricks.flatMap(({ start, end }) => [start[coordName], end[coordName]]);

  const allX = getAllCoords("x");
  const allY = getAllCoords("y");
  const allZ = getAllCoords("z");
  const maxX = Math.max(...allX);
  const minX = Math.min(...allX);
  const maxY = Math.max(...allY);
  const minY = Math.min(...allY);
  const maxZ = Math.max(...allZ);
  const minZ = Math.min(...allZ);
  return { maxX, minX, maxY, minY, maxZ, minZ };
};

type Space = boolean[][][];

type CoordKey = `${number},${number},${number}`;

const coordKey = ({ x, y, z }: Coord3d): CoordKey => `${x},${y},${z}`;
const fromCoordKey = (coordKey: CoordKey): Coord3d => {
  const [x, y, z] = coordKey.split(",").map(Number);
  return { x, y, z };
};

// class Space {
//   private storage: Set<CoordKey> = new Set();

// }

const getBrickRange = ({ start, end, name }: Brick): BrickRange => {
  const { x: x1, y: y1, z: z1 } = start;
  const { x: x2, y: y2, z: z2 } = end;
  const coords: Coord3d[] = [];
  const diffs: Coord3d = { x: x2 - x1, y: y2 - y1, z: z2 - z1 };
  if (diffs.x === 0 && diffs.y === 0 && diffs.z === 0) {
    return { range: [{ x: x1, y: y1, z: z1 }], name };
  }
  for (const [coordName, diff] of Object.entries(diffs) as [
    CoordName,
    number
  ][]) {
    if (diff === 0) {
      continue;
    }

    // assert(y1 === y2, "y");
    // assert(z1 === z2, "z");
    const multiplier = diff / Math.abs(diff);
    for (
      let c = start[coordName];
      multiplier * c <= multiplier * end[coordName];
      c += multiplier
    ) {
      const coord: Coord3d = { x: x1, y: y1, z: z1 };
      coord[coordName] = c;
      coords.push(coord);
    }
  }
  return { range: coords, name };
};

const bricksFall = (bricks: BrickRange[], space: Space) => {
  //   bricks.sort(
  //     ({ range: coords1 }, { range: coords2 }) =>
  //       Math.min(...coords1.map(({ z }) => z)) -
  //       Math.min(...coords2.map(({ z }) => z))
  //   );

  const brickFall = (brickRange: BrickRange): boolean => {
    let canFallFurther = true;
    let hasFallen = false;
    for (const { x, y, z } of brickRange.range) {
      if (!space[x][y][z]) {
        throw Error("it should have been true");
      }
      space[x][y][z] = false;
    }
    while (canFallFurther) {
      for (const { x, y, z } of brickRange.range) {
        if (z < 1) {
          throw Error("fallen lower than could");
        }
        if (z === 1) {
          canFallFurther = false;
          break;
        }
        if (space[x][y][z - 1]) {
          canFallFurther = false;
          break;
        }
      }
      if (!canFallFurther) {
        break;
      }
      hasFallen = true;
      for (const coord of brickRange.range) {
        coord.z--;
      }
    }
    for (const { x, y, z } of brickRange.range) {
      space[x][y][z] = true;
    }
    return hasFallen;
  };
  let atLeastOnceFallen = false;
  for (const brick of bricks) {
    // console.log("\tfalling brick", brick.name);
    const brickFallen = brickFall(brick);
    if (brickFallen) {
      atLeastOnceFallen = true;
    }
    // const brickRange = getBrickRange({ start, end });
    // console.log(
    //   "\t",
    //   brick.name,
    //   "[",
    //   brick.range.map(({ x, y, z }) => `${x},${y},${z}`).join(" - "),
    //   "]",
    //   brickFallen
    // );
  }
  return atLeastOnceFallen;
};

const createSpace = (maxX: number, maxY: number, maxZ: number): Space =>
  new Array(maxX + 1)
    .fill(undefined)
    .map(() =>
      new Array(maxY + 1)
        .fill(undefined)
        .map(() => new Array(maxZ + 1).fill(false))
    );

const day22p1 = (rawInput: string) => {
  const bricks = parse(rawInput);
  const { maxX, maxY, maxZ } = getMaxMins(bricks);
  const bricksRanges = bricks.map(getBrickRange);

  const space: Space = createSpace(maxX, maxY, maxZ);
  for (const { range } of bricksRanges) {
    for (const { x, y, z } of range) {
      space[x][y][z] = true;
    }
  }

  console.log("total count of bricks ranges", bricksRanges.length);
    while (bricksFall(bricksRanges, space)) {
      console.log("falling");
    }

  let count = 0;
  for (const brickRange of bricksRanges) {
    console.log("removing brick", brickRange.name);
    const copySpace: Space = createSpace(maxX, maxY, maxZ);
    const bricksRangeCopy = bricksRanges
      .filter((br) => br.name !== brickRange.name)
      .map(({ range, name }) => ({
        name,
        range: range.map(({ x, y, z }) => ({ x, y, z })),
      }));
    for (const br of bricksRangeCopy) {
      for (const { x, y, z } of br.range) {
        if (copySpace[x][y][z]) {
          throw Error("fallen incorrectly");
        }
        copySpace[x][y][z] = true;
      }
    }
    const fallen = bricksFall(bricksRangeCopy, copySpace);

    if (!fallen) {
      count++;
    }
  }
  return count;
};

console.log(day22p1(smallRawInput));
console.log(day22p1(day22input));

// 713 too high

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

const getMaxs = (bricks: Brick[]) => {
  const getAllCoords = (coordName: CoordName) =>
    bricks.flatMap(({ start, end }) => [start[coordName], end[coordName]]);

  return {
    maxX: Math.max(...getAllCoords("x")),
    maxY: Math.max(...getAllCoords("y")),
    maxZ: Math.max(...getAllCoords("z")),
  };
};

type Space = boolean[][][];

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
  bricks.sort(
    ({ range: coords1 }, { range: coords2 }) =>
      Math.min(...coords1.map(({ z }) => z)) -
      Math.min(...coords2.map(({ z }) => z))
  );

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
  let countFallen = 0;
  for (const brick of bricks) {
    const brickFallen = brickFall(brick);
    if (brickFallen) {
      countFallen++;
    }
  }
  return countFallen;
};

const createSpace = (maxX: number, maxY: number, maxZ: number): Space =>
  new Array(maxX + 1)
    .fill(undefined)
    .map(() =>
      new Array(maxY + 1)
        .fill(undefined)
        .map(() => new Array(maxZ + 1).fill(false))
    );

const fillSpace = (space: Space, bricksRanges: BrickRange[]) => {
  for (const { range } of bricksRanges) {
    for (const { x, y, z } of range) {
      space[x][y][z] = true;
    }
  }
};

const removeBrick = (bricksRanges: BrickRange[], name: string) =>
  bricksRanges
    .filter((br) => br.name !== name)
    .map(({ range, name }) => ({
      name,
      range: range.map(({ x, y, z }) => ({ x, y, z })),
    }));

const day22 = (rawInput: string, cb: (fallen: number) => void) => {
  const bricks = parse(rawInput);
  const { maxX, maxY, maxZ } = getMaxs(bricks);
  const bricksRanges = bricks.map(getBrickRange);

  const space: Space = createSpace(maxX, maxY, maxZ);
  fillSpace(space, bricksRanges);
  bricksFall(bricksRanges, space);

  for (const brickRange of bricksRanges) {
    const copySpace: Space = createSpace(maxX, maxY, maxZ);
    const bricksRangeCopy = removeBrick(bricksRanges, brickRange.name);
    fillSpace(copySpace, bricksRangeCopy);
    const fallen = bricksFall(bricksRangeCopy, copySpace);

    cb(fallen);
  }
};

const day22p1 = (rawInput: string) => {
  let count = 0;
  day22(rawInput, (fallen) => {
    if (fallen === 0) {
      count++;
    }
  });
  return count;
};

const day22p2 = (rawInput: string) => {
  let count = 0;
  day22(rawInput, (fallen) => {
    count += fallen;
  });
  return count;

  //   const bricks = parse(rawInput);
  //   const { maxX, maxY, maxZ } = getMaxs(bricks);
  //   const bricksRanges = bricks.map(getBrickRange);

  //   const space: Space = createSpace(maxX, maxY, maxZ);
  //   fillSpace(space, bricksRanges);
  //   bricksFall(bricksRanges, space);

  //   let count = 0;
  //   for (const brickRange of bricksRanges) {
  //     const copySpace: Space = createSpace(maxX, maxY, maxZ);
  //     const bricksRangeCopy = removeBrick(bricksRanges, brickRange.name);
  //     fillSpace(copySpace, bricksRangeCopy);

  //     const fallen = bricksFall(bricksRangeCopy, copySpace);

  //     count += fallen;
  //   }
  //   return count;
};

console.log(day22p1(smallRawInput));
console.log(day22p1(day22input));

console.log("\n================ P2 ==============\n");

console.log(day22p2(smallRawInput));
console.log(day22p2(day22input));

// 1837 too low

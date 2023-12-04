import { day14input } from "./day14input";

const smallInput = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

interface Coord {
  x: number;
  y: number;
}

type Rock = Coord;

type RockPath = [Rock, Rock];
type PointContent = "rock" | "sand" | "air" | "floor";
type StrCoord = `${number},${number}`;
type SpaceMap = Record<StrCoord, PointContent>;

const parseInput = (input: string): RockPath[] => {
  const rockPaths: RockPath[] = [];
  const pathes = input.split("\n").map((row) =>
    row
      .split(" -> ")
      .map((coord) => coord.split(","))
      .map(([x, y]) => ({ x: Number(x), y: Number(y) }))
  );
  console.log("pathes", JSON.stringify(pathes));
  // const
  for (let i = 0; i < pathes.length; i++) {
    for (let j = 0; j < pathes[i].length - 1; j++) {
      const point = pathes[i][j];
      const nextPoint = pathes[i][j + 1];
      rockPaths.push([point, nextPoint]);
    }
  }
  return rockPaths;
};

const allCoords = (rockPaths: RockPath[], coord: keyof Coord) =>
  rockPaths.flatMap((rockPath) => rockPath.map((rock) => rock[coord]));

const allXs = (rockPaths: RockPath[]) => allCoords(rockPaths, "x");

const allYs = (rockPaths: RockPath[]) => allCoords(rockPaths, "y");

const findMinX = (rockPaths: RockPath[]): number =>
  Math.min(...allXs(rockPaths));

const findMaxX = (rockPaths: RockPath[]): number =>
  Math.max(...allXs(rockPaths));

const findMaxY = (rockPaths: RockPath[]): number =>
  Math.max(...allYs(rockPaths));

const strCoord = (x: number, y: number): StrCoord => `${x},${y}`;

const fillSpaceMap = (rockPaths: RockPath[]): SpaceMap => {
  const spaceMap: SpaceMap = {};
  for (let i = 0; i < rockPaths.length; i++) {
    const [start, end] = rockPaths[i];
    if (start.x === end.x) {
      for (
        let y = Math.min(start.y, end.y);
        y <= Math.max(start.y, end.y);
        y++
      ) {
        spaceMap[strCoord(start.x, y)] = "rock";
      }
    } else {
      for (
        let x = Math.min(start.x, end.x);
        x <= Math.max(start.x, end.x);
        x++
      ) {
        spaceMap[strCoord(x, start.y)] = "rock";
      }
    }
  }
  return spaceMap;
};

const drawMap = (
  spaceMap: SpaceMap,
  {
    // minX,
    // maxX,
    minY,
    maxY,
    startX,
  }: { minY: number; maxY: number; startX: number }
) => {
  const xs = Object.keys(spaceMap).map((key) => Number(key.split(",")[0]));
  const minX = Math.min(...xs) - 1;
  const maxX = Math.max(...xs) + 1;
  const floorY = maxY + 2;
  const matrixMap: PointContent[][] = new Array(floorY - minY + 1)
    .fill(undefined)
    .map(() => new Array(maxX - minX + 1).map(() => "air"));
  for (let i = minY; i <= floorY; i++) {
    for (let j = minX; j <= maxX; j++) {
      matrixMap[i - minY][j - minX] = spaceMap[strCoord(j, i)] ?? "air";
    }
  }
  for (let x = minX; x <= maxX; x++) {
    matrixMap[matrixMap.length - 1][x - minX] = "floor";
  }
  const characters: Record<PointContent, string> = {
    air: "🫧",
    rock: "🪨",
    sand: "💦",
    floor: "🪨",
    //   X: "❌",
  };
  //   const characters: Record<PointContent, string> = {
  //     air: ".",
  //     rock: "#",
  //     sand: "o",
  //     floor: "#",
  //     // X: "❌",
  //   };
  const matrixToRender = matrixMap.map((row) =>
    row.map((pointContent) => characters[pointContent])
  );
  matrixToRender[0][startX - minX] = "💧";
  //   matrixToRender[0][startX - minX] = "+";
  console.clear();
  console.log(
    `%c${matrixToRender.map((row) => row.join("")).join("\n")}`,
    "font-family: monospace;"
  );
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const day14 = async (input: string) => {
  const rockPaths = parseInput(input);
  const spaceMap = fillSpaceMap(rockPaths);
  const getPoint = ({ x, y }: Coord) => spaceMap[strCoord(x, y)] ?? "air";
  const minX = findMinX(rockPaths);
  const maxX = findMaxX(rockPaths);
  const minY = 0;
  const maxY = findMaxY(rockPaths);
  const floorY = maxY + 2;
  const startX = 500;
  const startY = 0;
  const drawThisMap = () =>
    drawMap(spaceMap, {
      //   minX,
      //   maxX,
      minY,
      maxY,
      startX,
    });

  const putNextSand = async () => {
    let sandPosition = { x: startX, y: startY };
    if (getPoint(sandPosition) !== "air") {
      return false;
    }
    while (sandPosition.y < floorY - 1) {
      // console.log(sandPosition.y, maxY);
      await delay(40);
      drawMap(
        { ...spaceMap, [strCoord(sandPosition.x, sandPosition.y)]: "sand" },
        { minY, maxY, startX }
      );      
      const nextPosition = { x: sandPosition.x, y: sandPosition.y + 1 };
      if (getPoint(nextPosition) === "air") {
        sandPosition = nextPosition;
        continue;
      }
      if (getPoint({ x: nextPosition.x - 1, y: nextPosition.y }) === "air") {
        sandPosition = { x: nextPosition.x - 1, y: nextPosition.y };
        continue;
      }
      if (getPoint({ x: nextPosition.x + 1, y: nextPosition.y }) === "air") {
        sandPosition = { x: nextPosition.x + 1, y: nextPosition.y };
        continue;
      }
    //   console.log("falling to", strCoord(sandPosition.x, sandPosition.y));
      spaceMap[strCoord(sandPosition.x, sandPosition.y)] = "sand";
      return true;
    }
    spaceMap[strCoord(sandPosition.x, sandPosition.y)] = "sand";
    return true;
    // throw Error(
    //   `we should not get here? ${JSON.stringify(sandPosition)}, ${
    //     spaceMap[strCoord(sandPosition.x, sandPosition.y)]
    //   }, ${spaceMap[strCoord(sandPosition.x, sandPosition.y - 1)]}`
    // );
    // spaceMap[strCoord(sandPosition.x, sandPosition.y)] = "sand";
    // return true;
  };

  let sands = 0;
  while (await putNextSand()) {
    sands++;
    // await delay(100);
  }
  //   console.log(JSON.stringify(spaceMap));
//   const sands = Object.values(spaceMap).filter(
//     (value) => value === "sand"
//   ).length;
  console.log("sands", sands);
  return sands;
  //   drawThisMap();
};

console.log("small", day14(smallInput));
console.log("real", day14(day14input));

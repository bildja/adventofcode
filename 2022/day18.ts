import { day18input } from "./day18input";

const smallRawInput = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`;

type Coord = [number, number, number];
type StrCoord = `${number},${number},${number}`;

const strCoord = ([x, y, z]: Coord): StrCoord => `${x},${y},${z}`;

const parseRawInput = (rawInput: string): Coord[] =>
  rawInput.split("\n").map((row) => row.split(",").map(Number) as Coord);

const day18 = (rawInput: string) => {
  const cubes = parseRawInput(rawInput);
  let totalArea = cubes.length * 6;
  const part1 = () => {
    const isAdjustedSize = (
      [x1, x2]: readonly [number, number],
      [y1, y2]: readonly [number, number],
      [z1, z2]: readonly [number, number]
    ) => {
      return x1 === x2 && y1 === y2 && Math.abs(z1 - z2) === 1;
    };
    for (let i = 0; i < cubes.length - 1; i++) {
      for (let j = i + 1; j < cubes.length; j++) {
        const [x1, y1, z1] = cubes[i];
        const [x2, y2, z2] = cubes[j];
        const sides = [
          [
            [x1, x2],
            [y1, y2],
            [z1, z2],
          ],
          [
            [z1, z2],
            [x1, x2],
            [y1, y2],
          ],
          [
            [y1, y2],
            [z1, z2],
            [x1, x2],
          ],
        ] as const;
        for (let k = 0; k < sides.length; k++) {
          if (isAdjustedSize(...sides[k])) {
            totalArea -= 2;
          }
        }
      }
    }
  };
  const part2 = () => {
    const minX = Math.min(...cubes.map(([x]) => x));
    const maxX = Math.max(...cubes.map(([x]) => x));
    const minY = Math.min(...cubes.map(([, y]) => y));
    const maxY = Math.max(...cubes.map(([, y]) => y));
    const minZ = Math.min(...cubes.map(([, , z]) => z));
    const maxZ = Math.max(...cubes.map(([, , z]) => z));
    // const cubesMap = new Map<number, Map<number, Map<Number, number>>>();
    const cubesSet = new Set<StrCoord>(rawInput.split("\n") as StrCoord[]);
    const hasCube = (coord: Coord) => cubesSet.has(strCoord(coord));
    // for (let i = 0; i < cubes.length; i++ {
    //     const [x, y, z] = cubes[i];
    //     cubesMap
    // }
    const visited = new Set<StrCoord>();
    const hasVisited = (coord: Coord) => visited.has(strCoord(coord));

    const getNeighbours = ([x, y, z]: Coord): Coord[] => [
      [x, y, z + 1],
      [x, y, z - 1],
      [x, y + 1, z],
      [x, y - 1, z],
      [x - 1, y, z],
      [x + 1, y, z],
    ];

    const getExterior = ([x, y, z]: Coord): number | null => {
      if (
        x === minX ||
        x === maxX ||
        y === minY ||
        y === maxY ||
        z === minZ ||
        z === maxZ
      ) {
        return null;
      }
      if (hasVisited([x, y, z])) {
        console.warn("shouldnt be here");
        return 0;
      }
      visited.add(strCoord([x, y, z]));
      const allNeighbours = getNeighbours([x, y, z]);
      const neighboursToVisit = allNeighbours.filter(
        (neigbhour) => !hasVisited(neigbhour) && !hasCube(neigbhour)
      );
      const cubeNeighbours = allNeighbours
        .map((neighbour) => (hasCube(neighbour) ? 1 : 0))
        .reduce((a, b) => a + b, 0 as number);
      //   if (!neighboursToVisit.length) {
      //     return cubeNeighbours;
      //   }

      const checkedNeighbours = neighboursToVisit.map(getExterior);
      if (
        checkedNeighbours.some((checkedNeighbour) => checkedNeighbour === null)
      ) {
        return null;
      }
      //   const allCheckedNeighbours = (checkedNeighbours as Coord[][]).flat();

      return (
        cubeNeighbours +
        (checkedNeighbours as number[]).reduce((a, b) => a + b, 0)
      );
      //   return [[x, y, z], ...allCheckedNeighbours];
    };

    const isExterior = (x: number, y: number, z: number): boolean => {
      if (
        x === minX ||
        x === maxX ||
        y === minY ||
        y === maxY ||
        z === minZ ||
        z === maxZ
      ) {
        return false;
      }
      if (hasCube([x, y, z])) {
        return false;
      }
      const neighbours: Coord[] = getNeighbours([x, y, z]);
      return neighbours.every((neighbour) => cubesSet.has(strCoord(neighbour)));
    };
    // console.log(minX, maxX, minY, maxY, minZ, maxZ);
    const volume = (maxX - minX) * (maxY - minY) * (maxZ - minZ);
    // console.log("volume", volume);
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          if (hasCube([x, y, z])) {
            continue;
          }
          if (hasVisited([x, y, z])) {
            continue;
          }
          //   if (x === 2 && y === 2 && z === 5) {
          //     console.log();
          //   }
          const exteriors = getExterior([x, y, z]);
          if (exteriors !== null) {
            totalArea -= exteriors;
          }
        }
      }
    }
  };
  part1();
  part2();
  return totalArea;
};

console.log("small", day18(smallRawInput));
console.log("big", day18(day18input));

// .#####.
// #.....#
// #.....#
// #.....#
// .#####.

// 4178 too high
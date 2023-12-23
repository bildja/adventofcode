import { Coord, CoordKey, coordKey, cEq } from "../utils/Coord";
import { getAllNeighbours } from "../utils/allNeighbours";
import { fitsTheMatr } from "../utils/fitsTheMatr";
import { day23input } from "./day23input";
import { fromCoordKey } from "../utils/Coord";

const smallRawInput = `
#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#`;

const parse = (rawInput: string) =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => line.split(""));

type QueueStep = {
  curCoord: Coord;
  curDist: number;
  curVisited: Set<CoordKey>;
};

const day23p1 = (rawInput: string) => {
  const map = parse(rawInput);
  const n = map.length;
  const m = map[0].length;
  const start: Coord = [0, 1];
  const target: Coord = [n - 1, m - 2];
  const distances = new Map<CoordKey, number>();
  const queue: QueueStep[] = [
    { curCoord: start, curDist: 0, curVisited: new Set() },
  ];

  while (queue.length) {
    const { curCoord, curDist, curVisited } = queue.shift()!;
    const curCoordKey = coordKey(curCoord);
    if (distances.has(curCoordKey) && distances.get(curCoordKey)! >= curDist) {
      continue;
    }
    distances.set(curCoordKey, curDist);
    if (cEq(curCoord, target)) {
      continue;
    }
    const nextVisited = new Set(curVisited);
    nextVisited.add(curCoordKey);
    const [curI, curJ] = curCoord;
    const neigboursMap: Record<string, Coord[]> = {
      ".": getAllNeighbours(curCoord),
      ">": [[curI, curJ + 1]],
      v: [[curI + 1, curJ]],
    };
    const neighbours = neigboursMap[map[curI][curJ]]
      .filter((coord) => fitsTheMatr(coord, map))
      .filter(([i, j]) => map[i][j] !== "#")
      .filter((coord) => !curVisited.has(coordKey(coord)));
    queue.push(
      ...neighbours.map((coord) => ({
        curCoord: coord,
        curDist: curDist + 1,
        curVisited: nextVisited,
      }))
    );
    queue.sort(({ curDist: a }, { curDist: b }) => b - a);
  }
  return distances.get(coordKey(target));
};

const day23p2 = (rawInput: string) => {
  const map = parse(rawInput);
  const n = map.length;
  const m = map[0].length;
  const start: Coord = [0, 1];
  const target: Coord = [n - 1, m - 2];

  type Intersection = Coord;
  const getNeigbhours = (coord: Coord) =>
    getAllNeighbours(coord)
      .filter((coord) => fitsTheMatr(coord, map))
      .filter(([i, j]) => map[i][j] !== "#");

  const getIntersections = (): Intersection[] => {
    const intersections: Intersection[] = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        if (map[i][j] === "#") {
          continue;
        }
        const neighbours = getNeigbhours([i, j]);
        if (neighbours.length > 2) {
          intersections.push([i, j]);
        }
      }
    }
    return intersections;
  };

  type Edges = Record<CoordKey, Record<CoordKey, number>>;

  const getEdges = (intersections: Intersection[]) => {
    const edges: Edges = {};
    for (let i = 0; i < intersections.length; i++) {
      const intersectionRoads = getNeigbhours(intersections[i]);
      for (const coord of intersectionRoads) {
        let curCoord = coord;
        let prevCoord = intersections[i];
        let neighbours = getNeigbhours(curCoord).filter(
          (coord) => !cEq(coord, prevCoord)
        );
        let distance = 1;
        while (neighbours.length === 1) {
          prevCoord = curCoord;
          curCoord = neighbours[0];
          distance++;
          neighbours = getNeigbhours(curCoord).filter(
            (coord) => !cEq(coord, prevCoord)
          );
        }
        const cik = coordKey(intersections[i]);
        const cik2 = coordKey(curCoord);
        if (!edges[cik]) {
          edges[cik] = {};
        }
        edges[cik][cik2] = Math.max(edges[cik][cik2] ?? -Infinity, distance);
        if (!edges[cik2]) {
          edges[cik2] = {};
        }
        edges[cik2][cik] = Math.max(edges[cik2][cik] ?? -Infinity, distance);
      }
    }
    return edges;
  };

  const intersections = getIntersections();
  intersections.unshift(start);
  intersections.push(target);
  const edges = getEdges(intersections);

  const getCount = (
    curIntersection: Intersection,
    curVisited: Set<CoordKey>
  ): number => {
    const cik = coordKey(curIntersection);
    if (curVisited.has(cik)) {
      return -Infinity;
    }
    if (cEq(curIntersection, target)) {
      return 0;
    }

    const nextVisited = curVisited;
    nextVisited.add(cik);
    const neighboursEntries = Object.entries(edges[cik]) as [
      CoordKey,
      number
    ][];
    if (neighboursEntries.length === 0) {
      nextVisited.delete(cik);
      return -Infinity;
    }

    const max = Math.max(
      ...neighboursEntries.map(
        ([ck, distance]) => distance + getCount(fromCoordKey(ck), nextVisited)
      )
    );
    nextVisited.delete(cik);
    return max;
  };
  return getCount(start, new Set());
};

console.log(day23p1(smallRawInput));
console.log(day23p1(day23input));

console.log("\n ============= P2 ========= \n");

console.log(day23p2(smallRawInput));
const startTime = performance.now();
console.log(day23p2(day23input));
console.log(`${((performance.now() - startTime) / 1000).toFixed(2)}s`);

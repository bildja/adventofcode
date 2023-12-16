import { day16input } from "./day16input";

const smallRawInput = `
.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`;

const parse = (rawInput: string) => rawInput.trim().split("\n");

type Coord = [number, number];

type Direction = "up" | "down" | "right" | "left";

type Beam = {
  direction: Direction;
  coord: Coord;
};

const fitsTheMap = <T>([i, j]: [number, number], map: T[][] | string[]) =>
  i >= 0 && j >= 0 && i < map.length && j < map[i].length;

const calcEnergizedCount = (map: string[], start: Beam): number => {
  const energizeMap: Set<Direction>[][] = new Array(map.length)
    .fill(undefined)
    .map((_, i) =>
      new Array(map[i].length).fill(undefined).map(() => new Set())
    );

  const getEnergizeMapSnapshot = () =>
    energizeMap
      .map((line) => line.map((el) => (el.size > 0 ? "#" : ".")).join(""))
      .join("\n");

  const queue: Beam[] = [start];
  while (queue.length) {
    const beam = queue.shift()!;
    const [is, js] = beam.coord;
    if (fitsTheMap([is, js], map) && energizeMap[is][js].has(beam.direction)) {
      continue;
    }
    if (fitsTheMap([is, js], map)) {
      energizeMap[is][js].add(beam.direction);
    }
    const directionMovements: Record<
      Direction,
      { axis: 0 | 1; dirValue: -1 | 1 }
    > = {
      up: {
        axis: 0,
        dirValue: -1,
      },
      down: {
        axis: 0,
        dirValue: 1,
      },
      right: {
        axis: 1,
        dirValue: 1,
      },
      left: {
        axis: 1,
        dirValue: -1,
      },
    };
    beam.coord[directionMovements[beam.direction].axis] +=
      directionMovements[beam.direction].dirValue;

    if (!fitsTheMap(beam.coord, map)) {
      continue;
    }
    const [i, j] = beam.coord;
    switch (map[i][j]) {
      case "/": {
        const directionsMap: Record<Direction, Direction> = {
          up: "right",
          down: "left",
          right: "up",
          left: "down",
        };
        beam.direction = directionsMap[beam.direction];
        queue.push(beam);
        break;
      }
      case "\\": {
        const directionsMap: Record<Direction, Direction> = {
          up: "left",
          down: "right",
          right: "down",
          left: "up",
        };
        beam.direction = directionsMap[beam.direction];
        queue.push(beam);
        break;
      }
      case "|": {
        if (beam.direction === "left" || beam.direction === "right") {
          queue.push({
            direction: "up",
            coord: [i, j],
          });
          queue.push({
            direction: "down",
            coord: [i, j],
          });
        } else {
          queue.push(beam);
        }
        break;
      }
      case "-": {
        if (beam.direction === "up" || beam.direction === "down") {
          queue.push({
            direction: "right",
            coord: [i, j],
          });
          queue.push({
            direction: "left",
            coord: [i, j],
          });
        } else {
          queue.push(beam);
        }
        break;
      }
      case ".": {
        queue.push(beam);
      }
      default:
        break;
    }
  }
  //   console.log(getEnergizeMapSnapshot());
  return energizeMap
    .map((energizeLine) => energizeLine.filter((el) => el.size > 0).length)
    .reduce((a, b) => a + b);
};

const day16p1 = (rawInput: string) => {
  const map = parse(rawInput);
  return calcEnergizedCount(map, { direction: "right", coord: [0, -1] });
};

const day16p2 = (rawInput: string) => {
  const map = parse(rawInput);
  const energizedCounts: number[] = [];
  const n = map.length;
  for (let i = 0; i < n; i++) {
    const beams: Beam[] = [
      {
        direction: "up",
        coord: [n, i],
      },
      {
        direction: "down",
        coord: [-1, i],
      },
      {
        direction: "right",
        coord: [i, -1],
      },
      {
        direction: "left",
        coord: [i, n],
      },
    ];
    for (const beam of beams) {
      energizedCounts.push(calcEnergizedCount(map, beam));
    }
  }
  return Math.max(...energizedCounts);
};

console.log(day16p1(smallRawInput));
console.log(day16p1(day16input));

console.log("\n=========== P2 ============\n");
console.log(day16p2(smallRawInput));
console.log(day16p2(day16input));

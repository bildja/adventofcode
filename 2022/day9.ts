import { day9input } from "./day9input";

const smallRawInput = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

const smallRawInputP2 = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;

type VisitedPlace = `${number},${number}`;
type Direction = "R" | "L" | "U" | "D";
type Coord = { x: number; y: number };

const day9 = (rawInput: string) => {
  const tailVisitedPlaces = new Set<VisitedPlace>();
  const rows = rawInput.split("\n");
  const head: Coord = { x: 0, y: 0 };
  const tails: Coord[] = new Array(9)
    .fill(undefined)
    .map(() => ({ x: 0, y: 0 }));

  const moveHead = (direction: Direction) => {
    switch (direction) {
      case "L": {
        head.x--;
        break;
      }
      case "R": {
        head.x++;
        break;
      }
      case "U": {
        head.y++;
        break;
      }
      case "D": {
        head.y--;
        break;
      }
      default: {
        throw Error(`unknown step ${direction}`);
      }
    }
  };

  const drawDebug = () => {
    const map: string[][] = new Array(5)
      .fill(undefined)
      .map((row) => new Array(6).fill("."));

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 6; j++) {
        for (let k = 0; k < tails.length; k++) {
          const tail = tails[k];
          if (tail.x === j && tail.y === i) {
            map[5 - i - 1][j] = String(k + 1);
          }
        }
        if (head.x === j && head.y === i) {
          map[5 - i - 1][j] = "H";
        }
      }
    }
    console.log(map.map((row) => row.join(" ")).join("\n"), "\n\n");
  };
  const moveTail = (tail: Coord, head: Coord) => {
    const xDiff = head.x - tail.x;
    const absXDiff = Math.abs(xDiff);
    const yDiff = head.y - tail.y;
    const absYDiff = Math.abs(yDiff);

    if (absXDiff <= 1 && absYDiff <= 1) {
      return;
    }
    if (!absXDiff) {
      tail.y += absYDiff / yDiff;
      return;
    }
    if (!absYDiff) {
      tail.x += absXDiff / xDiff;
      return;
    }

    tail.x += absXDiff / xDiff;
    tail.y += absYDiff / yDiff;
  };

  const moveTails = () => {
    moveTail(tails[0], head);
    for (let i = 1; i < tails.length; i++) {
      moveTail(tails[i], tails[i - 1]);
    }
  };
  const rememberTailPosition = (tail: Coord) => {
    tailVisitedPlaces.add(`${tail.x},${tail.y}`);
  };

  const parseRow = (row: string): { direction: Direction; steps: number } => {
    const [direction, stepsStr] = row.split(" ") as [Direction, string];
    const steps = Number(stepsStr);
    return { direction, steps };
  };

  for (let i = 0; i < rows.length; i++) {
    const { steps, direction } = parseRow(rows[i]);

    for (let j = 0; j < steps; j++) {
      moveHead(direction);
      moveTails();
      //   drawDebug();
      rememberTailPosition(tails[tails.length - 1]);
    }
  }

  return tailVisitedPlaces.size;
};

console.log("small", day9(smallRawInputP2));
console.log("real", day9(day9input));

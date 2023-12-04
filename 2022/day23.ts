import { day23input } from "./day23input";

const smallInput = `....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`;

const smallestInput = `.....
..##.
..#..
.....
..##.
.....`;

type StrCoord = `${number},${number}`;
type Coord = [number, number];
const strCoord = ([x, y]: Coord): StrCoord => `${x},${y}`;
const fromStrCoord = (strCoord: StrCoord): Coord =>
  strCoord.split(",").map(Number) as Coord;

type Field = Set<StrCoord>;

const parseInput = (input: string): Field =>
  new Set(
    input
      .split("\n")
      .map((row) => row.split("").map((ch) => ch === "#"))
      .map((row, y) =>
        row.reduce(
          (acc, ch, x) => (ch ? [...acc, strCoord([x, y])] : acc),
          [] as StrCoord[]
        )
      )
      .flat()
  );

const directions = ["north", "south", "west", "east"] as const;
type Direction = typeof directions[number];

interface DirectionToConsider {
  adjucent: (coord: Coord) => Coord[];
  goFrom: (coord: Coord) => Coord;
}
type DirectionsToConsider = Record<Direction, DirectionToConsider>;

const getFieldBoundaries = (field: Field) => {
  const elves = Array.from(field).map(fromStrCoord);
  const xs = elves.map(([x]) => x);
  const ys = elves.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
};

const printField = (field: Field, currentElf?: StrCoord) => {
  const { x: startX, y: startY, width, height } = getFieldBoundaries(field);
  const elveEmojies = ["🧝‍♀️", "🧝", "🧝‍♂️"];

  //   console.log(startX, startY, width, height);
  const fieldStr = new Array(height + 4)
    .fill(undefined)
    .map((a, y) =>
      new Array(width + 4)
        .fill(undefined)
        .map((a, x) =>
          field.has(strCoord([x + startX - 2, y + startY - 2]))
            ? strCoord([x + startX - 2, y + startY - 2]) === currentElf
              ? "👻"
              : elveEmojies[(x * y) % 3]
            : "🫧"
        )
        .join("")
    )
    .join("\n");
  console.clear();
  console.log(fieldStr);
};

const directionsToConsider: DirectionsToConsider = {
  north: {
    adjucent: ([x, y]) => [
      [x - 1, y - 1],
      [x, y - 1],
      [x + 1, y - 1],
    ],
    goFrom: ([x, y]) => [x, y - 1],
  },
  south: {
    adjucent: ([x, y]) => [
      [x - 1, y + 1],
      [x, y + 1],
      [x + 1, y + 1],
    ],
    goFrom: ([x, y]) => [x, y + 1],
  },
  west: {
    adjucent: ([x, y]) => [
      [x - 1, y - 1],
      [x - 1, y],
      [x - 1, y + 1],
    ],

    goFrom: ([x, y]) => [x - 1, y],
  },
  east: {
    adjucent: ([x, y]) => [
      [x + 1, y - 1],
      [x + 1, y],
      [x + 1, y + 1],
    ],
    goFrom: ([x, y]) => [x + 1, y],
  },
};
const getAllAdjucent = ([x, y]: Coord): Coord[] => [
  [x - 1, y - 1],
  [x, y - 1],
  [x + 1, y - 1],
  [x - 1, y],
  [x + 1, y],
  [x - 1, y + 1],
  [x, y + 1],
  [x + 1, y + 1],
];

const elvePropose = (
  field: Field,
  coord: StrCoord,
  startDirectionPointer: number
): StrCoord | undefined => {
  const [x, y] = fromStrCoord(coord);
  const allAdjucent = getAllAdjucent([x, y]);
  if (allAdjucent.map(strCoord).every((sc) => !field.has(sc))) {
    return undefined;
  }
  for (
    let i = startDirectionPointer;
    i < startDirectionPointer + directions.length;
    i++
  ) {
    const directionPointer = i % directions.length;
    const direction = directions[directionPointer];
    const directionToConsider = directionsToConsider[direction];
    const adjacent = directionToConsider.adjucent([x, y]);
    const shouldGo = adjacent.every((coord) => !field.has(strCoord(coord)));
    if (shouldGo) {
      return strCoord(directionToConsider.goFrom([x, y]));
    }
  }
};

export const day23 = (input: string) => {
  let field = parseInput(input);

  let firstDirectionPointer = 0;

  //   printField(field);
  let k = 0;
  while (true) {
    const propositions: Record<StrCoord, number> = {};
    for (const elve of field) {
      //   printField(field, elve);
      const strGoTo = elvePropose(field, elve, firstDirectionPointer);
      if (strGoTo !== undefined) {
        propositions[strGoTo] = (propositions[strGoTo] ?? 0) + 1;
      }
    }
    const moves = Object.values(propositions).filter((a) => a === 1).length;
    if (moves === 0) {
      return k + 1;
    }
    const newField: Field = new Set();
    for (const elve of field) {
      const strGoTo = elvePropose(field, elve, firstDirectionPointer);
      if (strGoTo === undefined || propositions[strGoTo] !== 1) {
        newField.add(elve);
        continue;
      }
      newField.add(strGoTo);
    }
    field = newField;
    firstDirectionPointer = (firstDirectionPointer + 1) % directions.length;
    // printField(field);
    k++;
  }
  const { width, height } = getFieldBoundaries(field);
  //   printField(field);
  console.log(width, height, field.size);
  return width * height - field.size;
};

// console.log("smallest", day23(smallestInput));
console.log("small", day23(smallInput));
console.log("big", day23(day23input));

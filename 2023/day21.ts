import { day21input } from "./day21input";
import { Coord } from "../utils/Coord";
import { getAllNeigbhours } from "../utils/allNeighbours";

const smallRawInput = `
...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;

const parse = (rawInput: string) =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => line.split(""));

const findAndReplaceStart = (map: string[][]): Coord => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "S") {
        map[i][j] = ".";
        return [i, j];
      }
    }
  }
  throw Error("no start");
};

const day21p1 = (rawInput: string, steps: number) => {
  const map = parse(rawInput);
  const n = map.length;
  const m = map[0].length;
  const start = findAndReplaceStart(map);
  const getMapPoint = ([i, j]: Coord): string => {
    i = ((i % n) + n) % n;
    j = ((j % m) + m) % m;
    return map[i][j];
  };

  const key = ([i, j]: Coord) => `${i},${j}`;
  let visitedMap = new Map<string, Coord>();
  visitedMap.set(key(start), start);

  for (let k = 0; k < steps; k++) {
    const newVisitedMap = new Map<string, Coord>();
    for (const coord of visitedMap.values()) {
      for (const neigbhour of getAllNeigbhours(coord).filter(
        (coord) => getMapPoint(coord) !== "#"
      )) {
        newVisitedMap.set(key(neigbhour), neigbhour);
      }
    }
    visitedMap = newVisitedMap;
  }
  return visitedMap.size;
};

const day21p2 = (rawInput: string, steps: number) => {
  // no runtime solution so far :(
  const map = parse(rawInput);
  const n = map.length;
  // const a = 15286 / 17161;
  // const b = 210 / 131;
  // const c = 1;
  const a = 15286;
  const b = 15394;
  const c = 3884;
  const x = Math.floor(steps / n);
  return a * x * x + b * x + c;
};

console.log(day21p1(smallRawInput, 6));
console.log(day21p1(day21input, 64));

console.log("\n============== P2 ============\n");
// console.log(day21p1(day21input, 26501365));
console.log(day21p2(day21input, 26501365));
// console.log(day21p2(smallRawInput, 10));
// console.log(day21p2(smallRawInput, 50)); // 1594
// console.log(`%c ${day21p2(smallRawInput, 100)}`, "color: red"); // 6536
for (let i = 2; i < 10; i += 2) {
  // console.log(`%c ${day21p2(smallRawInput, 131 * i)}`, "color: red"); // 6536
  // console.log(`%c ${day21p1(day21input, 131 * i)}`, "color: red"); // 6536
}
// console.log(`%c ${day21p2(smallRawInput, 121)}`, "color: red"); // 6536
// console.log(`%c ${day21p2(smallRawInput, 1331)}`, "color: red"); // 6536
// console.log(`%c ${day21p2(smallRawInput, 100)}`, "color: red"); // 6536
// console.log(day21p2(smallRawInput, 500)); // 167004
// console.log(day21p2(smallRawInput, 1000));
// console.log(day21p2(smallRawInput, 5000));
// const a: any = [];
// a.reduce((acc, el, i) => {
//   if (i % 2) {
//     acc[i - 1].push(parseInt(el));
//   } else {
//     acc.push([parseInt(el.replace("steps").trim())]);
//   }
//   return acc;
// }, []);

const aa = [
  [131, 16148],
  [262, 61565],
  [393, 140174],
  [524, 245417],
  [655, 386488],
  [786, 551557],
  [917, 755090],
];

// for (const [steps, expected] of aa) {
//   const res = day21p2(day21input, steps);
//   console.log(res, res === expected);
// }

// x * (524 * 524) + 524 * y + z = 245417
// x * (655 * 655) + 655 * y + z = 386488
// x * (786 * 786) + 786 * y + z = 551557

// a = 11999/17161
// b = 33080/131
// c = -78887

// a = 16596/17161
// b = -4371/131
// c = 3923

// 679198560334555.2 too high
// 646950270486014
// 644698974530376 too high
// 625587097150084
// 625587094178884 too low

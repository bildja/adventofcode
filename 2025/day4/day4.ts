import { day4input } from "./day4input";

const smallRawInput = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;

const parse = (rawInput: string) =>
  rawInput.split("\n").map((row) => row.split(""));

const markLiftableRolls = (map: string[][]) => {
  const newMap = map.map((row) => [...row]);
  const isLiftable = (i: number, j: number) => {
    const neighbours: [number, number][] = [
      [i - 1, j - 1],
      [i - 1, j],
      [i - 1, j + 1],
      [i, j - 1],
      [i, j + 1],
      [i + 1, j - 1],
      [i + 1, j],
      [i + 1, j + 1],
    ].filter(
      ([x, y]) => x >= 0 && x < map.length && y >= 0 && y < map[0].length,
    ) as [number, number][];
    return (
      neighbours.map(([x, y]) => map[x][y]).filter((val) => val === "@")
        .length < 4
    );
  };
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "@" && isLiftable(i, j)) {
        newMap[i][j] = "x";
      }
    }
  }
  return newMap;
};

const countToRemove = (map: string[][]) =>
  map.flat().filter((val) => val === "x").length;

const day4p1 = (rawInput: string) =>
  countToRemove(markLiftableRolls(parse(rawInput)));

console.log(day4p1(smallRawInput));
console.log(day4p1(day4input));

const removeMarked = (map: string[][]) =>
  map.map((row) => row.map((val) => (val === "x" ? "." : val)));

const day4p2 = (rawInput: string) => {
  let map = parse(rawInput);
  let totalRemovedCount = 0;
  while (true) {
    map = markLiftableRolls(map);
    const currentRemovedCount = countToRemove(map);
    totalRemovedCount += currentRemovedCount;
    map = removeMarked(map);
    if (currentRemovedCount === 0) {
      break;
    }
  }
  return totalRemovedCount;
};

console.log(day4p2(smallRawInput));
console.log(day4p2(day4input));

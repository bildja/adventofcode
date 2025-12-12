import { day6input } from "./day06input";

const smallRawInput = `Time:      7  15   30
Distance:  9  40  200`;

type Race = {
  time: number;
  distance: number;
};

const parse = (rawInput: string): Race[] => {
  const [times, distances] = rawInput
    .split("\n")
    .map((line) => line.replace(/^\w+:/, "").trim().split(/\s+/).map(Number));
  return times.reduce(
    (races, time, i) => [...races, { time, distance: distances[i] }],
    [] as Race[]
  );
};

const parseP2 = (rawInput: string): Race => {
  const [time, distance] = rawInput
    .split("\n")
    .map((line) =>
      Number(line.replace(/^\w+:/, "").trim().replaceAll(/\s+/g, ""))
    )
    .map(Number);
  return { time, distance };
};

const countByRace = ({ time, distance }: Race): number => {
  // -x * x + time * x - distance > 0
  const a = -1;
  const b = time;
  const c = -distance;
  const D = b ** 2 - 4 * a * c;
  const x1 = Math.floor(((-b + Math.sqrt(D)) / 2) * a) + 1;
  const x2 = Math.ceil(((-b - Math.sqrt(D)) / 2) * a) - 1;
  return x2 - x1 + 1;
};

const day6p1 = (rawInput: string) =>
  parse(rawInput)
    .map(countByRace)
    .reduce((acc, count) => acc * count, 1);

const day6p2 = (rawInput: string) => countByRace(parseP2(rawInput));

console.log(day6p1(smallRawInput));
console.log(day6p1(day6input));

console.log(day6p2(smallRawInput));
console.log(day6p2(day6input));

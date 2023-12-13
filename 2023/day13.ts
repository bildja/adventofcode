import { day13input } from "./day13input";

const smallRawInput = `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;

const parse = (rawInput: string) =>
  rawInput
    .trim()
    .split("\n\n")
    .map((pattern) => pattern.split("\n").map((line) => line.split("")));

const findVerticalReflection = (pattern: string[][]): number[] => {
  const m = pattern[0].length;
  const getCol = (j: number) => {
    const col: string[] = [];
    for (let i = 0; i < pattern.length; i++) {
      col.push(pattern[i][j]);
    }
    return col.join("");
  };
  const columns: string[] = [];
  for (let j = 0; j < m; j++) {
    columns.push(getCol(j));
  }

  const isVerticalReflection = (j: number) => {
    let jl = j;
    let jr = j + 1;

    while (jl >= 0 && jr < m) {
      if (columns[jl] !== columns[jr]) {
        return false;
      }
      jl--;
      jr++;
    }
    return true;
  };

  const allVerticalReflections = [];
  for (let j = 0; j < m - 1; j++) {
    if (isVerticalReflection(j)) {
      allVerticalReflections.push(j);
    }
  }
  return allVerticalReflections;
};

const findHorizontalReflection = (pattern: string[][]): number[] => {
  const n = pattern.length;
  const rows = pattern.map((line) => line.join(""));
  const isHorizontalReflection = (i: number) => {
    let it = i;
    let ib = i + 1;
    while (it >= 0 && ib < n) {
      if (rows[it] !== rows[ib]) {
        return false;
      }
      it--;
      ib++;
    }
    return true;
  };

  const allHorizontalReflections: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    if (isHorizontalReflection(i)) {
      allHorizontalReflections.push(i);
    }
  }

  return allHorizontalReflections;
};

const findReflection = (pattern: string[][]) => {
  const verticalReflection = findVerticalReflection(pattern);

  const horizontalReflection = findHorizontalReflection(pattern);

  return {
    horizontal: horizontalReflection.length > 0 ? horizontalReflection[0] : -1,
    vertical: verticalReflection.length > 0 ? verticalReflection[0] : -1,
  };
};

const ver = (vertical: number) => vertical + 1;
const hor = (horizontal: number) => (horizontal + 1) * 100;

const findAllReflections = (pattern: string[][]) => {
  const verticalReflection = findVerticalReflection(pattern);
  const horizontalReflection = findHorizontalReflection(pattern);
  return { horizontal: horizontalReflection, vertical: verticalReflection };
};

const day13p1 = (rawInput: string) =>
  parse(rawInput)
    .map(findReflection)
    .map(({ horizontal, vertical }) =>
      vertical !== -1 ? ver(vertical) : hor(horizontal)
    )
    .reduce((a, b) => a + b);

const findSmudge = (pattern: string[][]) => {
  const oldReflection = findReflection(pattern);

  for (let i = 0; i < pattern.length; i++) {
    for (let j = 0; j < pattern[i].length; j++) {
      const el = pattern[i][j];
      pattern[i][j] = el === "." ? "#" : ".";
      const reflections = findAllReflections(pattern);
      pattern[i][j] = el;
      if (
        reflections.horizontal.length === 0 &&
        reflections.vertical.length === 0
      ) {
        continue;
      }
      for (let k = 0; k < reflections.vertical.length; k++) {
        if (reflections.vertical[k] !== oldReflection.vertical) {
          return ver(reflections.vertical[k]);
        }
      }
      for (let k = 0; k < reflections.horizontal.length; k++) {
        if (reflections.horizontal[k] !== oldReflection.horizontal) {
          return hor(reflections.horizontal[k]);
        }
      }
    }
  }

  throw Error("could not find new reflections?");
};

const day13p2 = (rawInput: string) =>
  parse(rawInput)
    .map(findSmudge)
    .reduce((a, b) => a + b);

console.log(day13p1(smallRawInput));
console.log(day13p1(day13input));

console.log("\n======= P2 =======\n");
console.log(day13p2(smallRawInput));
console.log(day13p2(day13input));

// 25217 too low

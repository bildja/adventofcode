import { day5input } from "./day5input";

const smallRawInput = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;

type Range = [number, number];

const parse = (
  rawInput: string,
): { ranges: Range[]; ingredients: number[] } => {
  const [rangesRaw, ingredientsRaw] = rawInput.split("\n\n");
  return {
    ranges: rangesRaw
      .split("\n")
      .map((rangeStr) => rangeStr.split("-").map(Number)) as Range[],
    ingredients: ingredientsRaw.split("\n").map(Number),
  };
};

const uniteIntersectedRanges = (ranges: Range[]) => {
  ranges = ranges.toSorted(([a], [b]) => a - b);
  let i = 1;
  while (i < ranges.length) {
    const [prevMin, prevMax] = ranges[i - 1];
    const [min, max] = ranges[i];
    if (prevMax >= min) {
      ranges.splice(i - 1, 2, [prevMin, Math.max(prevMax, max)]);
    } else {
      i++;
    }
  }
  return ranges;
};

const day5p1 = (rawInput: string) => {
  const { ranges, ingredients } = parse(rawInput);
  const freshIngredients = new Set<number>();
  const unitedRanges = uniteIntersectedRanges(ranges);
  for (let i = 0; i < ingredients.length; i++) {
    const ingredient = ingredients[i];
    // since ranges are sorted now, we can make the whole thing n*log(n) now
    // by doing binary search here instead of linear
    let start = 0;
    let end = unitedRanges.length - 1;

    while (start <= end) {
      const j = Math.floor((end + start) / 2);
      const [min, max] = unitedRanges[j];
      if (ingredient > max) {
        start = j + 1;
        continue;
      }
      if (ingredient < min) {
        end = j - 1;
        continue;
      }
      freshIngredients.add(ingredient);
      break;
    }
  }
  return freshIngredients.size;
};

console.log(day5p1(smallRawInput));
console.log(day5p1(day5input));

const day5p2 = (rawInput: string) => {
  const { ranges } = parse(rawInput);
  return uniteIntersectedRanges(ranges)
    .map(([min, max]) => max - min + 1)
    .reduce((a, b) => a + b);
};

console.log("day5p2", day5p2(smallRawInput));
console.log("day5p2", day5p2(day5input));

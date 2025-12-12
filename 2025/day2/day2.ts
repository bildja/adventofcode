import { smallInput, bigInput } from "./day2input";

const parseInput: (input: string) => [number, number][] = (input) =>
  input.split(/,\s*/).map((rangeStr) => rangeStr.split("-").map(Number)) as [
    number,
    number,
  ][];

function isInvalidP1(num: number) {
  const len = Math.floor(Math.log10(num)) + 1;
  const strNum = String(num);
  if (len % 2 !== 0) {
    return false;
  }
  const halfLen = len / 2;
  return strNum.slice(0, halfLen) === strNum.slice(-halfLen);
}

function isInvalidP2(num: number) {
  const len = Math.floor(Math.log10(num)) + 1;
  if (len === 1) {
    return false;
  }
  const strNum = String(num);

  const isChunkSizeInvalid = (chunkSize: number) => {
    const chunksCount = len / chunkSize;
    let prevChunk = strNum.slice(0, chunkSize);
    for (let j = 1; j < chunksCount; j++) {
      const chunk = strNum.slice(j * chunkSize, j * chunkSize + chunkSize);

      if (chunk !== prevChunk) {
        return false;
      }
      prevChunk = chunk;
    }
    return true;
  };
  for (let chunkSize = 1; chunkSize < len / 2 + 1; chunkSize++) {
    if (len % chunkSize !== 0) {
      continue;
    }
    if (isChunkSizeInvalid(chunkSize)) {
      return true;
    }
  }
  return false;
}

const invalidItemsInRange = (
  range: [number, number],
  invalidPredicate: (val: number) => boolean,
) => {
  const [min, max] = range;
  const invalidItems: number[] = [];
  for (let i = min; i <= max; i++) {
    if (invalidPredicate(i)) {
      invalidItems.push(i);
    }
  }
  console.log("\n");
  console.log(range.join("-"), invalidItems.join(", ") || "none");
  return invalidItems.reduce((a, b) => a + b, 0);
};

const part1 = (input: string) => {
  const ranges = parseInput(input);
  return ranges
    .map((range) => invalidItemsInRange(range, isInvalidP1))
    .reduce((a, b) => a + b, 0);
};

// console.log("p1 small", part1(smallInput));
// console.log("p1 big", part1(bigInput));

const part2 = (input: string) => {
  const ranges = parseInput(input);
  return ranges
    .map((range) => invalidItemsInRange(range, isInvalidP2))
    .reduce((a, b) => a + b, 0);
};
// console.log("p2 small", part2(smallInput));
console.log("p2 small", part2(bigInput));
// 25912654324 too high
// 25912654282

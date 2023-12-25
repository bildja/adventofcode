import { day9input } from "./day9input";

const smallRawInput = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

const parse = (rawInput: string): number[][] =>
  rawInput.split("\n").map((line) => line.split(" ").map(Number));

const getDiffArray = (seq: number[]): number[] => {
  const diffArray: number[] = [];
  for (let i = 1; i < seq.length; i++) {
    diffArray.push(seq[i] - seq[i - 1]);
  }
  return diffArray;
};

const areAllZeroes = (seq: number[]) => seq.every((el) => el === 0);

const calcNextNumber = (seq: number[]): number => {
  const diffArray = getDiffArray(seq);
  if (areAllZeroes(diffArray)) {
    return seq[0];
  }
  return seq[seq.length - 1] + calcNextNumber(diffArray);
};

const calcPrevNumber = (seq: number[]): number => {
  const diffArray = getDiffArray(seq);
  if (areAllZeroes(diffArray)) {
    return seq[0];
  }
  return seq[0] - calcPrevNumber(diffArray);
};

const day9p1 = (rawInput: string) =>
  parse(rawInput)
    .map(calcNextNumber)
    .reduce((a, b) => a + b);

const day9p2 = (rawInput: string) =>
  parse(rawInput)
    .map(calcPrevNumber)
    .reduce((a, b) => a + b);

console.log(day9p1(smallRawInput));
console.log(day9p1(day9input));

console.log(day9p2(smallRawInput));
console.log(day9p2(day9input));

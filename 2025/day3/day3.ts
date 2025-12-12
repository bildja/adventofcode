import { day3input } from "./day3input";

const smallRawInput = `987654321111111
811111111111119
234234234234278
818181911112111`;

const parse = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split("").map(Number));

const maxBankJoltage = (bank: number[], batteriesCount: number) => {
  let maxIndex = -1;
  let value = 0;
  for (let i = 0; i < batteriesCount; i++) {
    let max = 0;
    for (
      let j = maxIndex + 1;
      j < bank.length - (batteriesCount - 1 - i);
      j++
    ) {
      if (bank[j] > max) {
        max = bank[j];
        maxIndex = j;
      }
    }
    value = value * 10 + max;
  }
  return value;
};

const day3p1 = (rawInput: string) => {
  const banks = parse(rawInput);
  return banks
    .map((bank) => maxBankJoltage(bank, 2))
    .reduce((a, b) => a + b, 0);
};

console.log(day3p1(smallRawInput));
console.log(day3p1(day3input));

const day3p2 = (rawInput: string) => {
  const banks = parse(rawInput);
  return banks
    .map((bank) => maxBankJoltage(bank, 12))
    .reduce((a, b) => a + b, 0);
};

console.log(day3p2(smallRawInput));
console.log(day3p2(day3input));

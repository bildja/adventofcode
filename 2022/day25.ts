import { day25input } from "./day25input";

const smallInput = `1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`;

const chMap: Record<string, number | undefined> = {
  "-": -1,
  "=": -2,
};

const log5 = (num: number) => Math.log(num) / Math.log(5);

const snafuToNum = (snafu: string): number =>
  Array.from(snafu).reduce(
    (acc, digit, i) =>
      acc + (chMap[digit] ?? Number(digit)) * 5 ** (snafu.length - i - 1),
    0
  );

const singleNumToSnafu = (num: number): string =>
  ["0", "1", "2", "1=", "1-", "10", "11", "12", "2=", "2-"][num];

const numToSnafu = (num: number): string => {
  const maxPow = Math.floor(log5(num));
  //   const len = maxPow + 1;
  const addendums: number[] = [];
  for (let i = maxPow; i >= 0; i--) {
    const addendum = Math.floor(num / 5 ** i);
    num -= addendum * 5 ** i;
    addendums.push(addendum);
  }
  const snafuDigits: string[] = addendums.map(singleNumToSnafu);
  let i = snafuDigits.length - 1;
  while (i >= 0) {
    const snafuDigit = snafuDigits[i];
    if (snafuDigit.length === 1) {
      i--;
      continue;
    }
    const [first, second] = snafuDigit.split("");
    snafuDigits[i] = second;
    if (i === 0) {
      snafuDigits.unshift(first);
      break;
    }
    const nextSnafuDigit = snafuDigits[i - 1];
    const numFirst = Number(first);
    snafuDigits[i - 1] = singleNumToSnafu(
      snafuToNum(nextSnafuDigit) + numFirst
    );
  }
  //   console.log(addendums);
  return snafuDigits.join("");
};

const day25 = (input: string) =>
  numToSnafu(
    input
      .split("\n")
      .map(snafuToNum)
      .reduce((a, b) => a + b, 0)
  );

console.assert(day25(smallInput) === "2=-1=0", "small");
console.assert("2-2=12=1-=-1=000=222" === day25(day25input), "big");

console.assert(snafuToNum("1=-0-2") === 1747, snafuToNum("1=-0-2"));
console.assert(snafuToNum("20012") === 1257);
console.assert(snafuToNum("1=-1=") === 353);

console.assert(numToSnafu(1) === "1");
console.assert(numToSnafu(2) === "2");
console.assert(numToSnafu(3) === "1=");
console.assert(numToSnafu(4) === "1-");
console.assert(numToSnafu(5) === "10");
console.assert(numToSnafu(6) === "11");
console.assert(numToSnafu(7) === "12");
console.assert(numToSnafu(8) === "2=");
console.assert(numToSnafu(9) === "2-");
console.assert(numToSnafu(10) === "20");
console.assert(numToSnafu(15) === "1=0");
console.assert(numToSnafu(20) === "1-0");
console.assert(numToSnafu(2022) === "1=11-2");
console.assert(numToSnafu(12345) === "1-0---0");
console.assert(numToSnafu(314159265) === "1121-1110-1=0");

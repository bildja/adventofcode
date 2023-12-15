import { day15input } from "./day15input";

const smallRawInput = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;

const hash = (str: string): number => {
  let curValue = 0;
  for (let i = 0; i < str.length; i++) {
    curValue += str.charCodeAt(i);
    curValue *= 17;
    curValue %= 256;
  }
  return curValue;
};

const parse = (rawInput: string) => rawInput.split(",");

const day15p1 = (rawInput: string) =>
  parse(rawInput)
    .map(hash)
    .reduce((a, b) => a + b);

console.log(day15p1("HASH"));
console.log(day15p1(smallRawInput));
console.log(day15p1(day15input));

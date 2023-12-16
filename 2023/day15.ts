import { day15input } from "./day15input";

const smallRawInput = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;

const hash = (str: string): number =>
  Array.from(str).reduce((acc, ch) => ((acc + ch.charCodeAt(0)) * 17) % 256, 0);

const parseP1 = (rawInput: string) => rawInput.split(",");

const day15p1 = (rawInput: string) =>
  parseP1(rawInput)
    .map(hash)
    .reduce((a, b) => a + b);

type RemoveStep = {
  type: "remove";
  label: string;
};
type AssignStep = {
  type: "assign";
  label: string;
  focalLength: number;
};

type Step = RemoveStep | AssignStep;

const parseP2 = (rawInput: string): Step[] =>
  parseP1(rawInput).map((stepStr) => {
    const assignMatch = stepStr.match(/^(\w+)\=(\d+)$/);
    if (assignMatch) {
      const [, label, focalLengthStr] = assignMatch;
      const focalLength = Number(focalLengthStr);
      return {
        type: "assign",
        label,
        focalLength,
      };
    }
    const removeMatch = stepStr.match(/^(\w+)-$/);
    if (!removeMatch) {
      throw Error(`could not parse "${stepStr}"`);
    }
    const [, label] = removeMatch;
    return {
      type: "remove",
      label,
    };
  });

type Box = Map<string, number>;

const focusingPower = (box: Box): number =>
  Array.from(box.values())
    .map((focusLength, i) => (i + 1) * focusLength)
    .reduce((a, b) => a + b, 0);

const fillBoxes = (steps: Step[]): Box[] => {
  const boxes: Box[] = new Array(256).fill(undefined).map(() => new Map());
  for (const step of steps) {
    const stepHash = hash(step.label);
    const box = boxes[stepHash];
    switch (step.type) {
      case "remove": {
        box.delete(step.label);
        break;
      }
      case "assign": {
        box.set(step.label, step.focalLength);
        break;
      }
      default: {
        throw Error("unknown step type");
      }
    }
  }
  return boxes;
};

const day15p2 = (rawInput: string) =>
  fillBoxes(parseP2(rawInput))
    .map((box, i) => (i + 1) * focusingPower(box))
    .reduce((a, b) => a + b);

console.log(day15p1("HASH"));
console.log(day15p1(smallRawInput));
console.log(day15p1(day15input));

console.log("\n========= P2 =========\n");

console.log(day15p2(smallRawInput));
console.log(day15p2(day15input));

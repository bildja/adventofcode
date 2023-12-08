import { day8input } from "./day8input";

const smallRawInput1 = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;

const smallRawInput2 = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;

const smallRawInputP2 = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

type Step = "R" | "L";

type Node = { right: string; left: string };
type Network = Record<string, Node>;

type Data = {
  steps: Step[];
  network: Network;
};

const parse = (rawInput: string): Data => {
  const [stepsStr, networkStr] = rawInput.split("\n\n");
  const steps = stepsStr.split("") as Step[];
  const network = networkStr.split("\n").reduce((acc, line) => {
    const match = line.match(/^(\w+) = \((\w+), (\w+)\)$/);
    if (!match) {
      throw Error(`could not parse "${line}"`);
    }
    const [, node, left, right] = match;
    return {
      ...acc,
      [node]: { right, left },
    };
  }, {} as Network);
  return { steps, network };
};

const day8p1 = (rawInput: string) => {
  const { steps, network } = parse(rawInput);
  let curNode = "AAA";
  const targetNode = "ZZZ";
  let stepPointer = 0;
  let stepsCount = 0;
  while (curNode !== targetNode) {
    const curStep = steps[stepPointer++];
    stepPointer %= steps.length;
    curNode = curStep === "L" ? network[curNode].left : network[curNode].right;
    stepsCount++;
  }
  return stepsCount;
};

const day8p2 = (rawInput: string) => {
  const { steps, network } = parse(rawInput);
  let currentNodes = Object.keys(network).filter((nodeName) =>
    nodeName.endsWith("A")
  );
  console.log(currentNodes);
  let allEndWithZ = false;
  let stepPointer = 0;
  let stepsCount = 0;
  while (!allEndWithZ && stepsCount <= 10 * 10 ** 8) {
    const curStep = steps[stepPointer++];
    stepPointer %= steps.length;
    currentNodes = currentNodes.map((nodeName) =>
      curStep === "L" ? network[nodeName].left : network[nodeName].right
    );

    console.log(currentNodes.filter((nodeName) => nodeName.endsWith("Z")).length);
    allEndWithZ = currentNodes.every((nodeName) => nodeName.endsWith("Z"));
    stepsCount++;
  }
  return stepsCount;
};

// console.log(day8p1(smallRawInput1));
// console.log(day8p1(smallRawInput2));
// console.log(day8p1(day8input));

// console.log("\n======P2======\n");
// console.log(day8p2(smallRawInputP2));
console.log(day8p2(day8input));

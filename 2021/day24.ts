import { day24inputOriginal } from "./day24input";

const VARS = ["x", "y", "z", "w"] as const;
type Var = typeof VARS[number];

type ArithmeticInstructionType = "add" | "mul" | "div" | "mod" | "eql";

interface BaseInstruction<T extends "inp" | ArithmeticInstructionType> {
  type: T;
  rawString: string;
}

interface InpInstruction extends BaseInstruction<"inp"> {
  var: Var;
}

interface VarOperand {
  type: "var";
  value: Var;
}

interface ValueOperand {
  type: "value";
  value: number;
}

type Operand = VarOperand | ValueOperand;

interface BaseArithmeticInstruction<T extends ArithmeticInstructionType>
  extends BaseInstruction<T> {
  left: VarOperand;
  right: Operand;
}

interface AddInstruction extends BaseArithmeticInstruction<"add"> {}
interface MulInstruction extends BaseArithmeticInstruction<"mul"> {}
interface DivInstruction extends BaseArithmeticInstruction<"div"> {}
interface ModInstruction extends BaseArithmeticInstruction<"mod"> {}
interface EqlInstruction extends BaseArithmeticInstruction<"eql"> {}

type ArithmeticInstruction =
  | AddInstruction
  | MulInstruction
  | DivInstruction
  | ModInstruction
  | EqlInstruction;

type ProgramInstruction = InpInstruction | ArithmeticInstruction;
type Program = ProgramInstruction[];

type InstructionStringParsed =
  | ["inp", Var]
  | [ArithmeticInstruction["type"], Var, Var | number];
type ArithmeticFn = (a: number, b: number) => number;
type XYZW = [x: number, y: number, z: number, w: number];

const isOperandVar = (operandRaw: string | number): operandRaw is Var =>
  VARS.includes(operandRaw as Var);

const parseInstruction = (row: string, i: number): ProgramInstruction => {
  const [command, left, right] = row.split(" ") as InstructionStringParsed;
  const rawString = `${i}. ${row}`;
  switch (command) {
    case "inp": {
      return {
        type: "inp",
        var: left,
        rawString,
      };
    }
    case "add":
    case "mul":
    case "div":
    case "mod":
    case "eql": {
      const leftOperand: Operand = {
        type: "var",
        value: left as Var,
      };

      const rightOperand: Operand = isOperandVar(right)
        ? {
            type: "var",
            value: right,
          }
        : {
            type: "value",
            value: Number(right),
          };

      return {
        type: command,
        left: leftOperand,
        right: rightOperand,
        rawString,
      };
    }
    default:
      throw Error(`can not parse instruction "${rawString}"`);
  }
};

const parseProgram = (programRaw: string): Program =>
  programRaw.split("\n").map(parseInstruction);

const getInputs = (inputNumber: number): number[] => {
  const inputs: number[] = [];
  while (inputNumber) {
    inputs.unshift(inputNumber % 10);
    inputNumber = Math.floor(inputNumber / 10);
  }
  return inputs;
};

const arithmeticValidation =
  (validationFn: (a: number, b: number) => boolean, invalidMessage: string) =>
  (fn: ArithmeticFn): ArithmeticFn =>
  (a, b) => {
    if (!validationFn(a, b)) {
      throw Error(invalidMessage);
    }
    return fn(a, b);
  };

const divValidation = arithmeticValidation(
  (a, b) => b !== 0,
  "can not divide by zero"
);

const modValidation = arithmeticValidation(
  (a, b) => a >= 0 && b > 0,
  "can not mod negatives"
);

const arithmeticOperations: Record<
  ArithmeticInstruction["type"],
  ArithmeticFn
> = {
  add: (a, b) => a + b,
  mul: (a, b) => a * b,
  div: divValidation((a, b) => Math.floor(a / b)),
  mod: modValidation((a, b) => a % b),
  eql: (a, b) => (a === b ? 1 : 0),
};

type ProgramOutput = {
  x: number;
  y: number;
  z: number;
  w: number;
  instruction: string;
}[];

const runProgram = (
  program: Program,
  input: number,
  startXyzw?: XYZW
): ProgramOutput | null => {
  //   const xyzws: XYZW[] = startXyzw === undefined ? [] : [startXyzw];
  let xyzw: XYZW = startXyzw === undefined ? [0, 0, 0, 0] : [...startXyzw];
  const indexes = { x: 0, y: 1, z: 2, w: 3 };
  const inputs = getInputs(input);
  const programOutput: ProgramOutput = [];
  if (inputs.includes(0)) {
    return null;
  }

  const addXyzw = (variable: Var, value: number, instruction: string) => {
    xyzw[indexes[variable]] = value;
    const [x, y, z, w] = xyzw;
    programOutput.push({
      instruction,
      x,
      y,
      z,
      w,
    });
    xyzw = [...xyzw];
  };

  const runInstruction = (instruction: ProgramInstruction) => {
    switch (instruction.type) {
      case "inp": {
        const currentInput = inputs.shift();
        // console.log("inp", instruction.var, currentInput);
        if (currentInput === undefined) {
          throw Error(
            `the inputs are finished, but the instructions are not at "${instruction.rawString}"`
          );
        }
        addXyzw(instruction.var, currentInput, instruction.rawString);
        break;
      }
      case "add":
      case "mul":
      case "div":
      case "mod":
      case "eql": {
        const targetPos = indexes[instruction.left.value];
        const left = xyzw[targetPos];
        const right =
          instruction.right.type === "var"
            ? xyzw[indexes[instruction.right.value]]
            : instruction.right.value;
        addXyzw(
          instruction.left.value,
          arithmeticOperations[instruction.type](left, right),
          instruction.rawString
        );
        // xyzw[targetPos] = arithmeticOperations[instruction.type](left, right);
      }
    }
  };
  for (const instruction of program) {
    runInstruction(instruction);
  }
  return programOutput;
};

export const day24 = (programRaw: string, xyzw?: XYZW) => {
  const program = parseProgram(programRaw);

  let maxOk = 0;

  const xyzwRes = runProgram(program, 13579246899999, xyzw);
  //   const xyzw = runProgram(program, 11111111111111);
  console.log(xyzwRes?.at(-1));

  const programOutputs: ProgramOutput[] = [];
  const MAX = 99999999999999;
  const MIN = 11111111111111;

  for (let i = 0; i < 10; i++) {
    const input = Math.floor(Math.random() * (MAX - MIN) + MIN);
    console.log("input", input);
    const programOutput = runProgram(program, input, xyzw);
    if (programOutput) programOutputs.push(programOutput);
  }

  return maxOk;
};

export const programSimpler = (
  z: number,
  w: number,
  addX: number,
  addY: number
) => {
  let x = (z % 26) + addX;
  if (addX < 0) {
    z = Math.floor(z / 26);
  }
  x = x === w ? 0 : 1;
  let y = 25 * x + 1;
  z *= y;
  z += (w + addY) * x;
  return z;
};

export const day24simpler = (input: string) => {
  const inputNumbers = input.split("").map(Number);
  const addXs = [12, 12, 13, 12, -3, 10, 14, -16, 12, -8, -12, -7, -6, -11];
  const addYs = [7, 8, 2, 11, 6, 12, 14, 13, 15, 10, 6, 10, 8, 5];
  let z = 0;
  for (let i = 0; i < 14; i++) {
    z = programSimpler(z, inputNumbers[i], addXs[i], addYs[i]);
  }
  return z;
};

const day24find = (wDiff: 1 | -1) => {
  const addXs = [12, 12, 13, 12, -3, 10, 14, -16, 12, -8, -12, -7, -6, -11];
  const addYs = [7, 8, 2, 11, 6, 12, 14, 13, 15, 10, 6, 10, 8, 5];
  const len = addXs.length;
  let totalIterations = 0;
  const runIteration = (curZ: number, curInput: number[]): number[] | null => {
    totalIterations++;
    const i = curInput.length;
    if (addXs[i] < 0) {
      const w = (curZ % 26) + addXs[i];
      if (w < 1 || w > 9) {
        return null;
      }
      if (i === len - 1) {
        return [...curInput, w];
      }
      return runIteration(Math.floor(curZ / 26), [...curInput, w]);
    }
    const wStart = wDiff === 1 ? 1 : 9;
    const wEnd = wDiff === 1 ? 9 : 1;
    let w = wStart - wDiff;

    let resInput: number[] | null = null;
    while (resInput === null && wDiff * w < wDiff * wEnd) {
      w += wDiff;
      const nextZ = curZ * 26 + w + addYs[i];
      resInput = runIteration(nextZ, [...curInput, w]);
    }
    return resInput;
  };
  const res = runIteration(0, []);
  console.log("totalIterations recursive", totalIterations);
  return Number(res?.join(""));
};

const day24findIterative = (wDiff: 1 | -1) => {
  const addXs = [12, 12, 13, 12, -3, 10, 14, -16, 12, -8, -12, -7, -6, -11];
  const addYs = [7, 8, 2, 11, 6, 12, 14, 13, 15, 10, 6, 10, 8, 5];
  const len = addXs.length;
  const wStart = wDiff === 1 ? 1 : 9;
  const wEnd = wDiff === 1 ? 9 : 1;
  const first = { z: wStart + addYs[0], w: wStart };

  const stack: { z: number; w: number }[] = [first];

  while (stack.length) {
    let i = stack.length;
    const curZ = stack.at(-1)!.z;
    if (addXs[i] > 0) {
      const w = wStart;
      const nextZ = curZ * 26 + w + addYs[i];
      stack.push({ z: nextZ, w });
      continue;
    }
    const nextNegativeW = (curZ % 26) + addXs[i];
    if (nextNegativeW < 1 || nextNegativeW > 9) {
      let prev = stack.at(-1)!;
      do {
        i--;
        prev = stack.pop()!;
      } while (
        (addXs[i] < 0 || wDiff * prev.w >= wDiff * wEnd) &&
        stack.length
      );
      const nextW = prev.w + wDiff;
      const nextZ = (stack.at(-1)?.z ?? 0) * 26 + nextW + addYs[i];
      stack.push({ w: nextW, z: nextZ });
      continue;
    }
    if (i === len - 1) {
      return Number([...stack.map(({ w }) => w), nextNegativeW].join(""));
    }
    stack.push({
      z: Math.floor(curZ / 26),
      w: nextNegativeW,
    });
  }
  throw Error("something went terribly wrong");
};

const day24findIterativeAll = () => {
  const addXs = [12, 12, 13, 12, -3, 10, 14, -16, 12, -8, -12, -7, -6, -11];
  const addYs = [7, 8, 2, 11, 6, 12, 14, 13, 15, 10, 6, 10, 8, 5];
  const len = addXs.length;
  const wDiff = 1;
  const wStart = wDiff === 1 ? 1 : 9;
  const wEnd = wDiff === 1 ? 9 : 1;
  const first = { z: wStart + addYs[0], w: wStart };

  const stack: { z: number; w: number }[] = [first];
  const all: number[] = [];
  const max = day24findIterative(-1);

  while (!all.length || all.at(-1)! < max) {
    let i = stack.length;
    const curZ = stack.at(-1)!.z;
    if (addXs[i] > 0) {
      const w = wStart;
      const nextZ = curZ * 26 + w + addYs[i];
      stack.push({ z: nextZ, w });
      continue;
    }
    const nextNegativeW = (curZ % 26) + addXs[i];
    const isValidNextNegativeW = nextNegativeW >= 1 && nextNegativeW <= 9;

    const popBack = () => {
      let prev = stack.at(-1)!;
      do {
        i--;
        prev = stack.pop()!;
      } while (
        (addXs[i] < 0 || wDiff * prev.w >= wDiff * wEnd) &&
        stack.length
      );
      const nextW = prev.w + wDiff;
      const nextZ = (stack.at(-1)?.z ?? 0) * 26 + nextW + addYs[i];
      stack.push({ w: nextW, z: nextZ });
    };

    if (!isValidNextNegativeW) {
      popBack();
      continue;
    }

    if (i === len - 1) {
      all.push(Number([...stack.map(({ w }) => w), nextNegativeW].join("")));
      popBack();
      continue;
    }

    stack.push({
      z: Math.floor(curZ / 26),
      w: nextNegativeW,
    });
  }
  return all;
};

export const day24findMax = () => day24findIterative(-1);
export const day24findMin = () => day24findIterative(1);

let iterativeStart = performance.now();
const iterativeAll = day24findIterativeAll();
let iterativeEnd = performance.now();
console.log("time passed", iterativeEnd - iterativeStart);
console.log("all count", iterativeAll.length);
console.log(
  "all",
  iterativeAll.reduce(
    (acc, val, i) =>
      i === 0
        ? {}
        : {
            ...acc,
            [val - iterativeAll[i - 1]]:
              (acc[val - iterativeAll[i - 1]] ?? 0) + 1,
          },
    {} as Record<number, number>
  )
  // .join("\n")
);
// let recursiveStart = performance.now();
// const recursiveMin = day24find(1);
// let recursiveEnd = performance.now();
// console.log("min", iterativeMin, recursiveMin);
// console.log(
//   "min durations",
//   iterativeEnd - iterativeStart,
//   recursiveEnd - recursiveStart
// );

// iterativeStart = performance.now();
// const iterativeMax = day24findIterative(-1);
// iterativeEnd = performance.now();
// recursiveStart = performance.now();
// const recursiveMax = day24find(-1);
// recursiveEnd = performance.now();

// console.log("max", iterativeMax, recursiveMax);
// console.log(
//   "max durations",
//   iterativeEnd - iterativeStart,
//   recursiveEnd - recursiveStart
// );

// console.log(day24findMin(), day24findMax());
// console.log(day24(day24inputFixed1, [1, 0, 0, 0]));

// 2605493788

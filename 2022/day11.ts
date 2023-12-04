import { day11input } from "./day11input";

const smallRawInput = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`;

type Operator = "+" | "-" | "*" | "/";
type Operation = (item: number) => number;
interface Test {
  divisibleBy: number;
  true: number;
  false: number;
}

interface Monkey {
  items: number[];
  operation: Operation;
  test: Test;
}

const parseStartingItems = (startingItemsRow: string): number[] => {
  return startingItemsRow
    .replace("Starting items: ", "")
    .split(", ")
    .map(Number);
};

const parseOperation = (operationRow: string): Operation => {
  operationRow = operationRow.replace("Operation: new = ", "");

  return (old) => {
    const match = operationRow.match(/^old ([+*/-]) (old|\d+)$/);
    if (!match) {
      throw Error(`could not parse ${operationRow}`);
    }
    const [, operator, rightOperandRaw] = match;
    const operators: Record<Operator, (a: number, b: number) => number> = {
      "+": (a, b) => a + b,
      "-": (a, b) => a - b,
      "*": (a, b) => {
        return a * b;
      },
      "/": (a, b) => a / b,
    };
    const operatorFn = operators[operator as Operator];
    const rightOperand =
      rightOperandRaw === "old" ? old : Number(rightOperandRaw);
    return operatorFn(old, rightOperand);
  };
};
const parseTest = (
  testStr: string,
  trueStr: string,
  falseStr: string
): Test => {
  const divisibleBy = Number(testStr.replace("Test: divisible by ", ""));
  const throwToTrue = Number(
    trueStr.replace("  If true: throw to monkey ", "")
  );
  const throwToFalse = Number(
    falseStr.replace("  If false: throw to monkey ", "")
  );
  return {
    divisibleBy,
    true: throwToTrue,
    false: throwToFalse,
  };
};

const parseMonkey = (monkeyStr: string): Monkey => {
  const monkeyRows = monkeyStr.split("\n");
  monkeyRows.shift();
  const startingItems = parseStartingItems(monkeyRows.shift() as string);
  const operation = parseOperation(monkeyRows.shift() as string);
  const [testStr, trueStr, falseStr] = monkeyRows;
  const test = parseTest(testStr, trueStr, falseStr);
  return {
    items: startingItems,
    operation,
    test,
  };
};

const parseRawInput = (rawInput: string): Monkey[] => {
  const monkeyStrings = rawInput.split("\n\n");
  return monkeyStrings.map(parseMonkey);
};

const getAllDivisiblesProduct = (monkeys: Monkey[]): number => {
  return monkeys
    .map((monkey) => monkey.test.divisibleBy)
    .reduce((acc, div) => acc * div, 1);
};

const day11 = (rawInput: string) => {
  const monkeys = parseRawInput(rawInput);
  const allDivisibles = getAllDivisiblesProduct(monkeys);
  const monkeyInspections = new Array<number>(monkeys.length).fill(0);

  const processMonkeyInspection = (monkey: Monkey, i: number) => {
    let currentItem = monkey.items.shift();
    while (currentItem !== undefined) {
      monkeyInspections[i]++;
      let worryLevel = monkey.operation(currentItem);

      const throwTo =
        monkey.test[
          worryLevel % monkey.test.divisibleBy === 0 ? "true" : "false"
        ];
      const throwToMonkey = monkeys[throwTo];
      throwToMonkey.items.push(worryLevel % allDivisibles);

      currentItem = monkey.items.shift();
    }
  };

  for (let k = 0; k < 10000; k++) {
    for (let i = 0; i < monkeys.length; i++) {
      processMonkeyInspection(monkeys[i], i);
    }
  }
  const sorted = monkeyInspections.sort((a, b) => b - a);
  const [first, second] = sorted;
  return first * second;
};

console.log("small", day11(smallRawInput));
console.log(day11(day11input));

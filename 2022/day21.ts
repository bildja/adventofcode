import { day21input } from "./day21input";

const smallRawInput = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`;

interface CalcValue {
  type: "value";
  value: number;
}

type Operation = "+" | "-" | "*" | "/";

interface CalcExpression {
  type: "expression";
  operands: [keyof MonkeysCalc, keyof MonkeysCalc];
  operation: Operation;
}

type MonkeysCalc = Record<string, CalcValue | CalcExpression>;

const parseRawInput = (rawInput: string): MonkeysCalc => {
  const monkeyNameRe = /^(\w+):/;
  const numberRe = /^\w+: (\d+)$/;
  const expressionRe = /^\w+: (\w+) ([\-\+\*\/]) (\w+)$/;
  const rows = rawInput.split("\n");
  const monkeysCalc: MonkeysCalc = rows.reduce((acc, row) => {
    const monkeyNameMatch = row.match(monkeyNameRe);
    if (!monkeyNameMatch) {
      throw Error(`could not parse row ${row}`);
    }
    const [, monkeyName] = monkeyNameMatch;
    const numberMatch = row.match(numberRe);
    if (numberMatch) {
      const [, valueStr] = numberMatch;
      return {
        ...acc,
        [monkeyName]: {
          type: "value",
          value: Number(valueStr),
        },
      };
    }
    const expressionMatch = row.match(expressionRe);
    if (!expressionMatch) {
      throw Error(`could not parse row ${row}`);
    }
    const [, left, operation, right] = expressionMatch;
    return {
      ...acc,
      [monkeyName]: {
        type: "expression",
        operation,
        operands: [left, right],
      },
    } as MonkeysCalc;
  }, {});
  return monkeysCalc;
};

const day21 = (rawInput: string) => {
  const monkeysCalc = parseRawInput(rawInput);

  const operations: Record<Operation, (a: number, b: number) => number> = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
  };
  const backwardOperationsForLeft: Record<
    Operation,
    (valToEq: number, right: number) => number
  > = {
    "+": (valToEq, right) => valToEq - right, // valToEq = human + right; human = valToEq - right
    "*": (valToEq, right) => valToEq / right, // valToEq = human * right; human = valToEq / right
    "-": (valToEq, right) => valToEq + right, // valToEq = human - right; human = valToEq + right
    "/": (valToEq, right) => valToEq * right, // valToEq = human / right; human = valToEq * right
  };
  const backwardOperationsForRight: Record<
    Operation,
    (left: number, valToEq: number) => number
  > = {
    "+": (left, valToEq) => valToEq - left, // valToEq = left + human; human = valToEq - left
    "*": (left, valToEq) => valToEq / left, // valToEq = left * human; human = valToEq / left
    "-": (left, valToEq) => left - valToEq, // valToEq = left - human; human = left - valToEq
    "/": (left, valToEq) => left / valToEq, // valToEq = left / human; human = left / valToEq
  };

  const calculateValue = (monkeyName: keyof MonkeysCalc): number => {
    const calcValue = monkeysCalc[monkeyName];
    if (calcValue.type === "value") {
      return calcValue.value;
    }
    const [left, right] = calcValue.operands;
    const newCalcValue: CalcValue = {
      type: "value",
      value: operations[calcValue.operation](
        calculateValue(left),
        calculateValue(right)
      ),
    };
    monkeysCalc[monkeyName] = newCalcValue;
    return newCalcValue.value;
  };

  const dependsOnHumn = (monkeyName: keyof MonkeysCalc): boolean => {
    const calcValue = monkeysCalc[monkeyName];
    if (monkeyName === "humn") {
      return true;
    }
    if (calcValue.type === "value") {
      return false;
    }
    const [left, right] = calcValue.operands;
    return dependsOnHumn(left) || dependsOnHumn(right);
  };
  const calculateHumnValue = (
    monkeyName: keyof MonkeysCalc,
    valueToEqual: number
  ): number => {
    const calcValue = monkeysCalc[monkeyName];
    if (calcValue.type === "value") {
      throw Error("this already has a value");
    }
    const [left, right] = calcValue.operands;
    if (left === "humn" || right === "humn") {
      if (left === "humn") {
        return backwardOperationsForLeft[calcValue.operation](
          valueToEqual,
          calculateValue(right)
        );
      }
      return backwardOperationsForRight[calcValue.operation](
        calculateValue(left),
        valueToEqual
      );
    }
    if (dependsOnHumn(left)) {
      return calculateHumnValue(
        left,
        backwardOperationsForLeft[calcValue.operation](
          valueToEqual,
          calculateValue(right)
        )
      );
    }

    return calculateHumnValue(
      right,
      backwardOperationsForRight[calcValue.operation](
        calculateValue(left),
        valueToEqual
      )
    );
  };

  const { root } = monkeysCalc;
  if (root.type === "value") {
    throw Error("how come root has value??");
  }
  const [left, right] = root.operands;
  return dependsOnHumn(left)
    ? calculateHumnValue(left, calculateValue(right))
    : calculateHumnValue(right, calculateValue(left));
};

console.log("small", day21(smallRawInput));
console.log("big", day21(day21input));

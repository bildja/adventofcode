import { day6input } from "./day6input";

const smallRawInput = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +`;

type Operation = "+" | "*";

const parse = (
  rawInput: string,
): { values: number[][]; operations: Operation[] } => {
  const rows = rawInput.split("\n");
  const operations = rows.pop()!.split(/\s+/) as Operation[];
  const values = rows.map((row) => row.trim().split(/\s+/).map(Number));
  return { operations, values };
};

const mapToColumns = (values: number[][]) => {
  return new Array(values[0].length)
    .fill([])
    .map((_, i) =>
      new Array(values.length).fill(0).map((_, j) => values[j][i]),
    );
};

const performOperation = (val1: number, val2: number, operation: Operation) => {
  switch (operation) {
    case "+": {
      return val1 + val2;
    }
    case "*": {
      return val1 * val2;
    }
    default:
      return val1;
  }
};

const performColumnOperations = (
  columns: number[][],
  operations: Operation[],
) =>
  columns
    .map((column, i) => {
      const operation = operations[i];

      return column.reduce(
        (acc, val) => performOperation(acc, val, operation),
        startVals[operation],
      );
    })
    .reduce((a, b) => a + b);

const startVals: Record<Operation, number> = {
  "+": 0,
  "*": 1,
};

const day6p1 = (rawInput: string) => {
  const { operations, values } = parse(rawInput);
  const columns = mapToColumns(values);

  return performColumnOperations(columns, operations);
};

console.log(day6p1(smallRawInput));
console.log(day6p1(day6input));

const parseV2 = (
  rawInput: string,
): { columnsStrings: string[][]; operations: Operation[] } => {
  const rows = rawInput.split("\n");
  const operations = rows.pop()!.split(/\s+/) as Operation[];
  const allValuesRows = rows.map((row) => row.trim().split(/\s+/));
  const digitNumbers: number[] = [];
  for (let j = 0; j < allValuesRows[0].length; j++) {
    let max = 0;
    for (let i = 0; i < allValuesRows.length; i++) {
      max = Math.max(allValuesRows[i][j].length, max);
    }
    digitNumbers.push(max);
  }
  const columnsStrings: string[][] = [];
  let lastIndex = 0;
  for (let j = 0; j < digitNumbers.length; j++) {
    if (j > 0) {
      lastIndex += digitNumbers[j - 1] + 1;
    }
    const columnString: string[] = [];
    for (let i = 0; i < allValuesRows.length; i++) {
      columnString.push(rows[i].slice(lastIndex, lastIndex + digitNumbers[j]));
    }
    columnsStrings.push(columnString);
  }
  return { operations, columnsStrings };
};

const toColumnsP2 = (columnsStrings: string[][]) => {
  const columns: number[][] = [];
  for (let i = 0; i < columnsStrings.length; i++) {
    const column: number[] = [];
    for (let j = columnsStrings[i][0].length - 1; j >= 0; j--) {
      const columnString: string[] = [];
      for (let k = 0; k < columnsStrings[i].length; k++) {
        columnString.push(columnsStrings[i][k][j]);
      }
      column.push(Number(columnString.join("").trim()));
    }
    columns.push(column);
  }
  return columns;
};

const day6p2 = (rawInput: string) => {
  const { operations, columnsStrings } = parseV2(rawInput);
  const columns = toColumnsP2(columnsStrings);

  return performColumnOperations(columns, operations);
};

console.log("day6p2(smallRawInput)", day6p2(smallRawInput));
console.log("day6p2(input)", day6p2(day6input));

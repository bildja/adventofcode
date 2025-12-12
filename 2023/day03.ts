import { day3input } from "./day03input";

const smallRawInput = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`.trim();

const isCharANum = (ch: string): boolean => "0" <= ch && ch <= "9";

const initCheckers = (rows: string[]) => {
  const checkAdjLeft = (row: string, j: number) => {
    return j > 0 && row[j - 1] !== ".";
  };
  const checkAdjRight = (row: string, j: number) => {
    return j < row.length - 1 && row[j + 1] !== ".";
  };

  const checkOnRow = (row: string, j: number) => {
    if (checkAdjLeft(row, j)) {
      return true;
    }
    if (checkAdjRight(row, j)) {
      return true;
    }
    return row[j] !== ".";
  };
  const checkAdjTop = (i: number, j: number) => {
    return i > 0 && checkOnRow(rows[i - 1], j);
  };
  const checkAdjBottom = (i: number, j: number) => {
    return i < rows.length - 1 && checkOnRow(rows[i + 1], j);
  };

  return { checkAdjBottom, checkAdjLeft, checkAdjRight, checkAdjTop };
};

const day3p1 = (rawInput: string) => {
  let adjucentNumbersSum = 0; //: number[] = [];
  const rows = rawInput.split("\n");
  const { checkAdjBottom, checkAdjLeft, checkAdjRight, checkAdjTop } =
    initCheckers(rows);

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let curNumber: number | null = null;
    let j = 0;
    while (j < row.length) {
      if (row[j] === ".") {
        j++;
        continue;
      }
      if (!isCharANum(row[j])) {
        j++;
        continue;
      }
      let isCurNumberAdjacent =
        checkAdjLeft(row, j) || checkAdjTop(i, j) || checkAdjBottom(i, j);
      curNumber = 0;
      while (j < row.length && isCharANum(row[j])) {
        const digit = Number(row[j]);
        curNumber = curNumber * 10 + digit;
        if (checkAdjTop(i, j) || checkAdjBottom(i, j)) {
          isCurNumberAdjacent = true;
        }
        j++;
      }
      if (checkAdjRight(row, j - 1)) {
        isCurNumberAdjacent = true;
      }
      if (isCurNumberAdjacent) {
        adjucentNumbersSum += curNumber;
      }
    }
  }

  return adjucentNumbersSum;
};

const day3p2 = (rawInput: string) => {
  const rows = rawInput.split("\n");
  const allStars: [number, number][] = [];
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      if (rows[i][j] === "*") {
        allStars.push([i, j]);
      }
    }
  }
  const getLeftNumber = (i: number, j: number) => {
    if (j <= 0) {
      return null;
    }
    if (!isCharANum(rows[i][j - 1])) {
      return null;
    }
    let start = j - 1;
    while (isCharANum(rows[i][start]) && start >= 0) {
      start--;
    }
    return Number(rows[i].slice(start + 1, j));
  };
  const getRightNumber = (i: number, j: number) => {
    if (j > rows[i].length - 1) {
      return null;
    }
    if (!isCharANum(rows[i][j + 1])) {
      return null;
    }
    let end = j + 1;
    while (isCharANum(rows[i][end]) && end < rows[i].length) {
      end++;
    }
    return Number(rows[i].slice(j + 1, end));
  };
  const getTopNumbers = (i: number, j: number): number[] => {
    if (i <= 0) {
      return [];
    }
    const row = rows[i - 1];
    let leftCorner = j > 0 ? j - 1 : j;
    const rightCorner = j < row.length - 1 ? j + 1 : j;
    const rowRange = [...new Array(rightCorner - leftCorner + 1).keys()].map(
      (i) => i + leftCorner
    );
    if (rowRange.every((col) => !isCharANum(row[col]))) {
      return [];
    }
    if (!isCharANum(row[leftCorner]) && !isCharANum(row[rightCorner])) {
      return [Number(row[j])];
    }
    if (
      !isCharANum(row[j]) &&
      isCharANum(row[leftCorner]) &&
      isCharANum(row[rightCorner])
    ) {
      return [getLeftNumber(i - 1, j), getRightNumber(i - 1, j)].filter(
        Boolean
      ) as number[];
    }
    let start = rowRange.find((col) => isCharANum(row[col]));
    if (!start) {
      throw Error("could not find start");
    }
    let end = start;

    while (start >= 0 && isCharANum(row[start])) {
      start--;
    }
    while (end < row.length && isCharANum(row[end])) {
      end++;
    }
    return [Number(row.slice(start + 1, end))];
  };

  const getBottomNumbers = (i: number, j: number): number[] => {
    if (i > rows.length - 1) {
      return [];
    }
    const row = rows[i + 1];
    let leftCorner = j > 0 ? j - 1 : j;
    const rightCorner = j < row.length - 1 ? j + 1 : j;
    const rowRange = [...new Array(rightCorner - leftCorner + 1).keys()].map(
      (i) => i + leftCorner
    );
    if (rowRange.every((col) => !isCharANum(row[col]))) {
      return [];
    }
    if (!isCharANum(row[leftCorner]) && !isCharANum(row[rightCorner])) {
      return [Number(row[j])];
    }
    if (
      !isCharANum(row[j]) &&
      isCharANum(row[leftCorner]) &&
      isCharANum(row[rightCorner])
    ) {
      return [getLeftNumber(i + 1, j), getRightNumber(i + 1, j)].filter(
        Boolean
      ) as number[];
    }
    let start = rowRange.find((col) => isCharANum(row[col]));
    if (!start) {
      throw Error("could not find start");
    }
    let end = start;

    while (start >= 0 && isCharANum(row[start])) {
      start--;
    }
    while (end < row.length && isCharANum(row[end])) {
      end++;
    }
    return [Number(row.slice(start + 1, end))];
  };

  let gearsSum = 0;

  for (const [i, j] of allStars) {
    const adjNumbers = [
      getLeftNumber(i, j),
      getRightNumber(i, j),
      ...getTopNumbers(i, j),
      ...getBottomNumbers(i, j),
    ].filter(Boolean) as number[];
    if (adjNumbers.length === 2) {
      const [num1, num2] = adjNumbers;
      gearsSum += num1 * num2;
    }
  }
  return gearsSum;
};

console.log(day3p2(smallRawInput));
console.log(day3p2(day3input));

// 508883 too low
// 555269 too high

// p2
// 80065459 too low

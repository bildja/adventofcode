import { day13input } from "./day13input";
const smallInput = [
  [1, 1, 3, 1, 1],
  [1, 1, 5, 1, 1],

  [[1], [2, 3, 4]],
  [[1], 4],

  [9],
  [[8, 7, 6]],

  [[4, 4], 4, 4],
  [[4, 4], 4, 4, 4],

  [7, 7, 7, 7],
  [7, 7, 7],

  [],
  [3],

  [[[]]],
  [[]],

  [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
  [1, [2, [3, [4, [5, 6, 0]]]], 8, 9],
];

type Package = (number | Package)[];

const flatten = (pkg: Package): number[] =>
  pkg.flatMap((el) => (Array.isArray(el) ? flatten(el) : el));

const packageToNumber = (pkg: number[], order: number) =>
  pkg.reduce((num, el, i) => num + el * 10 ** (order - i), 0);

type RightOrder = -1 | 0 | 1;

const getRightOrder = (package1: Package, package2: Package): RightOrder => {
  let i = 0;
  const n1 = package1.length;
  const n2 = package2.length;
  //   const order = Math.max(n1, n2);
  //   const num1 = packageToNumber(package1, order);
  //   const num2 = packageToNumber(package2, order);
  //   return num1 < num2;
  while (i < n1 && i < n2) {
    let first = package1[i];
    let second = package2[i];
    if (first === second) {
      i++;
      continue;
    }
    if (!Array.isArray(first) && !Array.isArray(second)) {
      return first < second ? -1 : first === second ? 0 : 1;
    }
    if (!Array.isArray(first)) {
      first = [first];
    }
    if (!Array.isArray(second)) {
      second = [second];
    }

    const arraysOrder = getRightOrder(first, second);
    if (arraysOrder !== 0) {
      return arraysOrder;
    }
    i++;
  }
  return n1 < n2 ? -1 : n1 === n2 ? 0 : 1;
};

const isInRightOrder = (package1: Package, package2: Package) =>
  getRightOrder(package1, package2) === -1;

const isInRightOrder2 = (package1: Package, package2: Package) => {
  const pkg1 = flatten(package1)
    .map((num) => String.fromCharCode(num))
    .join("");
  const pkg2 = flatten(package2)
    .map((num) => String.fromCharCode(num))
    .join("");
  return pkg1 < pkg2;

  //   const order = Math.max(pkg1.length, pkg2.length);
  //   console.log(order);
  //   console.log(1, pkg1, packageToNumber(pkg1, order));
  //   console.log(2, pkg2, packageToNumber(pkg2, order));

  //   return packageToNumber(pkg1, order) < packageToNumber(pkg2, order);
};

// const packageToNumber = (package1: Package, package2: Package): number => {

// }

const day13 = (input: Package[]): number => {
  let sum = 0;
  for (let i = 0; i < input.length - 1; i += 2) {
    if (
      isInRightOrder(input[i], input[i + 1]) !==
      isInRightOrder2(input[i], input[i + 1])
    ) {
      console.log(
        "not equal",
        i,
        JSON.stringify(input[i]),
        JSON.stringify(input[i + 1])
      );
      console.log("correct", isInRightOrder(input[i], input[i + 1]));
    }
    if (isInRightOrder(input[i], input[i + 1])) {
      sum += i / 2 + 1;
    }
  }
  return sum;
};

const insert = (input: Package[], pkg: Package): number => {
  const n = input.length;
  let i = 0;
  let j = n - 1;
  while (i < j) {
    const midI = Math.floor(i + (j - i) / 2);
    if (isInRightOrder(pkg, input[midI])) {
      j = midI;
    } else {
      i = midI + 1;
    }
  }
  input.splice(i, 0, pkg);
  return i;
};

const day13p2 = (input: Package[]) => {
  input.sort((a, b) => getRightOrder(a, b));
  const ind1 = insert(input, [[2]]);
  const ind2 = insert(input, [[6]]);
  console.log(ind1, ind2);
  //   console.log(JSON.stringify(input, null, 2));
  return (ind1 + 1) * (ind2 + 1);
};

console.log(day13(smallInput));
console.log(day13(day13input));

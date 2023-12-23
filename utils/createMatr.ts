export const createMatr = <T>(n: number, m: number, initValue: T): T[][] =>
  createMatrObj(n, m, () => initValue);

export const createMatrObj = <T>(n: number, m: number, init: () => T): T[][] =>
  new Array(n)
    .fill(undefined)
    .map(() => new Array(m).fill(undefined).map(init));

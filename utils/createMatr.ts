export const createMatr = <T>(n: number, m: number, initValue: T): T[][] =>
  new Array(n).fill(undefined).map(() => new Array(m).fill(initValue));

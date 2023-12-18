export const fitsTheMatr = <T>([i, j]: [number, number], map: T[][]) =>
  i >= 0 && j >= 0 && i < map.length && j < map[i].length;

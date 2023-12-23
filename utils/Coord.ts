export type Coord = [number, number];

export const cEq = ([i1, j1]: Coord, [i2, j2]: Coord) => i1 === i2 && j1 === j2;

export type CoordKey = `${number},${number}`;
export const coordKey = ([i, j]: Coord): CoordKey => `${i},${j}`;
export const fromCoordKey = (coordKey: CoordKey): Coord =>
  coordKey.split(",").map(Number) as Coord;

export const manhattanDistance = ([i1, j1]: Coord, [i2, j2]: Coord) =>
  Math.abs(i1 - i2) + Math.abs(j1 - j2);

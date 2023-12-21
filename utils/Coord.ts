export type Coord = [number, number];

export const cEq = ([i1, j1]: Coord, [i2, j2]: Coord) => i1 === i2 && j1 === j2;

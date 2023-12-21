import { Coord } from "./Coord";

export const getAllNeigbhours = ([i, j]: Coord): Coord[] => [
  [i, j + 1],
  [i, j - 1],
  [i + 1, j],
  [i - 1, j],
];

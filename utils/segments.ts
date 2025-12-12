import { Coord } from "./Coord";

export type Segment = [Coord, Coord];

const getKB = ([[xa, ya], [xb, yb]]: [Coord, Coord]): [number, number] => {
  if (xa === 0) {
    if (xb === 0) {
      throw Error("well shrug");
    }
    return getKB([
      [xb, yb],
      [xa, ya],
    ]);
  }
  const b = (yb * xa - ya * xb) / (xa - xb);
  const k = (ya - b) / xa;
  return [k, b];
};

export const intersectInPlane = (
  [[x1, y1], [x2, y2]]: Segment,
  [[x3, y3], [x4, y4]]: Segment,
): Coord | null => {
  // y1 = k1*x1 + b1
  // y2 = k1*x2 + b1
  // y3 = k2*x3 + b2
  // y4 = k2*x4 + b2
  // k1*x + b1 = k2*x + b2
  // (y - b1) / k1 == (y - b2) / k2
  // find [x, y]

  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return null;
  }
  // k1 = (y1 - b1) / x1
  // b1 = (y2 - k1*x2)
  // solving the equations system:

  const [k1, b1] = getKB([
    [x1, y1],
    [x2, y2],
  ]);

  const [k2, b2] = getKB([
    [x3, y3],
    [x4, y4],
  ]);

  // now we need to solve equations for same x and y:
  // k1*x + b1 == k2 * x + b2
  // (y - b1) / k1 === (y - b2) / k2

  // parallel lines
  if (k1 === k2) {
    return null;
  }
  const x = (b2 - b1) / (k1 - k2);
  const y = (b1 * k2 - b2 * k1) / (k2 - k1);
  return [x, y];
};

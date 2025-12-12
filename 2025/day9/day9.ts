import { day9input } from "./day9input";
import { Coord, minMaxCoords } from "../../utils/Coord";
import { Segment } from "../../utils/segments";

const smallRawInput = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;

const parse = (rawInput: string): Coord[] =>
  rawInput.split("\n").map((row) => row.split(",").map(Number) as Coord);

const findMaxArea = (
  vertices: Coord[],
  canFormRectPredicate: (v1: Coord, v2: Coord) => boolean,
) => {
  let count = 0;
  let max = 0;
  for (let i = 0; i < vertices.length - 1; i++) {
    const [x1, y1] = vertices[i];
    for (let j = i + 1; j < vertices.length; j++) {
      const [x2, y2] = vertices[j];
      const { minX, maxX, minY, maxY } = minMaxCoords([x1, y1], [x2, y2]);
      const area = (maxX - minX + 1) * (maxY - minY + 1);
      if (!canFormRectPredicate([x1, y1], [x2, y2])) {
        continue;
      }
      count++;

      max = Math.max(max, area);
    }
  }
  return max;
};

const day9p1 = (rawInput: string) => {
  const vertices = parse(rawInput);
  return findMaxArea(vertices, () => true);
};

console.log(day9p1(smallRawInput));
console.log(day9p1(day9input));

const getSegments = (vertices: Coord[]): Segment[] => {
  const segments: Segment[] = [];
  let j = vertices.length - 1;
  for (let i = 0; i < vertices.length; i++) {
    segments.push([vertices[i], vertices[j]]);
    j = i;
  }
  return segments;
};

const day9p2 = (rawInput: string) => {
  const vertices = parse(rawInput);
  const allSegments = getSegments(vertices);

  const isPointInside = ([x, y]: Coord) => {
    let inside = false;
    let j = vertices.length - 1;
    for (let i = 0; i < vertices.length; i++) {
      const [xi, yi] = vertices[i];
      const [xj, yj] = vertices[j];
      const intersects =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersects) {
        inside = !inside;
      }
      j = i;
    }
    return inside;
  };

  const isPointOnEdge = ([x, y]: Coord) => {
    let j = vertices.length - 1;
    for (let i = 0; i < vertices.length; i++) {
      const [xi, yi] = vertices[i];
      const [xj, yj] = vertices[j];
      j = i;
      const isOnY = x === xi && x === xj;
      const isOnX = y === yi && y === yj;
      if (isOnX && isOnY) {
        return true;
      }
      if (!isOnX && !isOnY) {
        continue;
      }
      const { minX, maxX, minY, maxY } = minMaxCoords([xi, yi], [xj, yj]);
      if (isOnY) {
        if (minY <= y && y <= maxY) {
          return true;
        }
      }
      if (isOnX) {
        if (minX <= x && x <= maxX) {
          return true;
        }
      }
    }
    return false;
  };

  const isPointGreen = (point: Coord) =>
    isPointOnEdge(point) || isPointInside(point);

  const canFormRectangle = ([x1, y1]: Coord, [x2, y2]: Coord) => {
    if (x1 === x2 || y1 === y2) {
      return true;
    }
    if (!(isPointGreen([x1, y2]) && isPointGreen([x2, y1]))) {
      return false;
    }
    const { minX, maxX, minY, maxY } = minMaxCoords([x1, y1], [x2, y2]);
    const segments = getSegments([
      [minX, minY],
      [maxX, minY],
      [maxX, maxY],
      [minX, maxY],
    ]);
    const intersect = (
      [[x1, y1], [x2, y2]]: Segment,
      [[x3, y3], [x4, y4]]: Segment,
    ) => {
      if (x1 === x2 && x3 === x4) {
        return false;
      }
      if (y1 === y2 && y3 === y4) {
        return false;
      }
      if (y1 === y2) {
        console.assert(x3 === x4);
        if (x3 >= Math.max(x1, x2) || x3 <= Math.min(x1, x2)) {
          return false;
        }
        const minY2 = Math.min(y3, y4);
        const maxY2 = Math.max(y3, y4);
        return minY2 < y1 && y1 < maxY2;
      }
      if (x1 === x2) {
        console.assert(y3 === y4);
        if (y3 >= Math.max(y1, y2) || y3 <= Math.min(y1, y2)) {
          return false;
        }
        const minX2 = Math.min(x3, x4);
        const maxX2 = Math.max(x3, x4);
        return minX2 < x1 && x1 < maxX2;
      }
      throw Error("not a straight line");
    };
    return !segments.some((segment1) =>
      allSegments.some((segment2) => intersect(segment1, segment2)),
    );
  };
  return findMaxArea(vertices, canFormRectangle);
};

console.log("p2", day9p2(smallRawInput));
console.log("p2", day9p2(day9input));

// 4667093750

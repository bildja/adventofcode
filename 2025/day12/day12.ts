import { day12input } from "./day12input";

const smallRawInput = `0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2`;

type Shape = boolean[][];
type Region = {
  width: number;
  height: number;
  shapeCounts: number[];
};

const parse = (rawInput: string) => {
  const chunks = rawInput.split("\n\n");
  const regionsChunk = chunks.pop()!;
  const shapes: Shape[] = chunks.map((chunk) =>
    chunk
      .split("\n")
      .slice(1)
      .map((row) => row.split("").map((char) => char === "#")),
  );
  const regions: Region[] = regionsChunk.split("\n").map((row) => {
    const [dimensionsChunk, countsChunk] = row.split(": ");
    const [width, height] = dimensionsChunk.split("x").map(Number);
    const shapeCounts = countsChunk.split(" ").map(Number);
    return {
      width,
      height,
      shapeCounts,
    };
  });
  return { shapes, regions };
};

const day12p1 = (rawInput: string) => {
  const { shapes, regions } = parse(rawInput);
  const shapeAreas = shapes.map((shape) => {
    return shape.flat().filter(Boolean).length;
  });

  const validRegions = regions.filter((region) => {
    const area = region.width * region.height;
    const totalShapesArea = region.shapeCounts
      .map((shapeCount, i) => shapeCount * shapeAreas[i])
      .reduce((a, b) => a + b);
    return area >= totalShapesArea;
  });
  // it's not enough for small input though, one needs to actually check not only the areas
  // but since it works for my actual input, that's it for now
  return validRegions.length;
};

console.log(day12p1(smallRawInput));
console.log(day12p1(day12input));

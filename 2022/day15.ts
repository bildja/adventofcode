import { day15input } from "./day15input";

const smallRawInput = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

type StrCoord = `${number},${number}`;
type Coord = [number, number];

interface Sensor {
  coord: Coord;
  distance: number;
}

const strCoord = (x: number, y: number): StrCoord => `${x},${y}`;
type Segment = [number, number];

const manhattanDistance = (
  [x1, y1]: [number, number],
  [x2, y2]: [number, number]
): number => Math.abs(x2 - x1) + Math.abs(y2 - y1);

const parseRawInput = (
  rawInput: string
): {
  beacons: Set<StrCoord>;
  sensors: Sensor[];
} => {
  const rows = rawInput.split("\n");
  const beacons = new Set<StrCoord>();
  const sensors: Sensor[] = [];
  const reg =
    /Sensor at x=(\-?\d+), y=(\-?\d+): closest beacon is at x=(\-?\d+), y=(\-?\d+)/;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const match = row.match(reg);
    if (!match) {
      throw Error(`Could not parse row ${row} at ${i}`);
    }
    const [sx, sy, bx, by] = Array.from(match).slice(1).map(Number);
    sensors.push({
      coord: [sx, sy],
      distance: manhattanDistance([sx, sy], [bx, by]),
    });
    beacons.add(strCoord(bx, by));
  }

  return { beacons, sensors };
};

const isMerged = ([start1, end1]: Segment, [start2, end2]: Segment) =>
  start1 <= start2 && end1 >= end2;
const isIntersectingRight = ([start1, end1]: Segment, [start2]: Segment) =>
  start1 <= start2 && end1 >= start2;
const isRightAdjustant = ([, end1]: Segment, [start2]: Segment) =>
  start2 - end1 === 1;

const uniteSegments = (segments: Segment[]): Segment[] => {
  let i = 0;
  while (i < segments.length - 1) {
    const current = segments[i];
    const next = segments[i + 1];
    if (isMerged(current, next)) {
      segments.splice(i + 1, 1);
      continue;
    }
    if (isIntersectingRight(current, next) || isRightAdjustant(current, next)) {
      current[1] = next[1];
      segments.splice(i + 1, 1);
      continue;
    }

    i++;
  }
  return segments;
};

const buildSegments = (sensors: Sensor[], findY: number) => {
  const segments: Segment[] = [];
  for (let i = 0; i < sensors.length; i++) {
    const sensor = sensors[i];
    const [x, y] = sensor.coord;
    const yDistance = Math.abs(findY - y);
    if (yDistance > sensor.distance) {
      continue;
    }
    const segmentStart = x - (sensor.distance - yDistance);
    const segmentEnd = x + (sensor.distance - yDistance);
    segments.push([segmentStart, segmentEnd]);
  }
  segments.sort(([a], [b]) => a - b);
  return uniteSegments(segments);
};

const day15 = (rawInput: string, findY: number) => {
  const { sensors, beacons } = parseRawInput(rawInput);

  const unitedSegments = buildSegments(sensors, findY);
  const beaconsInFindRow = (
    Array.from(beacons).map((beacon) => beacon.split(",").map(Number)) as [
      number,
      number
    ][]
  ).filter(([x, y]) => y === findY);
  const beaconsCountInSegment = ([start, end]: Segment) =>
    beaconsInFindRow.filter(([x]) => x >= start && x <= end).length;
  return (
    unitedSegments
      .map(([start, end]) => end - start - beaconsCountInSegment([start, end]))
      .reduce((acc, len) => acc + len, 0) + 1
  );
};

const filterSegmentsByBorder = (
  segments: Segment[],
  start: number,
  end: number
): Segment[] =>
  segments
    .filter(
      ([segmentStart, segmentEnd]) => segmentEnd >= start && segmentStart <= end
    )
    .map(([segmentStart, segmentEnd]) => [
      segmentStart < start ? start : segmentStart,
      segmentEnd > end ? end : segmentEnd,
    ]);

const day15p2 = (rawInput: string, max: number) => {
  const { sensors } = parseRawInput(rawInput);
  const TUNING_FREQUENCY_COEF = 4000000;
  for (let y = 0; y <= max; y++) {
    const segments = filterSegmentsByBorder(buildSegments(sensors, y), 0, max);
    if (segments.length === 1) {
      continue;
    }
    console.assert(segments.length === 2, "more than one dot", y, segments);
    const [, end1] = segments[0];
    const [start2] = segments[1];
    console.assert(
      start2 - end1 === 2,
      "more than one dot between segments",
      y,
      segments
    );

    return (end1 + 1) * TUNING_FREQUENCY_COEF + y;
  }
};

console.log("small", day15p2(smallRawInput, 20));
console.log("real", day15p2(day15input, 4000000));

// 13029710573243 too low
// 13029714573243

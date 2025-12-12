import { day8input } from "./day8input";

const smallRawInput = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`;

type Coord3d = { x: number; y: number; z: number };

type Coord3dKey = `${number},${number},${number}`;

const coord3dKey = ({ x, y, z }: Coord3d): Coord3dKey => `${x},${y},${z}`;

const parse = (rawInput: string): Coord3d[] =>
  rawInput
    .split("\n")
    .map((row) => row.split(",").map(Number))
    .map(([x, y, z]) => ({
      x,
      y,
      z,
    }));

type DistanceObj = { coord1: Coord3d; coord2: Coord3d; distance: number };

const calcDistance = (
  { x: x1, y: y1, z: z1 }: Coord3d,
  { x: x2, y: y2, z: z2 }: Coord3d,
) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);

const calcDistances = (
  junctionBoxes: Coord3d[],
): { distances: DistanceObj[] } => {
  const distances: DistanceObj[] = [];
  for (let i = 0; i < junctionBoxes.length - 1; i++) {
    const junctionBox = junctionBoxes[i];
    for (let j = i + 1; j < junctionBoxes.length; j++) {
      const junctionBox2 = junctionBoxes[j];
      const distance = calcDistance(junctionBox, junctionBox2);
      distances.push({ coord1: junctionBox, coord2: junctionBox2, distance });
    }
  }
  return {
    distances: distances.sort(({ distance: a }, { distance: b }) => a - b),
  };
};

class JunctionCircuits {
  private circuits: Record<Coord3dKey, { circuitId: number }>;
  private circuitConnections: Record<number, Set<Coord3dKey>>;

  constructor(private junctionBoxes: Coord3d[]) {
    this.circuits = Object.fromEntries(
      junctionBoxes.map((coord, i) => [coord3dKey(coord), { circuitId: i }]),
    );
    this.circuitConnections = Object.fromEntries(
      Object.entries(this.circuits).map(([key, { circuitId }]) => [
        circuitId,
        new Set<Coord3dKey>([key as Coord3dKey]),
      ]),
    );
  }

  connect(coord1: Coord3d, coord2: Coord3d) {
    const { circuitConnections, circuits } = this;
    const k1 = coord3dKey(coord1);
    const k2 = coord3dKey(coord2);
    if (circuits[k1].circuitId === circuits[k2].circuitId) {
      return false;
    }
    const circuitId = Math.min(circuits[k1].circuitId, circuits[k2].circuitId);
    const maxCircuitId = Math.max(
      circuits[k1].circuitId,
      circuits[k2].circuitId,
    );
    circuitConnections[circuits[k1].circuitId]?.forEach((el) =>
      circuitConnections[circuitId]?.add(el),
    );
    circuitConnections[circuits[k2].circuitId]?.forEach((el) =>
      circuitConnections[circuitId]?.add(el),
    );
    circuitConnections[circuitId].add(k1);
    circuitConnections[circuitId].add(k2);
    circuits[k1].circuitId = circuitId;
    circuits[k2].circuitId = circuitId;
    circuitConnections[maxCircuitId].forEach((el) => {
      circuits[el].circuitId = circuitId;
    });
    delete circuitConnections[maxCircuitId];
    return true;
  }

  get allConnections() {
    return Object.entries(this.circuitConnections).map(
      ([, connections]) => connections,
    );
  }
}

const day8p1 = (rawInput: string, iterations: number) => {
  const junctionBoxes = parse(rawInput);
  const { distances } = calcDistances(junctionBoxes);
  const junctionCircuits = new JunctionCircuits(junctionBoxes);
  for (let i = 0; i < iterations; i++) {
    const { coord1, coord2 } = distances[i];
    junctionCircuits.connect(coord1, coord2);
  }
  const topCircuits = junctionCircuits.allConnections
    .map((connections) => connections.size)
    .toSorted((a, b) => b - a)
    .slice(0, 3);
  return topCircuits.reduce((a, b) => a * b, 1);
};

console.log(day8p1(smallRawInput, 10));
console.log(day8p1(day8input, 1000)); // 102816

const day8p2 = (rawInput: string) => {
  const junctionBoxes = parse(rawInput);
  const { distances } = calcDistances(junctionBoxes);
  const junctionCircuits = new JunctionCircuits(junctionBoxes);
  let i = 0;
  let lastConnection: DistanceObj = distances[0];
  while (junctionCircuits.allConnections.length > 1 && i < distances.length) {
    const { coord1, coord2 } = distances[i];
    const connected = junctionCircuits.connect(coord1, coord2);
    if (connected) {
      lastConnection = distances[i];
    }
    i++;
  }
  return lastConnection.coord1.x * lastConnection.coord2.x;
};

console.log("p2", day8p2(smallRawInput));
console.log("p2", day8p2(day8input));

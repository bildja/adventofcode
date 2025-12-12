import { day24input } from "./day24input";
import { Coord } from "../utils/Coord";
import { init } from "z3-solver";
import { intersectInPlane } from "../utils/segments";

const smallRawInput = `
19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`;

type Coord3d = { x: number; y: number; z: number };

type Hailstone = {
  coord: Coord3d;
  velocity: Coord3d;
};

const to3dCoord = ([x, y, z]: [number, number, number]): Coord3d => ({
  x,
  y,
  z,
});

const parse = (rawInput: string): Hailstone[] =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => {
      const [coord, velocity] = line
        .split(" @ ")
        .map((el) => el.split(", ").map(Number));
      return {
        coord: to3dCoord(coord as [number, number, number]),
        velocity: to3dCoord(velocity as [number, number, number]),
      };
    });

const addVelocity = (
  { x, y, z }: Coord3d,
  { x: dx, y: dy, z: dz }: Coord3d,
  coef = 1,
) => ({
  x: x + coef * dx,
  y: y + coef * dy,
  z: z + coef * dz,
});

type Intersection = {
  coord: Coord;
  hailstoneA: Hailstone;
  hailstoneB: Hailstone;
};

const day24p1 = (rawInput: string, min: number, max: number) => {
  const hailstones = parse(rawInput);
  const intersections: Intersection[] = [];

  const isWithinRange = ({ coord: [x, y] }: Intersection) =>
    x >= min && x <= max && y >= min && y <= max;
  const isForwardInTime = ({
    hailstoneA: {
      coord: { x: xa, y: ya },
      velocity: { x: dxa, y: dya },
    },
    hailstoneB: {
      coord: { x: xb, y: yb },
      velocity: { x: dxb, y: dyb },
    },
    coord: [x, y],
  }: Intersection) => {
    if ((x - xa) / dxa < 0) {
      return false;
    }
    if ((x - xb) / dxb < 0) {
      return false;
    }
    if ((y - ya) / dya < 0) {
      return false;
    }
    if ((y - yb) / dyb < 0) {
      return false;
    }
    return true;
  };
  for (let i = 0; i < hailstones.length; i++) {
    const { coord, velocity } = hailstones[i];
    const { x: x1, y: y1 } = coord;
    const { x: x2, y: y2 } = addVelocity(coord, velocity);
    for (let j = i + 1; j < hailstones.length; j++) {
      const { coord: coord2, velocity: velocity2 } = hailstones[j];
      const { x: x3, y: y3 } = coord2;
      const { x: x4, y: y4 } = addVelocity(coord2, velocity2);
      const intersectionCoord = intersectInPlane(
        [
          [x1, y1],
          [x2, y2],
        ],
        [
          [x3, y3],
          [x4, y4],
        ],
      );
      if (intersectionCoord) {
        intersections.push({
          coord: intersectionCoord,
          hailstoneA: hailstones[i],
          hailstoneB: hailstones[j],
        });
      }
    }
  }

  return intersections.filter(isWithinRange).filter(isForwardInTime).length;
};

const day24p2 = async (rawInput: string) => {
  const hailstones = parse(rawInput);
  // basically it's a system of 9 equations with 9 variables:
  // rx + rvx * t1 = x1 + vx1 * t1
  // ry + rvy * t1 = y1 + vy1 * t1
  // rz + rvz * t1 = z1 + vz1 * t1
  // rx + rvx * t2 = x2 + vx2 * t2
  // ry + rvy * t2 = y2 + vy2 * t2
  // rz + rvz * t2 = z2 + vz2 * t2
  // rx + rvx * t3 = x3 + vx3 * t3
  // ry + rvy * t3 = y3 + vy3 * t3
  // rz + rvz * t3 = z3 + vz3 * t3

  // can be solved manually or for example here:
  // https://quickmath.com/webMathematica3/quickmath/equations/solve/advanced.jsp#c=solve_solveequationsadvanced&v1=x%2520%2B%2520a%2520*%2520t%2520%253D%252019%2520%2520-2%2520*%2520t%250Ay%2520%2B%2520b%2520*%2520t%2520%253D%252013%2520%2B%25201*%2520t%250Az%2520%2B%2520c%2520*%2520t%2520%253D%252030%2520%2520-2*%2520t%250Ax%2520%2B%2520a%2520*%2520u%2520%253D%252018%2520%2520-1%2520*%2520u%250Ay%2520%2B%2520b%2520*%2520u%2520%253D%252019%2520%2520-1*%2520u%250Az%2520%2B%2520c%2520*%2520u%2520%253D%252022%2520%2520-2*%2520u%250Ax%2520%2B%2520a%2520*%2520v%2520%253D%252020%2520%2520-2%2520*%2520v%250Ay%2520%2B%2520b%2520*%2520v%2520%253D%252025%2520%2520-2*%2520v%250Az%2520%2B%2520c%2520*%2520v%2520%253D%252034%2520%2520-4*%2520v&v2=x%250Ay%250Az%250Aa%250Ab%250Ac%250At%250Au%250Av
  // with the first three hailstones

  // ideally it should be solved manually in the paper and then type the formula
  // but this idea sounded too cumbersome, so I found the z3-solver and made it solve the equations in runtime

  const { Context } = await init();
  const { Solver, Int } = Context("main");

  // rock x,y,z and velocity
  const rx = Int.const("x");
  const ry = Int.const("y");
  const rz = Int.const("z");
  const rvx = Int.const("vx");
  const rvy = Int.const("vy");
  const rvz = Int.const("vz");
  const solver = new Solver();

  for (let i = 0; i < hailstones.slice(0, 3).length; i++) {
    const { coord, velocity } = hailstones[i];
    const t = Int.const(`t${i + 1}`);
    solver.add(t.ge(0));
    // rock.x + rock.velocity * t = hailstone.coord.x + hailstone.velocity * t
    solver.add(rx.add(rvx.mul(t)).eq(t.mul(velocity.x).add(coord.x)));
    // same for x, y, z
    solver.add(ry.add(rvy.mul(t)).eq(t.mul(velocity.y).add(coord.y)));
    solver.add(rz.add(rvz.mul(t)).eq(t.mul(velocity.z).add(coord.z)));
  }
  const sat = await solver.check();
  if (sat !== "sat") {
    throw Error("unsolvable :shrug:");
  }
  const x = Number(solver.model().eval(rx));
  const y = Number(solver.model().eval(ry));
  const z = Number(solver.model().eval(rz));
  return x + y + z;
};

console.log(day24p1(smallRawInput, 7, 27));
console.log(day24p1(day24input, 200000000000000, 400000000000000));

console.log("\n============= P2 ===========\n");
day24p2(smallRawInput).then((res) => console.log("day24p2 small", res));
day24p2(day24input).then((res) => console.log("day24p2", res));

// console.log(day24p2(day24input));

// 931193307668256
// 931193307668256

// 931 193 307 668 256

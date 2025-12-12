import { day10input } from "./day10input";
import { createMatr } from "../../utils/createMatr";
import { Arith, init } from "z3-solver";

const smallRawInput = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;

type Diagram = {
  buttons: number[][];
  indicatorLights: string;
  joltageLevels: number[];
};

const parse = (rawInput: string): Diagram[] => {
  const rows = rawInput.split("\n");
  return rows.map((row, i) => {
    const match = row.match(/^\[([.#]+)] (\(.+?\))+ \{(.+)}$/);
    if (!match) {
      throw Error(`Could not parse "${row}" at \[${i}\]`);
    }
    const [, indicatorLights, buttonWiringsRaw, joltageLevelsRaw] = match;
    const buttonWirings = buttonWiringsRaw
      .trim()
      .split(" ")
      .map((buttonWiringRaw) => {
        return buttonWiringRaw.slice(1, -1).split(",").map(Number);
      });
    const joltageLevels = joltageLevelsRaw.split(",").map(Number);
    return { buttons: buttonWirings, indicatorLights, joltageLevels };
  });
};

type ButtonsState = boolean[];

const buttonsStateRepresentation = (buttonsState: ButtonsState) =>
  buttonsState.map((state) => (state ? "#" : ".")).join("");

const calculateDiagramP1 = (diagram: Diagram): number => {
  const buttonsState: ButtonsState = new Array(
    diagram.indicatorLights.length,
  ).fill(false);
  const clickButton = (buttonState: ButtonsState, i: number) => {
    const newButtonState = [...buttonState];
    const buttonWiring = diagram.buttons[i];
    for (const buttonWiringValue of buttonWiring) {
      newButtonState[buttonWiringValue] = !newButtonState[buttonWiringValue];
    }
    return newButtonState;
  };
  const nextButton = (
    curButtonState: ButtonsState,
    clicks: number,
    i: number,
  ): number => {
    if (
      buttonsStateRepresentation(curButtonState) === diagram.indicatorLights
    ) {
      return clicks;
    }
    if (i >= diagram.buttons.length) {
      return Number.MAX_SAFE_INTEGER;
    }

    return Math.min(
      nextButton(curButtonState, clicks, i + 1),
      nextButton(clickButton(curButtonState, i), clicks + 1, i + 1),
    );
  };
  return nextButton(buttonsState, 0, 0);
};

const day10p1 = (rawInput: string) =>
  parse(rawInput)
    .map(calculateDiagramP1)
    .reduce((a, b) => a + b);

console.log(day10p1(smallRawInput));
console.log(day10p1(day10input));

const calculateDiagramP2 = async (diagram: Diagram): Promise<number> => {
  const n = diagram.joltageLevels.length;
  const m = diagram.buttons.length;

  const a = createMatr(n, m, 0);
  const b = diagram.joltageLevels;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      a[i][j] = diagram.buttons[j].includes(i) ? 1 : 0;
    }
  }
  // xj — number of times diagram.buttons[j] was clicked
  // sum(aj*xj) = b
  // x1+x2+...+xn -> min
  const { Context } = await init();
  const { Int, Optimize } = Context("main");
  const optimizer = new Optimize();
  const x: Arith<"main">[] = [];
  for (let j = 0; j < m; j++) {
    const xj = Int.const(`x_${j}`);
    optimizer.add(xj.ge(0));
    x.push(xj);
  }
  // sum(aj*xj) = b
  for (let i = 0; i < n; i++) {
    let sum = x[0].mul(a[i][0]);
    for (let j = 1; j < m; j++) {
      sum = sum.add(x[j].mul(a[i][j]));
    }
    optimizer.add(sum.eq(b[i]));
  }

  const objective = x.reduce((acc, val) => acc.add(val), Int.val(0));
  optimizer.minimize(objective);
  const sat = await optimizer.check();
  if (sat !== "sat") {
    throw Error("unsolvable :shrug:");
  }
  const model = optimizer.model();
  return (
    x
      // @ts-ignore
      .map((xj) => model.eval(xj).value() as number)
      .reduce((a, b) => a + b)
  );
};

const day10p2 = async (rawInput: string) => {
  const diagrams = parse(rawInput);
  return Promise.all(diagrams.map(calculateDiagramP2)).then((all) =>
    all.reduce((a: number, b: number) => a + b),
  );
};

day10p2(smallRawInput).then((res) => console.log("p2", res));
day10p2(day10input).then((res) => console.log("p2", res));

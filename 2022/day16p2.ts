import { access } from "fs";
import {
  day16input,
  day16inputCombinations,
  day16inputSmallCombinations,
} from "./day16input";

const smallRawInput = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`;

interface Valve {
  name: string;
  flowRate: number;
  tunnelsTo: string[];
}
type ValvesNetwork = Record<string, Valve>;

const parseRow = (row: string): Valve => {
  const match = row.match(
    /Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ((?:[A-Z]+(?:, )?)+)$/
  );
  if (!match) {
    throw Error(`could not parse row "${row}"`);
  }
  const [, valve, flowRateStr, tunnelsToStr] = match;
  const flowRate = Number(flowRateStr);
  const tunnelsTo = tunnelsToStr.split(", ");
  return {
    name: valve,
    flowRate,
    tunnelsTo,
  };
};

type Distances = Record<string, number>;
type SptSet = Record<string, boolean>;

const parseRawInput = (rawInput: string) => {
  const rows = rawInput.split("\n");
  return rows.reduce((acc, row) => {
    const valve = parseRow(row);
    return {
      ...acc,
      [valve.name]: valve,
    };
  }, {} as ValvesNetwork);
};

type ValvesPathes = Record<string, Distances>;
const valvesPathes = (valvesNetwork: ValvesNetwork): ValvesPathes => {
  const pathes: ValvesPathes = {};
  const allValves = Object.keys(valvesNetwork);
  for (const valveName of allValves) {
    pathes[valveName] = {};
    for (const v of allValves) {
      if (valveName === v) {
        continue;
      }
      pathes[valveName][v] = Number.MAX_SAFE_INTEGER;
    }
    for (const v of valvesNetwork[valveName].tunnelsTo) {
      pathes[valveName][v] = 1;
    }
  }
  const minDistance = (dist: Distances, sptSet: SptSet): number => {
    // Initialize min value
    let min = Number.MAX_SAFE_INTEGER;
    let minIndex = -1;

    for (let v = 0; v < allValves.length; v++) {
      if (sptSet[allValves[v]] == false && dist[allValves[v]] <= min) {
        min = dist[allValves[v]];
        minIndex = v;
      }
    }
    return minIndex;
  };

  const dijkstra = (from: string) => {
    const sptSet: SptSet = allValves.reduce(
      (acc, valve) => ({ ...acc, [valve]: false }),
      {}
    );
    const dist: Distances = allValves.reduce(
      (acc, valve) => ({ ...acc, [valve]: Number.MAX_SAFE_INTEGER }),
      {}
    );
    dist[from] = 0;
    for (let count = 0; count < allValves.length - 1; count++) {
      let u = minDistance(dist, sptSet);
      sptSet[allValves[u]] = true;
      for (let v = 0; v < allValves.length; v++) {
        if (sptSet[allValves[v]]) {
          continue;
        }
        // console.log("valve", u, allValves[u]);
        if (!valvesNetwork[allValves[u]].tunnelsTo.includes(allValves[v])) {
          continue;
        }
        if (dist[allValves[u]] === Number.MAX_SAFE_INTEGER) {
          continue;
        }
        if (dist[allValves[u]] + 1 < dist[allValves[v]]) {
          dist[allValves[v]] = dist[allValves[u]] + 1;
        }
      }
    }
    return dist;
  };

  for (let i = 0; i < allValves.length; i++) {
    pathes[allValves[i]] = dijkstra(allValves[i]);
  }
  return pathes;
};

function* range(start: number, end: number) {
  for (; start <= end; ++start) {
    yield start;
  }
}

function last<T>(arr: T[]) {
  return arr[arr.length - 1];
}

function* numericCombinations(
  n: number,
  r: number,
  loc: number[] = []
): IterableIterator<number[]> {
  const idx = loc.length;
  if (idx === r) {
    yield loc;
    return;
  }
  for (let next of range(idx ? last(loc) + 1 : 0, n - r + idx)) {
    yield* numericCombinations(n, r, loc.concat(next));
  }
}

function* combinations<T>(arr: T[], r: number) {
  for (let idxs of numericCombinations(arr.length, r)) {
    yield idxs.map((i) => arr[i]);
  }
}

const getCombinations = <T>(arr: T[], r: number) =>
  Array.from(combinations(arr, r));

interface StackItem {
  currentValveName: string;
  minutes: number;
  opened: Record<string, boolean>;
  val: number;
}

const day16 = (input: string) => {
  const valvesNetwork = parseRawInput(input);
  const n = Object.keys(valvesNetwork).length;
  const pathes = valvesPathes(valvesNetwork);
  const allValves = Object.keys(valvesNetwork);
  let totalIterations = 0;

  //   const findMax = (
  //     currentValveName: string,
  //     minutes: number,
  //     opened: Record<string, boolean>
  //   ): number => {
  totalIterations++;
  const stack: StackItem[] = [];
  stack.push({ currentValveName: "AA", minutes: 30, opened: {}, val: 0 });
  let totalMax = 0;

  while (stack.length) {
    const stackItem = stack.pop();
    if (!stackItem) {
      break;
    }
    const { currentValveName, minutes, opened, val } = stackItem;

    if (!minutes && Object.keys(opened).length === n) {
      console.log("time is up");
      break;
      //   return 0;
    }
    const valve = valvesNetwork[currentValveName];
    if (minutes === 1) {
      console.log("one minute left");
      // we spend a minute on opening
      break;
      //   return 0;
    }
    const filterValveFn = (possibleTargetValveName: string) => {
      // we are here
      if (currentValveName === possibleTargetValveName) {
        return false;
      }
      // no need to go there, it's open
      if (opened[possibleTargetValveName]) {
        return false;
      }
      // no need to go there, we won't be able to open it
      if (pathes[currentValveName][possibleTargetValveName] >= minutes - 2) {
        return false;
      }
      // no need to go there, opening it doesn't make sense
      if (valvesNetwork[possibleTargetValveName].flowRate === 0) {
        return false;
      }
      return true;
    };

    const possibleValves = allValves.filter(filterValveFn);

    if (!possibleValves.length) {
      //   console.log("no possible");
      totalMax =
        val + (opened[currentValveName] ? 0 : valve.flowRate * (minutes - 1));
      //   totalMax = val;
      break;
      //   return val;
    }
    // const possibleCombinations = getCombinations(possibleValves, 2);

    let max = 0;

    for (let i = 0; i < possibleValves.length; i++) {
      const possibleValveTarget = possibleValves[i];
      let minutesLeftWhenReach =
        minutes - pathes[currentValveName][possibleValveTarget];
      //   let val = 0;
      let newVal = 0;
      if (valve.flowRate) {
        minutesLeftWhenReach--;
        newVal = val + valve.flowRate * (minutes - 1);
        if (minutesLeftWhenReach > 1) {
          stack.push({
            val: newVal,
            currentValveName: possibleValveTarget,
            minutes: minutesLeftWhenReach,
            opened: {
              ...opened,
              [currentValveName]: true,
            },
          });
        }
        //    +
        //   (minutesLeftWhenReach > 1
        //     ? findMax(possibleValveTarget, minutesLeftWhenReach, {
        //         ...opened,
        //         [currentValveName]: true,
        //       })
        //     : 0);
      } else {
        // just go
        newVal = val;
        stack.push({
          val,
          currentValveName: possibleValveTarget,
          minutes: minutesLeftWhenReach,
          opened,
        });
        // val = findMax(possibleValveTarget, minutesLeftWhenReach, {
        //   ...opened,
        // });
      }
      max = Math.max(newVal, max);
      //   if (val > max) {
      //     max = val;
      //   }
    }

    // return max;
    // end while
  }

  //     return -11;
  //   };

  //   const val = findMax("AA", 30, {});
  console.log(totalIterations);
  //   console.log(JSON.stringify(allValves));
  return totalMax;
  //   return val;
};

console.log("small", day16(smallRawInput));
// console.log("real", day16(day16input));

// 1739 too low

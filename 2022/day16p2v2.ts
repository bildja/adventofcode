import { day16input } from "./day16input";

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

const day16 = (input: string) => {
  const valvesNetwork = parseRawInput(input);
  const n = Object.keys(valvesNetwork).length;
  const pathes = valvesPathes(valvesNetwork);
  const allValves = Object.keys(valvesNetwork);
  let totalIterations = 0;

  const findMax = (
    currentValveName: string,
    minutes: number,
    opened: Record<string, boolean>,
    elephant: boolean
  ): number => {
    totalIterations++;

    if (!minutes && Object.keys(opened).length === n) {
      console.log("time is up");
      return 0;
    }
    // const valve = valvesNetwork[currentValveName];
    if (minutes === 1) {
      console.log("one minute left");
      // we spend a minute on opening
      return 0;
    }

    const possibleValves = allValves.filter((possibleTargetValveName) => {
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
    });
    if (!possibleValves.length) {
      const val = opened[currentValveName]
        ? 0
        : valvesNetwork[currentValveName].flowRate * (minutes - 1);
      return val;
    }

    let max = 0;

    for (let i = 0; i < possibleValves.length; i++) {
      const possibleValveTarget = possibleValves[i];
      let minutesLeftWhenReach =
        minutes - pathes[currentValveName][possibleValveTarget] - 1;
      const nextOpened = {
        ...opened,
        [possibleValveTarget]: true,
      };
      const val =
        valvesNetwork[possibleValveTarget].flowRate * minutesLeftWhenReach +
        Math.max(
          findMax(
            possibleValveTarget,
            minutesLeftWhenReach,
            nextOpened,
            elephant
          ),
          elephant ? findMax("AA", 26, nextOpened, false) : 0
        );

      max = Math.max(max, val);
    }

    return max;
  };

  const val = findMax("AA", 26, {}, true);
  console.log(totalIterations);

  return val;
};

console.log("small", day16(smallRawInput));
console.log("real", day16(day16input));

// 1739 too low

// p2 2301 too low

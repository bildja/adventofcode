import { day19input } from "./day19input";
// import { parentPort, workerData } from "worker_threads";

const smallRawInput = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`;

interface Blueprint {
  ID: number;

  ore: { ore: number };
  clay: { ore: number };
  obsidian: {
    ore: number;
    clay: number;
  };
  geode: {
    ore: number;
    obsidian: number;
  };
}

const parseInput = (input: string): Blueprint[] =>
  input.split("\n").map((row) => {
    const match = row.match(
      /^Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian.$/
    );
    if (!match) {
      throw Error(`could not parse row "${row}"`);
    }
    const [
      ,
      ID,
      ore,
      clay,
      obsidianOre,
      obsidianClay,
      geodeOre,
      geodeObsidian,
    ] = match.map(Number);
    return {
      ID,
      ore: { ore },
      clay: { ore: clay },
      obsidian: {
        ore: obsidianOre,
        clay: obsidianClay,
      },
      geode: {
        ore: geodeOre,
        obsidian: geodeObsidian,
      },
    };
  });

interface Resources {
  ore: number;
  clay: number;
  obsidian: number;
  geode: number;
}

interface RobotFactories {
  ore: number;
  clay: number;
  obsidian: number;
  geode: number;
}

interface AllResources {
  resources: Resources;
  robotFactories: RobotFactories;
  minutes: number;
}

const canBuyGeodeFn = (blueprint: Blueprint, resources: Resources) => () =>
  resources.ore >= blueprint.geode.ore &&
  resources.obsidian >= blueprint.geode.obsidian;

const addRobotFactory = (
  robotFactories: RobotFactories,
  robotFactoryName: keyof RobotFactories
): RobotFactories => {
  return {
    ...robotFactories,
    [robotFactoryName]: robotFactories[robotFactoryName] + 1,
  };
};

const payForRobotFactory = (
  resources: Resources,
  price: Partial<Resources>
): Resources => {
  const newResources = { ...resources };
  for (const [k, v] of Object.entries(price)) {
    if (newResources[k as keyof Resources] < v) {
      throw Error(
        `can not pay for this, it requires ${v} of ${k}, and there is only ${
          newResources[k as keyof Resources]
        } `
      );
    }
    newResources[k as keyof Resources] -= v;
  }
  return newResources;
};

const buyRobotFactory = (
  blueprint: Blueprint,
  resources: Resources,
  robotFactories: RobotFactories,
  robotFactoryName: keyof RobotFactories
) => ({
  newResources: payForRobotFactory(resources, blueprint[robotFactoryName]),
  newRobotFactories: addRobotFactory(robotFactories, robotFactoryName),
});

const canBuyObsidianFn = (blueprint: Blueprint, resources: Resources) => () =>
  resources.ore >= blueprint.obsidian.ore &&
  resources.clay >= blueprint.obsidian.clay;

const canBuyClayFn = (blueprint: Blueprint, resources: Resources) => () =>
  resources.ore >= blueprint.clay.ore;

const canBuyOreFn = (blueprint: Blueprint, resources: Resources) => () =>
  resources.ore >= blueprint.ore.ore;

type CacheKey = string & { __cacheKey: "cache" };
// type CacheKey = `${number}:${number}-${number}-${number}-${number}`;

const earnResources = (
  resources: Resources,
  robotFactories: RobotFactories
): Resources => ({
  ore: resources.ore + robotFactories.ore,
  clay: resources.clay + robotFactories.clay,
  obsidian: resources.obsidian + robotFactories.obsidian,
  geode: resources.geode + robotFactories.geode,
});
const suggestedPath: (keyof RobotFactories | undefined)[] = [
  undefined,
  undefined,
  "clay",
  undefined,
  "clay",
  undefined,
  "clay",
  undefined,
  undefined,
  undefined,
  "obsidian",
  "clay",
  undefined,
  undefined,
  "obsidian",
  undefined,
  undefined,
  "geode",
  undefined,
  undefined,
  "geode",
  undefined,
  undefined,
  undefined,
];

const suggestedPathP2: (keyof RobotFactories | undefined)[] = [
  undefined,
  undefined,
  undefined,
  undefined,
  "ore",
  undefined,
  "clay",
  "clay",
  "clay",
  "clay",
  "clay",
  "clay",
  "clay",
  "obsidian",
  undefined,
  "obsidian",
  "obsidian",
  undefined,
  "obsidian",
  "geode",
  "obsidian",
  "geode",
  "geode",
  "geode",
  undefined,
  "geode",
  "geode",
  undefined,
  "geode",
  "geode",
  "geode",
  undefined,
];
const a = ["ore", "clay", "obsidian", "geode"] as const;
// type D19Cache = [number, number, number, number, number][];
type D19Cache = Record<CacheKey, number>;

const day19 = (input: string, totalMinutes: number = 24) => {
  const blueprints = parseInput(input);
  let totalIterations = 0;
  let savedByCache = 0;
  const getCacheKey = (
    minutes: number,
    { ore, clay, obsidian, geode }: Resources,
    robotFactories: RobotFactories
  ): CacheKey => {
    return `${minutes}:::${ore}-${clay}-${obsidian}-${geode}|||${robotFactories.ore}-${robotFactories.clay}-${robotFactories.obsidian}-${robotFactories.geode}` as CacheKey;
    // `${minutes}:::${ore}-${clay}-${obsidian}-${geode}|||${robotFactories.ore}-${robotFactories.clay}-${robotFactories.obsidian}-${robotFactories.geode}` as CacheKey;
    // `${minutes}:${ore}-${clay}-${obsidian}-${robotFactories.ore}-${robotFactories.clay}-${robotFactories.obsidian}-` as CacheKey;
    // `${minutes}:${ore}-${clay}-${obsidian}-${robotFactories.ore}` as CacheKey;
  };

  const runBlueprint = (
    blueprint: Blueprint,
    { resources, robotFactories, minutes }: AllResources,
    cache: D19Cache
  ): number => {
    totalIterations++;
    if (totalIterations % 1000000 === 0) {
      console.log(`${totalIterations / 1000000}mil`);
    }
    const cacheKey = getCacheKey(minutes, resources, robotFactories);

    if (cache[cacheKey] !== undefined) {
      savedByCache++;
      return cache[cacheKey];
    }
    // console.log(`Minute ${totalMinutes - minutes + 1}`, cacheKey);

    const canBuyClay = canBuyClayFn(blueprint, resources);
    const canBuyOre = canBuyOreFn(blueprint, resources);
    const canBuyObsidian = canBuyObsidianFn(blueprint, resources);
    const canBuyGeode = canBuyGeodeFn(blueprint, resources);

    const justRunNext = (
      {
        newResources,
        newRobotFactories,
      }: {
        newResources: Resources;
        newRobotFactories: RobotFactories;
      } = {
        newRobotFactories: { ...robotFactories },
        newResources: { ...resources },
      }
    ) => {
      newResources = earnResources(newResources, robotFactories);

      return runBlueprint(
        blueprint,
        {
          resources: newResources,
          robotFactories: newRobotFactories,
          minutes: minutes - 1,
        },
        cache
      );
    };
    const buyAndRun = (robotFactoryName: keyof RobotFactories) => {
      const res = justRunNext(
        buyRobotFactory(blueprint, resources, robotFactories, robotFactoryName)
      );
      return res;
    };

    const runSuggestedPath = (
      suggestedPath: (keyof RobotFactories | undefined)[]
    ) => {
      const name = suggestedPath[totalMinutes - minutes];
      if (name === undefined) {
        console.log("  just running");
        return justRunNext();
      } else {
        console.log("  buying", name);

        return buyAndRun(name);
      }
    };

    if (minutes <= 1) {
      const newResources = earnResources(resources, robotFactories);
      return newResources.geode;
    }

    // return runSuggestedPath(suggestedPathP2);

    if (canBuyGeode()) {
      cache[cacheKey] = buyAndRun("geode");
      return cache[cacheKey];
    }
    if (canBuyObsidian()) {
      return buyAndRun("obsidian");
    }

    const result = Math.max(
      // canBuyObsidian() ? buyAndRun("obsidian") : 0,
      canBuyClay() ? buyAndRun("clay") : 0,
      canBuyOre() ? buyAndRun("ore") : 0,
      justRunNext()
    );

    cache[cacheKey] = Math.max(cache[cacheKey] ?? 0, result);

    return result;
  };

  const newAllResources = (): AllResources => ({
    resources: {
      ore: 0,
      clay: 0,
      obsidian: 0,
      geode: 0,
    },
    robotFactories: {
      ore: 1,
      clay: 0,
      obsidian: 0,
      geode: 0,
    },
    minutes: totalMinutes,
  });
  // console.log("blueprints.length", blueprints.length);
  // console.log("workerData.start", workerData.start * 6, workerData.start * 6 + 6);
  const blueprintResults = blueprints
    // .slice(workerData.start * 6, workerData.start * 6 + 6)
    .slice(0, 3)
    // .slice(2, 3)
    // .slice(15, 16)
    .map((blueprint) => {
      const cache: D19Cache = {};
      totalIterations = 0;
      savedByCache = 0;
      // console.log(blueprint.ID, input.split("\n")[blueprint.ID - 1]);
      // const result =
      //   blueprint.ID * runBlueprint(blueprint, newAllResources(), cache);
      const result = runBlueprint(blueprint, newAllResources(), cache);
      console.log(
        "total iterations",
        blueprint.ID,
        totalIterations.toLocaleString()
      );
      console.log("result", blueprint.ID, result);
      console.log("saved by cache", savedByCache.toLocaleString());
      console.log(`${((100 * savedByCache) / totalIterations).toFixed(2)}%`);
      return result;
    });

  console.log(JSON.stringify(blueprintResults));
  return blueprintResults.reduce((a, b) => a * b, 1);
};

// console.log("small", day19(smallRawInput, 24));
// console.log("small", day19(smallRawInput, 32));
console.log("big", day19(day19input, 32));
// const big = day19(day19input);
// console.log("big", big);
// parentPort?.postMessage(big);

// 862 too low; 1095 – too high;
// 55,075,110; 180,094,550

// [2,2,0,32,5,66,0,16,0,10, 11, 84, 0, 0, 0, 32, 34, 126, 38, 120, 105, 22, 23, 24, 0,0,0,28,58,150]

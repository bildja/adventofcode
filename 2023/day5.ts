import { day5input } from "./day5input";

const smallRawInput = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

type ResourceMapping = {
  destinationRangeStart: number;
  sourceRangeStart: number;
  rangeLength: number;
};

type ResourcesMappings = {
  seeds: number[];
  seedToSoil: ResourceMapping[];
  soilToFertilizer: ResourceMapping[];
  fertilizerToWater: ResourceMapping[];
  waterToLight: ResourceMapping[];
  lightToTemperature: ResourceMapping[];
  temperatureToHumidity: ResourceMapping[];
  humidityToLocation: ResourceMapping[];
};

const parseSeeds = (rawInput: string): number[] => {
  const allSeedsMatch = rawInput.match(/^seeds:\s+((?:\d+\s+)+)\n/);
  if (!allSeedsMatch) {
    throw Error("could not find seeds");
  }
  const [, allSeedsStr] = allSeedsMatch;
  return allSeedsStr.trim().split(/\s+/).map(Number);
};

const parseResourceBlock = (
  resourceMappingBlock: string
): {
  title: keyof Omit<ResourcesMappings, "seed">;
  resourceMappings: ResourceMapping[];
} => {
  const lines = resourceMappingBlock.split("\n");
  const titleLine = lines.shift();
  if (!titleLine) {
    throw Error(`error parsing the block\n${resourceMappingBlock}`);
  }
  const titleMatch = titleLine.match(/^([\w\-]+)\s+map:$/);
  if (!titleMatch) {
    throw Error(`could not parse title "${titleLine}"`);
  }
  const [, title] = titleMatch;
  const titlesMap: Record<string, keyof Omit<ResourcesMappings, "seed">> = {
    "seed-to-soil": "seedToSoil",
    "soil-to-fertilizer": "soilToFertilizer",
    "fertilizer-to-water": "fertilizerToWater",
    "water-to-light": "waterToLight",
    "light-to-temperature": "lightToTemperature",
    "temperature-to-humidity": "temperatureToHumidity",
    "humidity-to-location": "humidityToLocation",
  };
  const resourceMappings: ResourceMapping[] = lines.map((line) => {
    const [destinationRangeStart, sourceRangeStart, rangeLength] = line
      .split(/\s+/)
      .map(Number);
    return { sourceRangeStart, destinationRangeStart, rangeLength };
  });
  const resourceTitle = titlesMap[title];
  if (!resourceTitle) {
    throw Error(`unknown resource title "${resourceTitle}"`);
  }
  return {
    title: resourceTitle,
    resourceMappings,
  };
};

const parse = (rawInput: string): ResourcesMappings => {
  const seeds = parseSeeds(rawInput);
  const resourceMappingsBlocks = rawInput.split("\n\n");
  resourceMappingsBlocks.shift();
  return resourceMappingsBlocks.reduce(
    (acc, resourceMappingBlock) => {
      const { title, resourceMappings } =
        parseResourceBlock(resourceMappingBlock);
      return { ...acc, [title]: resourceMappings };
    },
    { seeds } as ResourcesMappings
  );
};

const destForSource = (
  resourceMappings: ResourceMapping[],
  source: number
): number => {
  for (const {
    sourceRangeStart,
    destinationRangeStart,
    rangeLength,
  } of resourceMappings) {
    if (source >= sourceRangeStart && source < sourceRangeStart + rangeLength) {
      return destinationRangeStart + (source - sourceRangeStart);
    }
  }
  return source;
};

const locationForSeedFactory =
  (resourceMappings: ResourcesMappings) =>
  (seed: number): number =>
    [
      resourceMappings.seedToSoil,
      resourceMappings.soilToFertilizer,
      resourceMappings.fertilizerToWater,
      resourceMappings.waterToLight,
      resourceMappings.lightToTemperature,
      resourceMappings.temperatureToHumidity,
      resourceMappings.humidityToLocation,
    ].reduce(
      (acc, resourceMappings, i) => destForSource(resourceMappings, acc),
      seed
    );

const day5p1 = (rawInput: string) => {
  const resourceMappings = parse(rawInput);
  const locationForSeed = locationForSeedFactory(resourceMappings);

  const locations = resourceMappings.seeds.map(locationForSeed);
  return Math.min(...locations);
};

const day5p2 = (rawInput: string) => {
  const resourceMappings = parse(rawInput);
  const seeds = resourceMappings.seeds;

  const locationForSeed = locationForSeedFactory(resourceMappings);
  let minLocation = locationForSeed(seeds[0]);
  const seedRanges: [number, number][] = [];
  for (let i = 0; i < seeds.length; i += 2) {
    seedRanges.push([seeds[i], seeds[i] + seeds[i + 1]]);
  }
  seedRanges.sort(([a], [b]) => a - b);

  for (let i = 0; i < seedRanges.length; i++) {
    const [start, end] = seedRanges[i];
    for (let seed = start; seed < end; seed++) {
      const location = locationForSeed(seed);
      if (location < minLocation) {
        minLocation = location;
      }
    }
  }

  return minLocation;
};

console.log(day5p1(smallRawInput));
console.log(day5p1(day5input));
console.log(day5p2(smallRawInput));
console.log(day5p2(day5input));

// 6472061 too high
// 6472060

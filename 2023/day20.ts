import { day20input } from "./day20input";
import { lcm } from "../utils/lcmGcd";

const smallRawInput = `
broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`;

const smallRawInput2 = `
broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`;

type Pulse = "low" | "high";

type ModuleBase = {
  destinationModuleNames: string[];
  moduleName: string;
};

type FlipFlopModule = {
  type: "flipFlop";
  on: boolean;
};
type ConjunctionModule = {
  type: "conjunction";
  mem: Record<string, Pulse>;
};
type BroadcasterModule = {
  type: "broadcaster";
};
type Module = ModuleBase &
  (FlipFlopModule | ConjunctionModule | BroadcasterModule);

const parseModule = (rawModule: string): Module => {
  const [moduleInfo, destinationModulesRaw] = rawModule.split(" -> ");
  const destinationModuleNames = destinationModulesRaw.split(", ");
  if (moduleInfo[0] === "%") {
    return {
      type: "flipFlop",
      destinationModuleNames,
      moduleName: moduleInfo.slice(1),
      on: false,
    };
  }
  if (moduleInfo[0] === "&") {
    return {
      type: "conjunction",
      destinationModuleNames,
      moduleName: moduleInfo.slice(1),
      mem: {},
    };
  }
  if (moduleInfo !== "broadcaster") {
    throw Error("messed up with parsing");
  }
  return {
    type: "broadcaster",
    destinationModuleNames,
    moduleName: moduleInfo,
  };
};

const parse = (rawInput: string) =>
  rawInput.trim().split("\n").map(parseModule);

const initConjunctionModules = (modulesDict: Record<string, Module>) => {
  for (const module of Object.values(modulesDict)) {
    for (const destModuleName of module.destinationModuleNames) {
      const destModule = modulesDict[destModuleName];
      if (destModule?.type !== "conjunction") {
        continue;
      }

      destModule.mem[module.moduleName] = "low";
    }
  }
};

type QueueStep = { moduleName: string; pulse: Pulse; sender: string };

const sendPulsesFrom = (
  modulesDict: Record<string, Module>,
  { moduleName, sender, pulse }: QueueStep
): QueueStep[] => {
  const curModule = modulesDict[moduleName];
  if (!curModule) {
    return [];
  }
  let newPulse: Pulse;
  switch (curModule.type) {
    case "flipFlop": {
      if (pulse === "high") {
        return [];
      }
      curModule.on = !curModule.on;
      newPulse = curModule.on ? "high" : "low";
      break;
    }
    case "conjunction": {
      curModule.mem[sender] = pulse;
      const memArray = Object.values(curModule.mem);
      newPulse = memArray.every((p) => p === "high") ? "low" : "high";

      break;
    }
    case "broadcaster": {
      newPulse = pulse;
      break;
    }
  }
  return curModule.destinationModuleNames.map((destModuleName) => ({
    moduleName: destModuleName,
    pulse: newPulse,
    sender: moduleName,
  }));
};

const pushTheButton = (
  modulesDict: Record<string, Module>,
  cb: (queueStep: QueueStep) => void
) => {
  const queue: QueueStep[] = [
    { moduleName: "broadcaster", pulse: "low", sender: "button" },
  ];
  while (queue.length) {
    const { moduleName, pulse, sender } = queue.shift()!;
    cb({ moduleName, sender, pulse });
    for (const queueStep of sendPulsesFrom(modulesDict, {
      moduleName,
      pulse,
      sender,
    })) {
      queue.push(queueStep);
    }
  }
};

const day20p1 = (rawInput: string) => {
  const modules = parse(rawInput);
  const modulesDict: Record<string, Module> = modules.reduce(
    (acc, module) => ({ ...acc, [module.moduleName]: module }),
    {}
  );
  initConjunctionModules(modulesDict);

  const total = { lows: 0, highs: 0 };
  for (let i = 0; i < 1000; i++) {
    pushTheButton(modulesDict, ({ pulse }) => {
      if (pulse === "low") {
        total.lows++;
      } else {
        total.highs++;
      }
    });
  }
  return total.lows * total.highs;
};

const day20p2 = (rawInput: string) => {
  const modules = parse(rawInput);
  const modulesDict: Record<string, Module> = modules.reduce(
    (acc, module) => ({ ...acc, [module.moduleName]: module }),
    {}
  );
  initConjunctionModules(modulesDict);

  const targetModuleName = "rx";
  const parentOfRx = modules.find(({ destinationModuleNames }) =>
    destinationModuleNames.includes(targetModuleName)
  );
  if (parentOfRx?.type !== "conjunction") {
    throw Error("corner case not supported");
  }
  const parentsOfParentOfRx = modules.filter(({ destinationModuleNames }) =>
    destinationModuleNames.includes(parentOfRx.moduleName)
  );
  if (
    !parentsOfParentOfRx.length ||
    !parentsOfParentOfRx.every((module) => module.type === "conjunction")
  ) {
    throw Error("corner case not supported");
  }

  const memParents: Record<string, number> = parentsOfParentOfRx.reduce(
    (acc, module) => ({
      ...acc,
      [module.moduleName]: 0,
    }),
    {}
  );

  let shouldKeepHitting = true;
  let hits = 0;
  while (shouldKeepHitting) {
    hits++;
    pushTheButton(modulesDict, ({ moduleName, pulse }) => {
      if (pulse === "high") {
        return;
      }
      if (!(moduleName in memParents)) {
        return;
      }
      memParents[moduleName] = hits;
      if (Object.values(memParents).every((c) => c > 0)) {
        shouldKeepHitting = false;
      }
    });
  }

  return Object.values(memParents).reduce(lcm);
};

console.log(day20p1(smallRawInput));
console.log(day20p1(smallRawInput2));
console.log(day20p1(day20input));

console.log("\n============= P2 ==========\n");

console.log(day20p2(day20input));

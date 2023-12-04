"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var day19input_1 = require("./day19input");
// import { parentPort, workerData } from "worker_threads";
var smallRawInput = "Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.\nBlueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.";
var parseInput = function (input) {
    return input.split("\n").map(function (row) {
        var match = row.match(/^Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian.$/);
        if (!match) {
            throw Error("could not parse row \"".concat(row, "\""));
        }
        var _a = match.map(Number), ID = _a[1], ore = _a[2], clay = _a[3], obsidianOre = _a[4], obsidianClay = _a[5], geodeOre = _a[6], geodeObsidian = _a[7];
        return {
            ID: ID,
            ore: { ore: ore },
            clay: { ore: clay },
            obsidian: {
                ore: obsidianOre,
                clay: obsidianClay
            },
            geode: {
                ore: geodeOre,
                obsidian: geodeObsidian
            }
        };
    });
};
var canBuyGeodeFn = function (blueprint, resources) { return function () {
    return resources.ore >= blueprint.geode.ore &&
        resources.obsidian >= blueprint.geode.obsidian;
}; };
var addRobotFactory = function (robotFactories, robotFactoryName) {
    var _a;
    return __assign(__assign({}, robotFactories), (_a = {}, _a[robotFactoryName] = robotFactories[robotFactoryName] + 1, _a));
};
var payForRobotFactory = function (resources, price) {
    var newResources = __assign({}, resources);
    for (var _i = 0, _a = Object.entries(price); _i < _a.length; _i++) {
        var _b = _a[_i], k = _b[0], v = _b[1];
        if (newResources[k] < v) {
            throw Error("can not pay for this, it requires ".concat(v, " of ").concat(k, ", and there is only ").concat(newResources[k], " "));
        }
        newResources[k] -= v;
    }
    return newResources;
};
var buyRobotFactory = function (blueprint, resources, robotFactories, robotFactoryName) { return ({
    newResources: payForRobotFactory(resources, blueprint[robotFactoryName]),
    newRobotFactories: addRobotFactory(robotFactories, robotFactoryName)
}); };
var canBuyObsidianFn = function (blueprint, resources) { return function () {
    return resources.ore >= blueprint.obsidian.ore &&
        resources.clay >= blueprint.obsidian.clay;
}; };
var canBuyClayFn = function (blueprint, resources) { return function () {
    return resources.ore >= blueprint.clay.ore;
}; };
var canBuyOreFn = function (blueprint, resources) { return function () {
    return resources.ore >= blueprint.ore.ore;
}; };
// type CacheKey = `${number}:${number}-${number}-${number}-${number}`;
var earnResources = function (resources, robotFactories) { return ({
    ore: resources.ore + robotFactories.ore,
    clay: resources.clay + robotFactories.clay,
    obsidian: resources.obsidian + robotFactories.obsidian,
    geode: resources.geode + robotFactories.geode
}); };
var suggestedPath = [
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
var suggestedPathP2 = [
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
var a = ["ore", "clay", "obsidian", "geode"];
var day19 = function (input, totalMinutes) {
    if (totalMinutes === void 0) { totalMinutes = 24; }
    var blueprints = parseInput(input);
    var totalIterations = 0;
    var savedByCache = 0;
    var getCacheKey = function (blueprint, minutes, _a, robotFactories) {
        var ore = _a.ore, clay = _a.clay, obsidian = _a.obsidian, geode = _a.geode;
        return "".concat(minutes, ":::").concat(ore, "-").concat(clay, "-").concat(obsidian, "-").concat(geode, "|||").concat(robotFactories.ore, "-").concat(robotFactories.clay, "-").concat(robotFactories.obsidian, "-").concat(robotFactories.geode);
        // `${minutes}:::${ore}-${clay}-${obsidian}-${geode}|||${robotFactories.ore}-${robotFactories.clay}-${robotFactories.obsidian}-${robotFactories.geode}` as CacheKey;
        // `${minutes}:${ore}-${clay}-${obsidian}-${robotFactories.ore}-${robotFactories.clay}-${robotFactories.obsidian}-` as CacheKey;
        // `${minutes}:${ore}-${clay}-${obsidian}-${robotFactories.ore}` as CacheKey;
        var clayOre = blueprint.clay.ore;
        var obsidialOre = clayOre * blueprint.obsidian.clay + blueprint.obsidian.ore;
        return "".concat(ore, "-").concat(clay, "-").concat(obsidian, "-").concat(minutes *
            (robotFactories.ore +
                clayOre * robotFactories.clay +
                obsidialOre * robotFactories.obsidian));
    };
    var runBlueprint = function (blueprint, _a, cache) {
        var _b;
        var resources = _a.resources, robotFactories = _a.robotFactories, minutes = _a.minutes;
        totalIterations++;
        if (totalIterations % 1000000 === 0) {
            console.log("".concat(totalIterations / 1000000, "mil"));
        }
        var cacheKey = getCacheKey(blueprint, minutes, resources, robotFactories);
        // if (minutes === 22) {
        //   console.log("ore on 22", resources.ore, cacheKey);
        // }
        // const indent = new Array(totalMinutes - minutes).fill(".").join("");
        if (cache[cacheKey] !== undefined) {
            savedByCache++;
            return cache[cacheKey];
        }
        // console.log(`Minute ${totalMinutes - minutes + 1}`, cacheKey);
        var canBuyClay = canBuyClayFn(blueprint, resources);
        var canBuyOre = canBuyOreFn(blueprint, resources);
        var canBuyObsidian = canBuyObsidianFn(blueprint, resources);
        var canBuyGeode = canBuyGeodeFn(blueprint, resources);
        var justRunNext = function (_a) {
            var _b = _a === void 0 ? {
                newRobotFactories: __assign({}, robotFactories),
                newResources: __assign({}, resources)
            } : _a, newResources = _b.newResources, newRobotFactories = _b.newRobotFactories;
            newResources = earnResources(newResources, robotFactories);
            return runBlueprint(blueprint, {
                resources: newResources,
                robotFactories: newRobotFactories,
                minutes: minutes - 1
            }, cache);
        };
        var buyAndRun = function (robotFactoryName) {
            var res = justRunNext(buyRobotFactory(blueprint, resources, robotFactories, robotFactoryName));
            return res;
        };
        var runSuggestedPath = function (suggestedPath) {
            var name = suggestedPath[totalMinutes - minutes];
            if (name === undefined) {
                console.log("  just running");
                return justRunNext();
            }
            else {
                console.log("  buying", name);
                return buyAndRun(name);
            }
        };
        if (minutes <= 1) {
            var newResources = earnResources(resources, robotFactories);
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
        var result = Math.max(
        // canBuyObsidian() ? buyAndRun("obsidian") : 0,
        canBuyClay() ? buyAndRun("clay") : 0, canBuyOre() ? buyAndRun("ore") : 0, justRunNext());
        cache[cacheKey] = Math.max((_b = cache[cacheKey]) !== null && _b !== void 0 ? _b : 0, result);
        return result;
    };
    var newAllResources = function () { return ({
        resources: {
            ore: 0,
            clay: 0,
            obsidian: 0,
            geode: 0
        },
        robotFactories: {
            ore: 1,
            clay: 0,
            obsidian: 0,
            geode: 0
        },
        minutes: totalMinutes
    }); };
    // console.log("blueprints.length", blueprints.length);
    // console.log("workerData.start", workerData.start * 6, workerData.start * 6 + 6);
    var blueprintResults = blueprints
        // .slice(workerData.start * 6, workerData.start * 6 + 6)
        .slice(0, 3)
        // .slice(2, 3)
        // .slice(15, 16)
        .map(function (blueprint) {
        var cache = {};
        totalIterations = 0;
        savedByCache = 0;
        // console.log(blueprint.ID, input.split("\n")[blueprint.ID - 1]);
        // const result =
        //   blueprint.ID * runBlueprint(blueprint, newAllResources(), cache);
        var result = runBlueprint(blueprint, newAllResources(), cache);
        console.log("total iterations", blueprint.ID, totalIterations.toLocaleString());
        console.log("result", blueprint.ID, result);
        console.log("saved by cache", savedByCache.toLocaleString());
        console.log("".concat(((100 * savedByCache) / totalIterations).toFixed(2), "%"));
        return result;
    });
    console.log(JSON.stringify(blueprintResults));
    return blueprintResults.reduce(function (a, b) { return a * b; }, 1);
};
// console.log("small", day19(smallRawInput, 24));
// console.log("small", day19(smallRawInput, 32));
console.log("big", day19(day19input_1.day19input, 32));
// const big = day19(day19input);
// console.log("big", big);
// parentPort?.postMessage(big);
// 862 too low; 1095 – too high;
// 55,075,110; 180,094,550
// [2,2,0,32,5,66,0,16,0,10, 11, 84, 0, 0, 0, 32, 34, 126, 38, 120, 105, 22, 23, 24, 0,0,0,28,58,150]

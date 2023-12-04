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
var day16input_1 = require("./day16input");
var smallRawInput = "Valve AA has flow rate=0; tunnels lead to valves DD, II, BB\nValve BB has flow rate=13; tunnels lead to valves CC, AA\nValve CC has flow rate=2; tunnels lead to valves DD, BB\nValve DD has flow rate=20; tunnels lead to valves CC, AA, EE\nValve EE has flow rate=3; tunnels lead to valves FF, DD\nValve FF has flow rate=0; tunnels lead to valves EE, GG\nValve GG has flow rate=0; tunnels lead to valves FF, HH\nValve HH has flow rate=22; tunnel leads to valve GG\nValve II has flow rate=0; tunnels lead to valves AA, JJ\nValve JJ has flow rate=21; tunnel leads to valve II";
var parseRow = function (row) {
    var match = row.match(/Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ((?:[A-Z]+(?:, )?)+)$/);
    if (!match) {
        throw Error("could not parse row \"".concat(row, "\""));
    }
    var valve = match[1], flowRateStr = match[2], tunnelsToStr = match[3];
    var flowRate = Number(flowRateStr);
    var tunnelsTo = tunnelsToStr.split(", ");
    return {
        name: valve,
        flowRate: flowRate,
        tunnelsTo: tunnelsTo
    };
};
var parseRawInput = function (rawInput) {
    var rows = rawInput.split("\n");
    return rows.reduce(function (acc, row) {
        var _a;
        var valve = parseRow(row);
        return __assign(__assign({}, acc), (_a = {}, _a[valve.name] = valve, _a));
    }, {});
};
var valvesPathes = function (valvesNetwork) {
    var pathes = {};
    var allValves = Object.keys(valvesNetwork);
    for (var _i = 0, allValves_1 = allValves; _i < allValves_1.length; _i++) {
        var valveName = allValves_1[_i];
        pathes[valveName] = {};
        for (var _a = 0, allValves_2 = allValves; _a < allValves_2.length; _a++) {
            var v = allValves_2[_a];
            if (valveName === v) {
                continue;
            }
            pathes[valveName][v] = Number.MAX_SAFE_INTEGER;
        }
        for (var _b = 0, _c = valvesNetwork[valveName].tunnelsTo; _b < _c.length; _b++) {
            var v = _c[_b];
            pathes[valveName][v] = 1;
        }
    }
    var minDistance = function (dist, sptSet) {
        // Initialize min value
        var min = Number.MAX_SAFE_INTEGER;
        var minIndex = -1;
        for (var v = 0; v < allValves.length; v++) {
            if (sptSet[allValves[v]] == false && dist[allValves[v]] <= min) {
                min = dist[allValves[v]];
                minIndex = v;
            }
        }
        return minIndex;
    };
    var dijkstra = function (from) {
        var sptSet = allValves.reduce(function (acc, valve) {
            var _a;
            return (__assign(__assign({}, acc), (_a = {}, _a[valve] = false, _a)));
        }, {});
        var dist = allValves.reduce(function (acc, valve) {
            var _a;
            return (__assign(__assign({}, acc), (_a = {}, _a[valve] = Number.MAX_SAFE_INTEGER, _a)));
        }, {});
        dist[from] = 0;
        for (var count = 0; count < allValves.length - 1; count++) {
            var u = minDistance(dist, sptSet);
            sptSet[allValves[u]] = true;
            for (var v = 0; v < allValves.length; v++) {
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
    for (var i = 0; i < allValves.length; i++) {
        pathes[allValves[i]] = dijkstra(allValves[i]);
    }
    return pathes;
};
var day16 = function (input) {
    var valvesNetwork = parseRawInput(input);
    var n = Object.keys(valvesNetwork).length;
    var pathes = valvesPathes(valvesNetwork);
    var allValves = Object.keys(valvesNetwork);
    var totalIterations = 0;
    var findMax = function (currentValveName, minutes, opened, elephant) {
        var _a;
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
        var possibleValves = allValves.filter(function (possibleTargetValveName) {
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
            var val_1 = opened[currentValveName]
                ? 0
                : valvesNetwork[currentValveName].flowRate * (minutes - 1);
            return val_1;
        }
        var max = 0;
        for (var i = 0; i < possibleValves.length; i++) {
            var possibleValveTarget = possibleValves[i];
            var minutesLeftWhenReach = minutes - pathes[currentValveName][possibleValveTarget] - 1;
            var val_2 = 0;
            if (1 /*valve.flowRate*/) {
                // minutesLeftWhenReach--;
                var nextOpened = __assign(__assign({}, opened), (_a = {}, _a[possibleValveTarget] = true, _a));
                val_2 =
                    valvesNetwork[possibleValveTarget].flowRate * minutesLeftWhenReach +
                        Math.max(findMax(possibleValveTarget, minutesLeftWhenReach, nextOpened, elephant), elephant ? findMax("AA", 26, nextOpened, false) : 0);
                // (minutesLeftWhenReach > 1
                // );
                // } else {
                //   // just go
                //   val = Math.max(
                //     findMax(possibleValveTarget, minutesLeftWhenReach, opened, elephant),
                //     elephant ? findMax("AA", 26, opened, false) : 0
                //   );
            }
            if (val_2 > max) {
                max = val_2;
            }
        }
        return max;
    };
    var val = findMax("AA", 26, {}, true);
    console.log(totalIterations);
    return val;
};
console.log("small", day16(smallRawInput));
console.log("real", day16(day16input_1.day16input));
// 1739 too low
// p2 2301 too low

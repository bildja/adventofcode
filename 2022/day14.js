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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var day14input_1 = require("./day14input");
var smallInput = "498,4 -> 498,6 -> 496,6\n503,4 -> 502,4 -> 502,9 -> 494,9";
var parseInput = function (input) {
    var rockPaths = [];
    var pathes = input.split("\n").map(function (row) {
        return row
            .split(" -> ")
            .map(function (coord) { return coord.split(","); })
            .map(function (_a) {
            var x = _a[0], y = _a[1];
            return ({ x: Number(x), y: Number(y) });
        });
    });
    console.log("pathes", JSON.stringify(pathes));
    // const
    for (var i = 0; i < pathes.length; i++) {
        for (var j = 0; j < pathes[i].length - 1; j++) {
            var point = pathes[i][j];
            var nextPoint = pathes[i][j + 1];
            rockPaths.push([point, nextPoint]);
        }
    }
    return rockPaths;
};
var allCoords = function (rockPaths, coord) {
    return rockPaths.flatMap(function (rockPath) { return rockPath.map(function (rock) { return rock[coord]; }); });
};
var allXs = function (rockPaths) { return allCoords(rockPaths, "x"); };
var allYs = function (rockPaths) { return allCoords(rockPaths, "y"); };
var findMinX = function (rockPaths) {
    return Math.min.apply(Math, allXs(rockPaths));
};
var findMaxX = function (rockPaths) {
    return Math.max.apply(Math, allXs(rockPaths));
};
var findMaxY = function (rockPaths) {
    return Math.max.apply(Math, allYs(rockPaths));
};
var strCoord = function (x, y) { return "".concat(x, ",").concat(y); };
var fillSpaceMap = function (rockPaths) {
    var spaceMap = {};
    for (var i = 0; i < rockPaths.length; i++) {
        var _a = rockPaths[i], start = _a[0], end = _a[1];
        if (start.x === end.x) {
            for (var y = Math.min(start.y, end.y); y <= Math.max(start.y, end.y); y++) {
                spaceMap[strCoord(start.x, y)] = "rock";
            }
        }
        else {
            for (var x = Math.min(start.x, end.x); x <= Math.max(start.x, end.x); x++) {
                spaceMap[strCoord(x, start.y)] = "rock";
            }
        }
    }
    return spaceMap;
};
var drawMap = function (spaceMap, _a) {
    var _b;
    var 
    // minX,
    // maxX,
    minY = _a.minY, maxY = _a.maxY, startX = _a.startX;
    var xs = Object.keys(spaceMap).map(function (key) { return Number(key.split(",")[0]); });
    var minX = Math.min.apply(Math, xs) - 1;
    var maxX = Math.max.apply(Math, xs) + 1;
    var floorY = maxY + 2;
    var matrixMap = new Array(floorY - minY + 1)
        .fill(undefined)
        .map(function () { return new Array(maxX - minX + 1).map(function () { return "air"; }); });
    for (var i = minY; i <= floorY; i++) {
        for (var j = minX; j <= maxX; j++) {
            matrixMap[i - minY][j - minX] = (_b = spaceMap[strCoord(j, i)]) !== null && _b !== void 0 ? _b : "air";
        }
    }
    for (var x = minX; x <= maxX; x++) {
        matrixMap[matrixMap.length - 1][x - minX] = "floor";
    }
    var characters = {
        air: "🫧",
        rock: "🪨",
        sand: "💦",
        floor: "🪨"
    };
    //   const characters: Record<PointContent, string> = {
    //     air: ".",
    //     rock: "#",
    //     sand: "o",
    //     floor: "#",
    //     // X: "❌",
    //   };
    var matrixToRender = matrixMap.map(function (row) {
        return row.map(function (pointContent) { return characters[pointContent]; });
    });
    matrixToRender[0][startX - minX] = "💧";
    //   matrixToRender[0][startX - minX] = "+";
    console.clear();
    console.log("%c".concat(matrixToRender.map(function (row) { return row.join(""); }).join("\n")), "font-family: monospace;");
};
var delay = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
var day14 = function (input) { return __awaiter(void 0, void 0, void 0, function () {
    var rockPaths, spaceMap, getPoint, minX, maxX, minY, maxY, floorY, startX, startY, drawThisMap, putNextSand, sands;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rockPaths = parseInput(input);
                spaceMap = fillSpaceMap(rockPaths);
                getPoint = function (_a) {
                    var _b;
                    var x = _a.x, y = _a.y;
                    return (_b = spaceMap[strCoord(x, y)]) !== null && _b !== void 0 ? _b : "air";
                };
                minX = findMinX(rockPaths);
                maxX = findMaxX(rockPaths);
                minY = 0;
                maxY = findMaxY(rockPaths);
                floorY = maxY + 2;
                startX = 500;
                startY = 0;
                drawThisMap = function () {
                    return drawMap(spaceMap, {
                        //   minX,
                        //   maxX,
                        minY: minY,
                        maxY: maxY,
                        startX: startX
                    });
                };
                putNextSand = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var sandPosition, nextPosition;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                sandPosition = { x: startX, y: startY };
                                if (getPoint(sandPosition) !== "air") {
                                    return [2 /*return*/, false];
                                }
                                _b.label = 1;
                            case 1:
                                if (!(sandPosition.y < floorY - 1)) return [3 /*break*/, 3];
                                // console.log(sandPosition.y, maxY);
                                return [4 /*yield*/, delay(40)];
                            case 2:
                                // console.log(sandPosition.y, maxY);
                                _b.sent();
                                drawMap(__assign(__assign({}, spaceMap), (_a = {}, _a[strCoord(sandPosition.x, sandPosition.y)] = "sand", _a)), { minY: minY, maxY: maxY, startX: startX });
                                nextPosition = { x: sandPosition.x, y: sandPosition.y + 1 };
                                if (getPoint(nextPosition) === "air") {
                                    sandPosition = nextPosition;
                                    return [3 /*break*/, 1];
                                }
                                if (getPoint({ x: nextPosition.x - 1, y: nextPosition.y }) === "air") {
                                    sandPosition = { x: nextPosition.x - 1, y: nextPosition.y };
                                    return [3 /*break*/, 1];
                                }
                                if (getPoint({ x: nextPosition.x + 1, y: nextPosition.y }) === "air") {
                                    sandPosition = { x: nextPosition.x + 1, y: nextPosition.y };
                                    return [3 /*break*/, 1];
                                }
                                //   console.log("falling to", strCoord(sandPosition.x, sandPosition.y));
                                spaceMap[strCoord(sandPosition.x, sandPosition.y)] = "sand";
                                return [2 /*return*/, true];
                            case 3:
                                spaceMap[strCoord(sandPosition.x, sandPosition.y)] = "sand";
                                return [2 /*return*/, true];
                        }
                    });
                }); };
                sands = 0;
                _a.label = 1;
            case 1: return [4 /*yield*/, putNextSand()];
            case 2:
                if (!_a.sent()) return [3 /*break*/, 3];
                sands++;
                return [3 /*break*/, 1];
            case 3:
                //   console.log(JSON.stringify(spaceMap));
                //   const sands = Object.values(spaceMap).filter(
                //     (value) => value === "sand"
                //   ).length;
                console.log("sands", sands);
                return [2 /*return*/, sands];
        }
    });
}); };
console.log("small", day14(smallInput));
console.log("real", day14(day14input_1.day14input));

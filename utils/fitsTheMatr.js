"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fitsTheMatr = void 0;
var fitsTheMatr = function (_a, map) {
    var i = _a[0], j = _a[1];
    return i >= 0 && j >= 0 && i < map.length && j < map[i].length;
};
exports.fitsTheMatr = fitsTheMatr;

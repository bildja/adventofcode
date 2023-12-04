"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const day4input_1 = require("./day4input");
const smallRawInput = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;
const getRange = (rangeStr) => {
    const [startStr, endStr] = rangeStr.split("-");
    const start = Number(startStr);
    const end = Number(endStr);
    const range = [];
    for (let i = start; i <= end; i++) {
        range.push(i);
    }
    return range;
};
const rangeContainsRange = (first, second) => {
    return (first[0] <= second[0] &&
        first[first.length - 1] >= second[second.length - 1]);
};
const overlap = (first, second) => {
    return (rangeContainsRange(first, second) ||
        rangeContainsRange(second, first) ||
        (first[0] <= second[0] && first[first.length - 1] >= second[0]) ||
        (first[0] <= second[second.length - 1] &&
            first[first.length - 1] >= second[second.length - 1]));
};
const parseRawInput = (rawInput) => {
    const rows = rawInput.split("\n");
    const pairs = [];
    for (let i = 0; i < rows.length; i++) {
        const [first, second] = rows[i].split(",");
        const firstRange = getRange(first);
        const secondRange = getRange(second);
        pairs.push([firstRange, secondRange]);
    }
    return pairs;
};
const rangeToStr = (range) => {
    return `${range[0]}-${range[range.length - 1]}`;
};
const day4 = (rawInput) => {
    const pairRanges = parseRawInput(rawInput);
    let total = 0;
    for (let i = 0; i < pairRanges.length; i++) {
        const [firstRange, secondRange] = pairRanges[i];
        if (overlap(firstRange, secondRange)) {
            total++;
        }
    }
    return total;
};
console.log(day4(smallRawInput));
console.log(day4(day4input_1.day4input));

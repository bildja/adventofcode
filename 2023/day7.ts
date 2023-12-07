import { day7input } from "./day7input";

const smallRawInput = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

type HandData = {
  hand: string;
  bid: number;
};

const parse = (rawInput: string): HandData[] =>
  rawInput.split("\n").map((line) => {
    const [hand, bidStr] = line.split(" ");
    return { hand, bid: Number(bidStr) };
  });

const getCombination = (hand: string): number => {
  const counts: Record<string, number> = {};
  for (let i = 0; i < hand.length; i++) {
    counts[hand[i]] ??= 0;
    counts[hand[i]]++;
  }
  const countsList = Object.values(counts).sort((a, b) => b - a);
  const maxRepeats = countsList.shift();
  if (!maxRepeats) {
    throw Error("no max repeats");
  }
  switch (maxRepeats) {
    case 5:
    case 4: {
      return maxRepeats + 2;
    }
    case 3: {
      const secondMaxRepeats = countsList.shift();
      if (!secondMaxRepeats) {
        throw Error("no second max repeats");
      }
      if (secondMaxRepeats === 2) {
        return 5;
      }
      return 4;
    }
    case 2: {
      const secondMaxRepeats = countsList.shift();
      if (!secondMaxRepeats) {
        throw Error("no second max repeats");
      }
      if (secondMaxRepeats === 2) {
        return 3;
      }
      return 2;
    }
    case 1: {
      return 1;
    }
    default:
      throw Error("whaat");
  }
};

type Card =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "T"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2";

const getCardVal = (val: string): number => {
  const cardLetters = ["T", "J", "Q", "K", "A"];
  if (cardLetters.includes(val)) {
    return cardLetters.indexOf(val) + 10;
  }
  return Number(val);
};

const compareHands = (hand1: string, hand2: string): number => {
  const combination1 = getCombination(hand1);
  const combination2 = getCombination(hand2);
  if (combination1 !== combination2) {
    return combination1 - combination2;
  }

  for (let i = 0; i < hand1.length; i++) {
    if (hand1[i] !== hand2[i]) {
      return getCardVal(hand1[i]) - getCardVal(hand2[i]);
    }
  }
  throw Error("the cards should not be equal");
};

const getCardValP2 = (hand: string): number => 1;

const getCombinationP2 = (hand: string) => {
  if (!hand.includes("J")) {
    return getCombination(hand);
  }
  ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
};

const compareHandsP2 = (hand1: string, hand2: string): number => {
  const combination1 = getCombination(hand1);
  const combination2 = getCombination(hand2);
  if (combination1 !== combination2) {
    return combination1 - combination2;
  }

  for (let i = 0; i < hand1.length; i++) {
    if (hand1[i] !== hand2[i]) {
      return getCardValP2(hand1[i]) - getCardValP2(hand2[i]);
    }
  }
  throw Error("the cards should not be equal");
};

const day7p1 = (rawInput: string) =>
  parse(rawInput)
    .sort(({ hand: hand1 }, { hand: hand2 }) => compareHands(hand1, hand2))
    .map(({ bid }, i) => bid * (i + 1))
    .reduce((a, b) => a + b, 0);

const day7p2 = (rawInput: string) => {
  const handsData = parse(rawInput);
  console.log(
    handsData.reduce((set, { hand }) => {
      set.add((hand.match(/J/g) ?? []).length);
      return set;
    }, new Set<number>())
  );
};

// console.log(day7p1(smallRawInput));
// console.log(day7p1(day7input));

console.log(day7p2(smallRawInput));
console.log(day7p2(day7input));

import { day4input } from "./day4input";

const smallRawInput = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

type Card = {
  id: number;
  winningNumbers: number[];
  numbersWeHave: number[];
};

const parseCards = (rawInput: string): Card[] => {
  const cardRe = /^Card\s+(\d+):\s+/;
  return rawInput.split("\n").map((line) => {
    const cardIdMatch = line.match(cardRe);
    if (!cardIdMatch) {
      throw Error("error parsing card number");
    }
    const id = Number(cardIdMatch[1]);

    const [winningNumbers, numbersWeHave] = line
      .replace(cardRe, "")
      .split(" | ")
      .map((numbersStr) => numbersStr.trim().split(/\s+/).map(Number));
    return { id, winningNumbers, numbersWeHave };
  });
};

const union = <T>(arr1: T[], arr2: T[]): T[] => {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  const resultSet = new Set<T>();
  for (const el of set1) {
    if (set2.has(el)) {
      resultSet.add(el);
    }
  }
  for (const el of set2) {
    if (set1.has(el)) {
      resultSet.add(el);
    }
  }
  return Array.from(resultSet);
};

const cardPoints = (card: Card) => {
  const commonNumbers = union(card.winningNumbers, card.numbersWeHave).length;
  if (!commonNumbers) {
    return 0;
  }
  return 2 ** (commonNumbers - 1);
};

const day4p1 = (rawInput: string) => {
  return parseCards(rawInput).reduce((acc, card) => acc + cardPoints(card), 0);
};

const day4p2 = (rawInput: string) => {
  const cards = parseCards(rawInput);
  const cardsNumbers: number[] = new Array(cards.length + 1).fill(1);
  cardsNumbers[cardsNumbers.length - 1] = 0;
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const commonNumbers = union(card.winningNumbers, card.numbersWeHave).length;
    for (let j = i + 1; j < i + 1 + commonNumbers; j++) {
      cardsNumbers[j] += cardsNumbers[i];
    }
  }
  return cardsNumbers.reduce((acc, numb) => acc + numb, 0);
};

console.log(day4p2(smallRawInput));
console.log(day4p2(day4input));

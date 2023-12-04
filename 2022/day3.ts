import { inputDay3 } from "./day3input";

const rawSmallInput = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

const getSameLetters = (first: string, second: string): string[] => {
  const sameLettersSet = new Set<string>();
  const firstSet = new Set(first);
  const secondSet = new Set(second);
  firstSet.forEach((char) => {
    if (secondSet.has(char)) {
      sameLettersSet.add(char);
    }
  });
  secondSet.forEach((char) => {
    if (firstSet.has(char)) {
      sameLettersSet.add(char);
    }
  });
  return Array.from(sameLettersSet);
};

const getLetterPriority = (letter: string): number => {
  const lowercaseStart = "a".charCodeAt(0);
  const lowercaseEnd = "z".charCodeAt(0);

  const upperStart = "A".charCodeAt(0);
  // const upperEnd ='Z'.charCodeAt(0);
  const letterCharCode = letter.charCodeAt(0);
  if (letterCharCode >= lowercaseStart && letterCharCode <= lowercaseEnd) {
    return letterCharCode - lowercaseStart + 1;
  }
  return letterCharCode - upperStart + 27;
};

const day3 = (rawInput: string) => {
  const racksacks = rawInput.split("\n");
  let totalPriority = 0;
  for (let i = 0; i < racksacks.length; i++) {
    const racksack = racksacks[i];
    const racksackSize = racksack.length;
    const [firstCompartment, secondCompartment] = [
      racksack.slice(0, racksackSize / 2),
      racksack.slice(racksackSize / 2),
    ];

    const sameLetters = getSameLetters(firstCompartment, secondCompartment);
    for (let j = 0; j < sameLetters.length; j++) {
      const letter = sameLetters[j];
      const priority = getLetterPriority(letter);
      totalPriority += priority;
    }
  }

  return totalPriority;
};

type Group = [string, string, string];

const getGroups = (rucksacks: string[]): Group[] => {
  const groups: Group[] = [];
  for (let i = 0; i < rucksacks.length; i += 3) {
    groups.push([rucksacks[i], rucksacks[i + 1], rucksacks[i + 2]]);
  }
  return groups;
};

const getBadge = (group: Group): string => {
  const [first, second, third] = group;
  const firstSet = new Set(first);
  const secondSet = new Set(second);
  const thirdSet = new Set(third);
  for (let i = 0; i < first.length; i++) {
    const char = first[i];
    if (firstSet.has(char) && secondSet.has(char) && thirdSet.has(char)) {
      return char;
    }
  }
  throw Error(`no badge for the group ${JSON.stringify(group, null, 2)}`);
};

const day3p2 = (rawInput: string) => {
  const rucksacks = rawInput.split("\n");
  let totalPriority = 0;
  const groups = getGroups(rucksacks);
//   console.log("groups", groups);
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const badge = getBadge(group);
    // console.log("group ", i);
    // console.log("badge", badge);
    totalPriority += getLetterPriority(badge);
  }
  return totalPriority;
};

console.log(day3p2(rawSmallInput));
console.log(day3p2(inputDay3));

import { day12input } from "./day12input";

const smallRawInput = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

type Line = {
  row: string;
  groups: number[];
};

const parse = (rawInput: string): Line[] =>
  rawInput.split("\n").map((line) => {
    const [row, groupsStr] = line.split(" ");
    return { row, groups: groupsStr.split(",").map(Number) };
  });

const isCorrectRow = (row: string, groups: number[]) => {
  const chunks = row.replaceAll(".", " ").trim().split(/\s+/);
  if (chunks.length !== groups.length) {
    return false;
  }
  for (let i = 0; i < chunks.length; i++) {
    if (chunks[i].length !== groups[i]) {
      return false;
    }
  }
  return true;
};

const bruteForceLine = ({ row, groups }: Line) => {
  const rowA = Array.from(row);
  const questionIndexes = rowA.reduce(
    (acc, ch, i) => (ch === "?" ? [...acc, i] : acc),
    [] as number[]
  );
  const memVar = (
    fn: (questionIndex: number) => string[]
  ): ((questionIndex: number) => string[]) => {
    const mem: (string[] | undefined)[] = new Array(
      questionIndexes.length
    ).fill(undefined);
    return (questionIndex) => {
      const cached = mem[questionIndex];
      if (cached) {
        return cached;
      }

      const res = fn(questionIndex);
      mem[questionIndex] = res;
      return res;
    };
  };
  const getVariants = memVar((questionIndex): string[] => {
    if (questionIndex === questionIndexes.length - 1) {
      const restOfString = row.slice(questionIndexes[questionIndex] + 1);
      return [`.${restOfString}`, `#${restOfString}`];
    }
    return getVariants(questionIndex + 1).reduce((acc, variant) => {
      const prefix =
        questionIndex === 0 ? row.slice(0, questionIndexes[questionIndex]) : "";
      const substr = row.slice(
        questionIndexes[questionIndex] + 1,
        questionIndexes[questionIndex + 1]
      );

      acc.push(`${prefix}.${substr}${variant}`);
      acc.push(`${prefix}#${substr}${variant}`);
      return acc;
    }, [] as string[]);
  });
  return getVariants(0).filter((row) => isCorrectRow(row, groups));
};

const bruteForceLine2 = ({ row, groups }: Line) => {
  const memVar = (
    fn: (row: string, groups: number[]) => number
  ): ((row: string, groups: number[]) => number) => {
    const mem = new Map<string, number>();
    return (row, groups) => {
      const key = `${row}|${groups.join(",")}`;
      if (mem.has(key)) {
        return mem.get(key)!;
      }

      const res = fn(row, groups);
      mem.set(key, res);
      return res;
    };
  };

  const getCount = memVar((row, groups) => {
    if (!row && !groups.length) {
      return 1;
    }
    if (!row) {
      return 0;
    }
    if (groups.reduce((a, b) => a + b, 0) + groups.length - 1 > row.length) {
      return 0;
    }
    if (row[0] === ".") {
      return getCount(row.slice(1), groups);
    }
    if (row[0] === "#") {
      const [firstGroup, ...restGroups] = groups;
      for (let i = 0; i < firstGroup; i++) {
        if (row[i] === ".") {
          return 0;
        }
      }
      if (row[firstGroup] === "#") {
        return 0;
      }

      if (groups.length === 0 && row.includes("#")) {
        return 0;
      }

      return getCount(row.slice(firstGroup + 1), restGroups);
    }

    return (
      getCount(`.${row.slice(1)}`, groups) +
      getCount(`#${row.slice(1)}`, groups)
    );
  });

  return getCount(row, groups);
};

const day12p1 = (rawInput: string) =>
  parse(rawInput)
    .map(bruteForceLine2)
    .reduce((a, b) => a + b);

const unfold = (rawInput: string): string =>
  rawInput
    .split("\n")
    .map((line) => {
      const [row, groups] = line.split(" ");
      return `${new Array(5).fill(row).join("?")} ${new Array(5)
        .fill(groups)
        .join(",")}`;
    })
    .join("\n");

const day12p2 = (rawInput: string) => day12p1(unfold(rawInput));

// console.log(day12p1(smallRawInput));


// console.log(day12p1(day12input));

console.log("\n====== P2 ======\n");
console.log(day12p2("?#?#?????????????.?. 8,1,1,1,1,1"));
console.log(day12p2("?????#?#??#??. 1,3,2"));
console.log(day12p2("???#???.???#? 2,1,1,2"));
// console.log(day12p2(smallRawInput));
// console.log(day12p2(day12input));

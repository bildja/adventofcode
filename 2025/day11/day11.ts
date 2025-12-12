import { day11input } from "./day11input";

const smallRawInput = `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`;

const parse = (rawInput: string) =>
  Object.fromEntries(
    rawInput.split("\n").map((row) => {
      const from = row.slice(0, 3);
      const to = row.slice(5).split(" ");
      return [from, to];
    }),
  );

const calcFromFn = (routes: Record<string, string[]>) => {
  const calcFrom = (
    from: string,
    target: string,
    cache: Record<string, number> = {},
  ): number => {
    if (from === "out") {
      return 0;
    }
    if (routes[from].includes(target)) {
      return 1;
    }
    if (cache[from] === undefined) {
      cache[from] = routes[from]
        .map((to) => calcFrom(to, target, cache))
        .reduce((a, b) => a + b);
    }
    return cache[from];
  };
  return calcFrom;
};

const day11p1 = (rawInput: string) => {
  const routes = parse(rawInput);
  const calcFrom = calcFromFn(routes);
  return calcFrom("you", "out");
};

console.log(day11p1(smallRawInput));
console.log(day11p1(day11input));

const day11p2 = (rawInput: string) => {
  const routes = parse(rawInput);
  const calcFrom = calcFromFn(routes);

  return (
    // dac -> fft is zero in the input, so just skipping it
    calcFrom("dac", "out") * calcFrom("fft", "dac") * calcFrom("svr", "fft")
  );
};

const smallRawInput2 = `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`;

console.log("p2", day11p2(smallRawInput2));
console.log("p2", day11p2(day11input)); // 520476725037672

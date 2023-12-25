import { day2input } from "./day2input";

const smallRawInput = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

type CubeColor = "blue" | "red" | "green";

type GameSubset = {
  color: CubeColor;
  amount: number;
}[];

type Game = {
  id: number;
  subsets: GameSubset[];
};

const parseGames = (rawInput: string): Game[] => {
  const lines = rawInput.split("\n");
  return lines.map((gameLine) => {
    const gameRegex = /^Game (\d+)\: /;
    const match = gameLine.match(gameRegex);
    if (!match) {
      throw Error("bad line");
    }
    const [, gameIdStr] = match;
    const id = Number(gameIdStr);
    const subsets: GameSubset[] = gameLine
      .replace(gameRegex, "")
      .split("; ")
      .map((subsetLine) =>
        subsetLine.split(", ").map((cubeRaw) => {
          const [cubeNumStr, color] = cubeRaw.split(" ") as [string, CubeColor];
          return {
            color,
            amount: Number(cubeNumStr),
          };
        })
      );
    return {
      id,
      subsets,
    };
  });
};

const maxs: Record<CubeColor, number> = {
  blue: 14,
  red: 12,
  green: 13,
};

const isGamePossible = (game: Game) =>
  game.subsets.every((subset) =>
    subset.every((cube) => maxs[cube.color] >= cube.amount)
  );

const getMaxColor = (game: Game, color: CubeColor) =>
  Math.max(
    ...game.subsets
      .flat()
      .filter(({ color: cubeColor }) => color === cubeColor)
      .map(({ amount }) => amount)
  );

const powerOfGame = (game: Game) =>
  getMaxColor(game, "blue") *
  getMaxColor(game, "green") *
  getMaxColor(game, "red");

const day2p1 = (rawInput: string) =>
  parseGames(rawInput)
    .filter(isGamePossible)
    .reduce((acc, game) => acc + game.id, 0);

const day2p2 = (rawInput: string) =>
  parseGames(rawInput)
    .map(powerOfGame)
    .reduce((a, b) => a + b, 0);

console.log(day2p1(smallRawInput));
console.log(day2p2(smallRawInput));
console.log(day2p2(day2input));

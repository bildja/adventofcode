import { day10input } from "./day10input";

const smallRawInput = `noop
addx 3
addx -5`;

const largerRawInput = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

const WIDTH = 40;
const HEIGHT = 6;

const day10 = async (rawInput: string) => {
  let x = 1;
  let cycle = 1;
  const rows = rawInput.split("\n");
  let signalStrengthSum = 0;

  const screen = new Array(HEIGHT)
    .fill(undefined)
    .map(() => new Array(WIDTH).fill("X"));

  const addSignalStrength = () => {
    const shouldAddSignalStrength = cycle === 20 || (cycle - 20) % 40 === 0;
    if (!shouldAddSignalStrength) {
      return;
    }
    console.log(cycle, x * cycle);
    signalStrengthSum += x * cycle;
  };
  const drawPixel = () => {
    // console.log("cycle", cycle);
    const i = Math.floor((cycle - 1) / WIDTH);
    const j = (cycle - 1) % WIDTH;
    if (j >= WIDTH || i >= HEIGHT) {
      console.warn("warn", i, j);
      return;
    }
    // console.log(i, j);
    const lit = Math.abs(x - j) <= 1;
    const letterNumber = Math.floor(j / 5);
    const litChars = ["♥️", "❤️", "💙", "💚", "🧡", "🤎", "🤍", "💛"];

    // screen[i][j] = lit ? litChars[letterNumber] : " ";
    // screen[i][j] = lit ? litChars[0] : " ";
    screen[i][j] = lit ? litChars[2 + letterNumber % 2] : " ";
  };

  const drawScreen = async () => {
    console.log("\n\n");
    const delay = async (ms: number) => {
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), ms);
      });
    };

    // const printedScreen = screen.map((row) => row.join(" ")).join("\n");
    // process.stdout.cursorTo(0);
    for (let i = 0; i < screen.length; i++) {
      const row = screen[i];
      for (let j = 0; j < row.length; j++) {
        const char = row[j];
        if (j % 5 === 0) {
          process.stdout.write("  ");
        }
        process.stdout.write(` ${char}`);
        if (char !== " ") {
          await delay(40);
        }
      }
      process.stdout.write("\n");

      //   const carets = new Array(i).fill("\r").join("");
      //   console.log(`${carets}${printedScreen.slice(0, i)}`);
    }
  };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const [command, commandArg] = row.split(" ");
    drawPixel();
    switch (command) {
      case "noop": {
        cycle++;
        break;
      }
      case "addx": {
        const number = Number(commandArg);
        cycle++;
        // addSignalStrength();
        drawPixel();
        x += number;
        cycle++;
        break;
      }
      default: {
        throw Error(`no such command "${command}" in row "${row}"`);
      }
    }
    // addSignalStrength();
  }
  await drawScreen();
  return signalStrengthSum;
};

// console.log('small', day10(smallRawInput));
// console.log("larger", day10(largerRawInput));
// console.log("real", day10(day10input));
day10(day10input);

// BJFRHRFU

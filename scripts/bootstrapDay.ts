import "dotenv/config";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import https from "https";

const fetchInput = (
  year: string,
  day: string,
  session: string
): Promise<string> => {
  console.log("trying to fetch input");
  return new Promise<string>((resolve) => {
    https.get(
      `https://adventofcode.com/${year}/day/${day}/input`,
      {
        headers: {
          cookie: `session=${session}`,
        },
      },
      (res) => {
        let data: Uint8Array[] = [];
        res.on("data", (chunk) => {
          data.push(chunk);
        });

        res.on("end", () => {
          resolve(Buffer.concat(data).toString().trim());
        });
      }
    );
  });
};

const bootstrapDay = async (year: string, day: string) => {
  const fileName = path.join(__dirname, "..", year, `day${day}.ts`);
  console.log("bootstraping...", fileName);
  const fileExists = fs.existsSync(fileName);
  if (fileExists) {
    console.error(`File "${fileName}" already exists`);
    return;
  }
  const [dayNTemplate, dayNInputTemplate] = await Promise.all(
    ["dayN.ts.template", "./dayNinput.ts.template"].map((fn) =>
      readFile(path.join(__dirname, fn), { encoding: "utf8" })
    )
  );
  const dayNContent = dayNTemplate.replaceAll("%(dayNumber)", day);
  const input = process.env.SESSION_KEY
    ? await fetchInput(year, day, process.env.SESSION_KEY)
    : "";
  const dayNInputContent = dayNInputTemplate
    .replaceAll("%(dayNumber)", day)
    .replaceAll("%(input)", input);
  const inputFileName = path.join(__dirname, "..", year, `day${day}input.ts`);
  await Promise.all([
    writeFile(fileName, dayNContent),
    writeFile(inputFileName, dayNInputContent, { mode: 0o444 }),
  ]);
  console.log(`tadam! go ahead and solve it in "${fileName}"`);
};

const { argv } = yargs(hideBin(process.argv)).options({
  year: { type: "number", default: new Date().getFullYear() },
  day: { type: "number", default: new Date().getDate() },
});

const run = async () => {
  const { year, day } = await argv;
  console.log(year, day);
  await bootstrapDay(String(year), String(day));
};

run();

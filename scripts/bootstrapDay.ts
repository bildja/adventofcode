import "dotenv/config";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import https from "https";
import * as cheerio from "cheerio";

class AOCDataFetcher {
  constructor(
    private year: string,
    private day: string,
    private session: string,
  ) {
    if (!session) {
      console.warn(
        "there is no session, get it from the cookies on aoc website",
      );
    }
  }

  private doFetch(aocPath: string = ""): Promise<string> {
    const { year, day, session } = this;
    if (!session) {
      console.warn(`not fetching ${aocPath}`);
      return Promise.resolve("");
    }
    console.log(
      "fetchiing",
      `https://adventofcode.com/${year}/day/${day}${aocPath}`,
    );
    return new Promise<string>((resolve) => {
      https.get(
        `https://adventofcode.com/${year}/day/${day}${aocPath}`,
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
        },
      );
    });
  }

  public fetchInput() {
    return this.doFetch("/input");
  }

  public async getSmallInput() {
    const content = await this.doFetch();
    const $ = cheerio.load(content);
    return $("code:first").text().trim();
  }
}

const bootstrapDay = async (year: string, day: string) => {
  const folderPath = path.join(__dirname, "..", year, `day${day}`);
  const folderExists = fs.existsSync(folderPath);
  if (!folderExists) {
    fs.mkdirSync(folderPath);
  }
  const fileName = path.join(folderPath, `day${day}.ts`);
  console.log("bootstraping...", fileName);

  const fileExists = fs.existsSync(fileName);
  if (fileExists) {
    console.error(`File "${fileName}" already exists`);
    return;
  }
  const aocDataFetcher = new AOCDataFetcher(
    year,
    day,
    process.env.SESSION_KEY ?? "",
  );
  const [dayNTemplate, dayNInputTemplate] = await Promise.all(
    ["dayN.ts.template", "./dayNinput.ts.template"].map((fn) =>
      readFile(path.join(__dirname, fn), { encoding: "utf8" }),
    ),
  );
  const smallInput = await aocDataFetcher.getSmallInput();
  const dayNContent = dayNTemplate
    .replaceAll("%(dayNumber)", day)
    .replaceAll("%(smallInput)", smallInput);
  const input = await aocDataFetcher.fetchInput();

  const dayNInputContent = dayNInputTemplate
    .replaceAll("%(dayNumber)", day)
    .replaceAll("%(input)", input);
  const inputFileName = path.join(folderPath, `day${day}input.ts`);
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

import { Worker } from "worker_threads";

const run = () => {
  const spawn = (i: number) => {
    return new Promise<string>((resolve) => {
      const worker = new Worker("./2022/day19.js", {
        workerData: { start: i },
      });
      worker.on("message", (message, ...args) => {
        // console.log("message", message, ...args);
        resolve(message);
      });
    });
  };
  const promises: Promise<string>[] = [];

  for (let i = 0; i < 6; i++) {
    promises.push(spawn(i));
  }
  Promise.all(promises).then((data) => {
    console.log(
      "data",
      data,
      data.reduce((a, b) => a + b)
    );
  });
};

run();

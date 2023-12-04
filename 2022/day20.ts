import { day20input } from "./day20input";

const smallInput = [1, 2, -3, 3, -2, 0, 4];
const DECRYPTION_KEY = 811589153;

const day20 = (input: number[]) => {
  const indexes = new Array(input.length).fill(0).map((a, i) => i);
  
  const mixList = () => {
    for (let i = 0; i < indexes.length; i++) {
      const k = indexes.indexOf(i);
      const val = input[k];

      let nextPosition = (val + k) % (input.length - 1);
      if (nextPosition <= 0) {
        nextPosition += input.length - 1;
      }

      input.splice(k, 1);
      input.splice(nextPosition, 0, val);
      indexes.splice(k, 1);
      indexes.splice(nextPosition, 0, i);
    }
  };
  input = input.map((n) => n * DECRYPTION_KEY);
  for (let i = 0; i < 10; i++) {
    mixList();
  }
  //   console.log(input);
  const getAfterZero = (index: number) =>
    input[(input.indexOf(0) + index) % input.length];
  console.log(getAfterZero(1000), getAfterZero(2000), getAfterZero(3000));
  return [1000, 2000, 3000].map(getAfterZero).reduce((a, b) => a + b, 0);
};

console.log("small", day20(smallInput));
console.log("big", day20(day20input));

// [1, -3, 3, 2, -2, 0, 4]
// [0, 2,  3, 1,  4, 5, 6]
// [0, 3, 2,  1,  4, 5, 6]

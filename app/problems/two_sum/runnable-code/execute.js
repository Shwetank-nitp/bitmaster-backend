let input = "";

##USER_CODE_HERE##

process.stdin.on("data", (chunk) => {
  if (chunk !== null) {
    input += chunk;
  }
});

process.stdin.on("end", () => {
  const inputArr = input.split("\n");
  const size = parseInt(inputArr[0]);
  const k = parseInt(inputArr[1]);
  const arr = [];
  for (let i = 0; i < size; i++) {
    const num = parseInt(inputArr[i + 2]);
    arr.push(num);
  }
  const a = two_sum(arr, k)[0];
  const b = two_sum(arr, k)[1];
  const output = `${a} ${b}`;
  console.log(output);
});
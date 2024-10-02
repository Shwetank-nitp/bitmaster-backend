let input = "";

##USER_CODE_HERE##

process.stdin.on("data", (chunk) => {
  if (chunk !== null) {
    input += chunk;
  }
});

process.stdin.on("end", () => {
  const inputArr = input.split("\n");
  const num1 = parseInt(inputArr[0]);
  const num2 = parseInt(inputArr[1]);
  console.log(sum_to_number(num1, num2));
});
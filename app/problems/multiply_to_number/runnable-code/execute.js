let input = "";

##USER_CODE_HERE##

process.stdin.on("data", (chunk) => {
  if (chunk !== null) {
    input += chunk;
  }
});

process.stdin.on("end", () => {
  const inputArr = input.split("\n");
  const num1 = Number(inputArr[0]);
  const num2 = Number(inputArr[1]);
  console.log(multiply_to_number(num1, num2) === -0 ? 0 : multiply_to_number(num1, num2));
});

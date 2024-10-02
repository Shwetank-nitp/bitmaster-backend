let intput = "";

##USER_CODE_HERE##

process.stdin.on("data", (chunk) => {
  if (chunk !== null) {
    intput += chunk;
  }
});

process.stdin.on("end", () => {
  const inputArr = intput.split("\n");
  const arr = inputArr.slice(1);
  console.log(max_number(arr));
});
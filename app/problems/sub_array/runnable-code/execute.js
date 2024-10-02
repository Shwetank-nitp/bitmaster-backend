const { readFileSync } = require("fs");

##USER_CODE_HERE##

function run() {
  const readRes = readFileSync("../testcases/inputs/##TESTCASE##", "utf8");
  const [k, size] = readRes.split("\n");
  const arr = readRes.split("\n").slice(2).map(Number);
  const output = subArray(arr, Number(k));
  console.log(output.join(" "));
}

run();

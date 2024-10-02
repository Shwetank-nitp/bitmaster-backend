function generateCode(_lang_, md_code) {
  const lines = md_code.split("\n");

  const name = lines
    .find((line) => line.includes("#NAME"))
    .replace("#NAME ", "")
    .trim();
  const args = lines
    .find((line) => line.includes("#ARGS"))
    .replace("#ARGS ", "")
    .trim();
  const returnType = lines
    .find((line) => line.includes("#RETURN"))
    .replace("#RETURN ", "")
    .trim();

  switch (_lang_) {
    case 63:
      const js_args = args
        .split(" ")
        .filter((_, index) => index % 2 !== 0)
        .join(", ");
      return `function ${name}(${js_args}) {
    // write your code here
}`;

    case 71:
      const py_args = args
        .split(" ")
        .map((arg, index) => {
          if (index % 2 === 1) return arg + ",";
          else return arg;
        })
        .join(" ")
        .slice(0, -1);
      return `def ${name}(${py_args}):
    # write your code here`;

    case 54:
      const cpp_args = args
        .split(" ")
        .map((arg, index) => {
          if (index % 2 === 1) return arg + ",";
          else return arg;
        })
        .join(" ")
        .slice(0, -1);
      return `${returnType} ${name}(${cpp_args}) {
    // write your code here
}`;

    default:
      return "Language not supported";
  }
}

module.exports = { generateCode };

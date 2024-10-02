const { read } = require("./promises");
const path = require("path");

async function generateBoilerplate(code, langCode, slug) {
  let str = "";
  switch (langCode) {
    case 54:
      str = await read(
        path.join(".", "app", "problems", slug, "runnable-code", "execute.cpp")
      );
      return str.replace("##USER_CODE_HERE##", code);
    case 63:
      str = await read(
        path.join(".", "app", "problems", slug, "runnable-code", "execute.js")
      );
      return str.replace("##USER_CODE_HERE##", code);
    default:
      return str;
  }
}

module.exports = { generateBoilerplate };

const fs = require("fs");

const read = (path, formate = "utf-8") => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, formate, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

module.exports = { read };

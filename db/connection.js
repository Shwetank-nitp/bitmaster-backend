const mongoose = require("mongoose");

const connection = async () => {
  const res = await mongoose.connect(process.env.MONGO_URL, {
    dbName: "bitmaster",
  });
  return res;
};

module.exports = { connection };

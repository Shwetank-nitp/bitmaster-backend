const { Router } = require("express");
const { read } = require("../utility/promises");
const path = require("path");
const { Language } = require("../model/language");

const router = Router();

router.post("/", async (req, res) => {
  const input = await read(
    path.join(".", "app", "languages", "languages.json")
  );
  const lang_arr = JSON.parse(input);
  const promises = [];
  await Language.deleteMany({});
  lang_arr.forEach((element) => {
    promises.push(Language.create(element));
  });
  await Promise.all(promises)
    .then(() => {
      return res.status(200).json({ message: "Language updated successfully" });
    })
    .catch(() => {
      return res.status(500).json({ message: "Language updated failed" });
    });
});

module.exports = { router };



const { Router } = require("express");
const { read } = require("../utility/promises");
const path = require("path");
const { marked } = require("marked");
const { generateCode } = require("../utility/generate-code");
const { Problem } = require("../model/problem.model");
const { Language } = require("../model/language");

const router = Router();

router.get("/problem/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    try {
      const md_problem = await read(
        path.join(".", "app", "problems", slug, "problem.md")
      );

      const html = marked(md_problem);
      res.status(200).send(html);
    } catch (error) {
      if (error.code === "ENOENT")
        return res.status(404).send("<h1>Not found</h1>");
      else res.status(500).send("<h1>Server Error, try again later</h1>");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing your request.");
  }
});

router.get("/languages", async (req, res) => {
  try {
    const languages = await Language.find();
    res.status(200).json(languages);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing your request.");
  }
});

router.get("/code/:slug", async (req, res) => {
  try {
    const name = req.params.slug;
    const lang = req.query?.lang;
    if (!name || !lang) {
      return res.status(400).send("<h1>Invalid request</h1>");
    }

    const quary = {
      name: String(lang),
    };

    const resp = await Language.findOne(quary);

    if (!resp) {
      return res.status(400).send("<h1>Invalid language specified</h1>");
    }
    const { unique_number: _lang_ } = resp;
    try {
      const md_code = await read(
        path.join(".", "app", "problems", name, "code.md")
      );

      const code = generateCode(_lang_, md_code);
      res.status(200).send(code);
    } catch (error) {
      console.log(error);
      if (error.code === "ENOENT") res.status(404).send("<h1>Not found</h1>");
      else res.status(500).send("<h1>Server Error, try again later</h1>");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing your request.");
  }
});

router.get("/all", async (req, res) => {
  try {
    const skip = req.query.skip;
    const limit = req.query.limit;
    const difficulty = req.query?.difficulty;
    const catagory = req.query?.catagory;
    const query = {};
    if (catagory) {
      query.catagory = catagory;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }
    const problems = await Problem.find(query, {
      _id: 1,
      problem_name: 1,
      difficulty: 1,
      slug: 1,
      catagory: 1,
    })
      .skip(Number(skip))
      .limit(Number(limit));
    res.status(200).send(problems);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing your request.");
  }
});

router.post("/create-problem", async (req, res) => {
  const {
    problem_name,
    problem_discription,
    number_of_tests,
    slug,
    catagory,
    difficulty,
  } = req.body;

  if (
    !problem_name ||
    !problem_discription ||
    !number_of_tests ||
    !slug ||
    !catagory ||
    !difficulty
  ) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  try {
    const newProblem = new Problem({
      problem_name,
      problem_discription,
      number_of_tests,
      slug,
      catagory,
      difficulty,
    });

    await newProblem.save();

    res
      .status(201)
      .json({ message: "Problem created successfully", problem: newProblem });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Problem slug is already taken" });
    }

    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = { router };

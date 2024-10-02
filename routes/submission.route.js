const { Router } = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const { Problem } = require("../model/problem.model");
const { read } = require("../utility/promises");
const path = require("path");
const { readDirPromise } = require("../utility/readDirPromise");
const { default: axios } = require("axios");
const { generateBoilerplate } = require("../utility/generateBoilerplate");
const { Testcase } = require("../model/testcases");
const { Submission } = require("../model/submission");
const { Language } = require("../model/language");

const router = Router();

router.post("/evaluate", authMiddleware, async (req, res) => {
  try {
    const { id: userId } = req?.user;
    const lang = req.body?.lang;
    const code = req.body?.code;
    const slug = req.body?.slug;
    if (!lang || !code || !slug || !userId) {
      res.status(400).send({ message: "code or language is missing in body" });
    }

    const { _id: languageId } = await Language.findOne({ unique_number: lang });

    if (!languageId)
      return res.status(400).send({ message: "Invalid language specified" });

    const { _id: problemId } = await Problem.findOne({ slug });

    const outputDir = await readDirPromise(
      path.join(".", "app", "problems", slug, "testcases", "outputs")
    );
    const inputDir = await readDirPromise(
      path.join(".", "app", "problems", slug, "testcases", "inputs")
    );

    const inputs_all = await Promise.all(
      inputDir.map((inputFileName) =>
        read(
          path.join(
            ".",
            "app",
            "problems",
            slug,
            "testcases",
            "inputs",
            inputFileName
          )
        )
      )
    );

    const expected_outputs = await Promise.all(
      outputDir.map((outputFileName) => {
        const output = read(
          path.join(
            ".",
            "app",
            "problems",
            slug,
            "testcases",
            "outputs",
            outputFileName
          )
        );
        return output;
      })
    );

    const fullCodes = await Promise.all(
      expected_outputs.map(() => generateBoilerplate(code, lang, slug))
    );

    const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
      params: {
        base64_encoded: "false",
      },
      headers: {
        "x-rapidapi-key": "0fbaf53fb6msha8002d421a1da6dp1a3ad8jsn200cd93b576e",
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        submissions: expected_outputs.map((output, index) => ({
          source_code: fullCodes[index],
          language_id: lang,
          stdin: inputs_all[index].trim(),
          expected_output: output.trim(),
          callback_url: `${process.env.URL}/code/callback_testcase`,
          fields: "status,stdout,stderr,expected_output,stdin",
        })),
      },
    };

    const testcases = await Testcase.create({
      user_id: userId,
      problem_id: problemId,
      submission_id: null,
      cases: [],
    });

    const submission = await Submission.create({
      user_id: userId,
      problem_id: problemId,
      testcase_id: testcases._id,
      language_id: languageId,
      user_code: code,
      status: "pending",
    });

    const response = await axios.request(options); // this will be an array of tokens
    response.data.forEach((data) => {
      testcases.cases.push({
        token: data.token,
      });
    });
    testcases.submission_id = submission._id;
    await testcases.save();
    res.status(201).send(submission._id);
  } catch (error) {
    console.log("Error during evaluation:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/poll/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findOne({ _id: id });
    if (!submission) {
      return res.status(400).send({ message: "No submission found" });
    }
    switch (submission.status) {
      case "accepted":
        return res.status(200).send(submission);
      case "rejected":
        return res.status(200).send(submission);
      case "pending":
        return res.status(200).send({ status: "pending" });
    }
  } catch (error) {
    console.log("Error during polling:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/testcases/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const testcase = await Testcase.findOne({ _id: id });
    if (!testcase) {
      return res.status(400).send({ message: "No testcase found" });
    }
    const response = testcase.cases.map((testcase) => ({
      output: testcase.output,
      expected_output: testcase.expected_output,
      status_code: testcase.status_code,
    }));
    res.status(200).send(response);
  } catch (error) {
    console.log("Error during fetching tescases:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/submissions/:slug", authMiddleware, async (req, res) => {
  try {
    const { slug } = req.params;
    const { id: userId } = req.user;
    const problem = await Problem.findOne({ slug });
    if (!problem) {
      return res.status(400).send({ message: "No problem found" });
    }
    const submissions = await Submission.find({
      $and: [{ problem_id: problem._id }, { user_id: userId }],
    });
    if (!submissions) {
      return res.status(400).send({ message: "No submissions found" });
    }
    const promises = submissions.map(async (submission) => {
      const lang = await Language.findById(submission.language_id);
      return {
        _id: submission._id,
        lang: lang.name,
        testcase_id: submission.testcase_id,
        status: submission.status,
        code: submission.user_code,
      };
    });
    const response = await Promise.all(promises);
    res.status(200).send(response);
  } catch (error) {
    console.log("Error during fetching submissions:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.put("/callback_testcase", async (req, res) => {
  try {
    const {
      status: { id: status_code },
      stdout,
      expected_output,
      stderr,
      token,
    } = req.body;
    const testcase = await Testcase.findOne({ "cases.token": token });
    testcase.cases.forEach((testcase) => {
      if (testcase.token === token) {
        testcase.status_code = status_code;
        if (stderr) {
          testcase.output = Buffer.from(stderr || "", "base64").toString(
            "utf-8"
          );
        } else {
          testcase.output = Buffer.from(stdout || "", "base64")
            .toString("utf-8")
            .replace(/\n/g, "");
        }
        testcase.expected_output = Buffer.from(
          expected_output,
          "base64"
        ).toString("utf-8");
      }
    });
    await testcase.save();

    if (
      testcase.cases.filter((testcase) => testcase.status_code !== 2).length ===
      testcase.cases.length
    ) {
      let status;
      if (testcase.cases.find((testcase) => testcase.status_code !== 3)) {
        status = "rejected";
      } else {
        status = "accepted";
      }

      const submission = await Submission.findOneAndUpdate(
        {
          _id: testcase.submission_id,
        },
        { status },
        { new: true }
      );
      if (submission.status === "accepted") {
        return res.status(200).send({ message: "Submission successful" });
      } else if (submission.status === "rejected") {
        return res.status(200).send({ message: "Submission rejected" });
      } else {
        return res.status(200).send({ message: "Submission pending" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server Error Callback_Judge_failed" });
  }
});

module.exports = { router };

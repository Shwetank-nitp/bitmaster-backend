const mongoose = require("mongoose");

const testcaseSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  problem_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  submission_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Submission",
    default: null,
  },
  cases: {
    type: [
      {
        token: String,
        status_code: { type: Number, default: 2 },
        expected_output: { type: String, default: null },
        output: { type: String, default: null },
      },
    ],
    required: true,
  },
});

const Testcase = mongoose.model("Testcase", testcaseSchema);

module.exports = { Testcase };

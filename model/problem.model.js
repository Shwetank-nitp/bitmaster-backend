const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema(
  {
    problem_name: {
      type: String,
      required: true,
    },
    problem_discription: {
      type: String,
      required: true,
    },
    number_of_tests: {
      type: Number,
      required: true,
    },
    slug: {
      type: String,
      unique: [true, "problem slug is already taken"],
      required: true,
    },
    catagory: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard", "bitmaster"],
      required: true,
    },
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", ProblemSchema);

module.exports = { Problem };

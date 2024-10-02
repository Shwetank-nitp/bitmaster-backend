const mongoose = require("mongoose");
const { Schema } = mongoose;

const submissionSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["accepted", "pending", "rejected"],
      required: true,
    },
    language_id: {
      type: Schema.Types.ObjectId,
      ref: "Language",
      required: true,
    },
    user_code: { type: String, required: true },
    testcase_id: { type: Schema.Types.ObjectId, ref: "Testcase" },
    problem_id: { type: Schema.Types.ObjectId, ref: "Problem" },
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = { Submission };

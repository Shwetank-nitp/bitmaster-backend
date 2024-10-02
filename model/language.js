const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true },
  unique_number: { type: Number, unique: true, required: true }, // Unique identifier for the language (Judge0 ID)
});

const Language = mongoose.model("Language", languageSchema);

module.exports = { Language };

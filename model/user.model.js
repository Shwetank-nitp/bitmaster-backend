const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password must be at least 6 characters long"],
    },
  },
  { timestamps: true }
);

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to generate a JWT token for the user
userSchema.methods.generateToken = function () {
  const data = {
    id: this._id,
  };
  const token = jwt.sign(data, process.env.SECRET, { algorithm: "HS256" }); // Changed to HS256
  return token;
};

// Create and export the User model
const User = mongoose.model("User", userSchema);

module.exports = { User };

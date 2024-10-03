const { MongooseError } = require("mongoose");
const { User } = require("../model/user.model");
const { Router } = require("express");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middleware/auth.middleware");

const router = Router();

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
};

router.post("/signup", async (req, res) => {
  const email = req.body?.email;
  const username = req.body?.username;
  const password = req.body?.password;
  try {
    const user = await User.create({ email, password, username });
    if (user) {
      const token = user.generateToken();
      res.cookie("token", token, options);
      return res.status(200).send("User Created Successfully!");
    } else return res.status(500).send("somthing went wrong, try again later");
  } catch (err) {
    if (err instanceof MongooseError) {
      return res.status(401).send(err.message);
    }
    res.status(500).send("somthing went wrong, try again later");
    console.log(err);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = user.generateToken();

    res.cookie("token", token, options);
    res.status(200).send("User Logged In Successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const { id } = req.user;
    if (!id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findOne({ _id: id }).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json({ message: "User Logged In Successfully!", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/logout", authMiddleware, async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.clearCookie("token");
    res.status(200).json({ message: "User Logged Out Successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = { router };

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connection } = require("./db/connection");

const app = express();
const port = process.env.PORT || 3001;

/// db connection
connection()
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log("error in connection", err);
    process.exit(-1);
  });

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  })
);

const { router: problem } = require("./routes/problems.route");
const { router: user } = require("./routes/user.route");
const { router: language } = require("./routes/language.route");
const { router: submission } = require("./routes/submission.route");

app.use("/fetch", problem); // to fetch problems
app.use("/user", user); // user router
app.use("/update-lang", language); // update language
app.use("/code", submission); // route for submitting/checking code

app.listen(port, () => {
  console.log("App is running on port " + port);
});

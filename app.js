require("dotenv").config();
require("./config/passport");
require("./config/database");

const express = require("express");
const session = require("express-session");
const passport = require("passport");

const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const authRouter = require("./routes/auth");

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);

app.get("/", (req, res, next) => {
  res.send("Initial start page");
});

app.use((err, req, res, next) => {
  console.error("An error occurred:", err);

  if (err.code === 11000) {
    return res.status(400).json({
      error: { message: "An account with this email exist." },
    });
  }

  return res.status(err.code || 500).json({
    error: { message: err.message || "Internal server error." },
  });
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}.`);
});

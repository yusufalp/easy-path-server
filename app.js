require('dotenv').config()

const express = require("express");
const session = require("express-session");

const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("combined"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
  })
);

app.get("/", (req, res, next) => {
  res.send("Initial start page");
});

app.use((err, req, res, next) => {
  console.error("An error occurred:", err);

  return res.status(err.code || 500).json({
    error: { message: err.message || "Internal server error" },
  });
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}.`);
});

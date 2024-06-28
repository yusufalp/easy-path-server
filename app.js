const express = require("express");

const app = express();
const PORT = 8080;

app.get("/", (req, res, next) => {
  res.send("Initial start page");
});

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}.`);
});

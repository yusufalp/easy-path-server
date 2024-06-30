const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB is connected."))
  .catch((err) => console.error(err));

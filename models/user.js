const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      first: {
        type: String,
        required: true,
        trim: true,
      },
      last: {
        type: String,
        trim: true,
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    roles: [{ type: String }],
    archived: { type: Boolean, default: false },
    strategy: {
      google: {
        id: { type: String, default: "" },
        token: { type: String, default: "" },
        email: { type: String, default: "" },
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

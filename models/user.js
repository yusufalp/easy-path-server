const mongoose = require("mongoose").Schema;

const { Schema } = mongoose;

const { validationRules } = require("../data/constants");

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
      required: true,
      trim: true,
      lowercase: true,
      match: [
        validationRules.EMAIL_REGEX,
        validationRules.INVALID_EMAIL_MESSAGE,
      ],
    },
    password: {
      type: String,
      required: true,
      match: [
        validationRules.PASSWORD_REGEX,
        validationRules.INVALID_PASSWORD_MESSAGE,
      ],
      minLength: [
        validationRules.PASSWORD_LENGTH,
        validationRules.INVALID_PASSWORD_LENGTH_MESSAGE,
      ],
    },
    roles: [{ type: String }],
    archived: { type: Boolean, default: false },
    strategy: {
      google: { id: { type: String, default: "" } },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

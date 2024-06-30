const passport = require("passport");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const { validationRules } = require("../data/constants");

const signup = async (req, res, next) => {
  const { first, last, email, password } = req.body;

  try {
    if (!first || !email || !password) {
      throw new Error("Missing required fields.");
    }

    if (!email.match(validationRules.EMAIL_REGEX)) {
      throw new Error(validationRules.INVALID_EMAIL_MESSAGE);
    }

    if (!password.match(validationRules.PASSWORD_REGEX)) {
      throw new Error(validationRules.INVALID_PASSWORD_MESSAGE);
    }

    if (password.length < validationRules.PASSWORD_LENGTH) {
      throw new Error(validationRules.INVALID_PASSWORD_LENGTH_MESSAGE);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: { first, last },
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(200).json({
      success: { message: "A new user is created" },
      data: { user: newUser },
    });
  } catch (error) {
    next(error);
  }
};

const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      throw new Error(info.message);
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
    });

    res.status(200).json({
      success: { message: "Login successful" },
      data: { user: req.user },
    });
  })(req, res, next);
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });

  res.status(200).json({
    success: { message: "Logout successful" },
  });
};

module.exports = { signup, login, logout };

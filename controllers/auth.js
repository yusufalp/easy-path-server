const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const { validationRules } = require("../data/constants");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokens");

const signup = async (req, res, next) => {
  const { first, last, email, password } = req.body;

  try {
    if (!first || !email || !password) {
      throw new Error("Missing required fields.");
    }

    if (!email.match(validationRules.EMAIL_REGEX)) {
      throw new Error(validationRules.INVALID_EMAIL_MESSAGE);
    }

    if (password.length < validationRules.PASSWORD_LENGTH) {
      throw new Error(validationRules.INVALID_PASSWORD_LENGTH_MESSAGE);
    }

    if (!password.match(validationRules.PASSWORD_REGEX)) {
      throw new Error(validationRules.INVALID_PASSWORD_MESSAGE);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: { first, last },
      email,
      password: hashedPassword,
    });

    // Check if a user exists with a Google strategy and the same email
    // Update password and email if it exists, create a new user if it does not
    let user = await User.findOneAndUpdate(
      { "strategy.google.email": email },
      newUser,
      { upsert: true, new: true }
    );

    await user.save();

    res.status(200).json({
      success: { message: "A new user is created." },
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

const login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }

      if (!user) {
        throw new Error(info.message);
      }

      req.login(user, { session: false }, (err) => {
        if (err) {
          return next(err);
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
        });

        // Exclude the hashed password from the response
        const userWithoutPassword = req.user;
        userWithoutPassword.password = undefined;

        res.status(200).json({
          success: { message: "Login successful." },
          data: { user: userWithoutPassword, accessToken },
        });
      });
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
};

const logout = (req, res, next) => {
  try {
    res.clearCookie("refreshToken");
    req.logout((err) => {
      if (err) {
        return next(err);
      }

      res.status(200).json({
        success: { message: "Logout successful." },
      });
    });
  } catch (err) {
    return next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new Error("No refresh token is provided");
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return next(err);
      }

      const accessToken = generateAccessToken({
        _id: user._id,
        email: user.email,
      });

      res.status(200).json({
        success: { message: "Access token is generated " },
        data: { accessToken },
      });
    });
  } catch (err) {
    return next(err);
  }
};

const resetPassword = async (req, res, next) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match!");
    }

    if (newPassword.length < validationRules.PASSWORD_LENGTH) {
      throw new Error(validationRules.INVALID_PASSWORD_LENGTH_MESSAGE);
    }

    if (!newPassword.match(validationRules.PASSWORD_REGEX)) {
      throw new Error(validationRules.INVALID_PASSWORD_MESSAGE);
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const hashedPassword = await bcrypt(password, 10);
    user.password = hashedPassword;
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    // Exclude the hashed password from the response
    const userWithoutPassword = req.user;
    userWithoutPassword.password = undefined;

    res.status(200).json({
      success: { message: "User is authenticated" },
      data: { user, accessToken },
    });
  } catch (err) {
    return next(err);
  }
};

const googleAuthCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, user) => {
    console.log('gooleAuthCB :>> ');
    try {
      if (err || !user) {
        throw new Error("Google authentication failed.");
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      res.status(200).json({
        success: { message: "User is authenticated" },
        data: { user, accessToken },
      });
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
};

module.exports = {
  signup,
  login,
  logout,
  refreshToken,
  resetPassword,
  googleAuthCallback,
};

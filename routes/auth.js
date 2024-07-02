const express = require("express");
const passport = require("passport");

const router = express.Router();

const {
  signup,
  login,
  logout,
  refreshToken,
  resetPassword,
  googleAuthCallback,
} = require("../controllers/auth");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.post("/reset-password", resetPassword);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get("/google/callback", googleAuthCallback);

module.exports = router;

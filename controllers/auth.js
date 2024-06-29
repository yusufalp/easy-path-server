const signup = async (req, res, next) => {
  res.send("Sign up");
};

const login = (req, res, next) => {
  res.send("Log in");
};

const logout = (req, res, next) => {
  res.send("Log out");
};

module.exports = {signup, login, logout}
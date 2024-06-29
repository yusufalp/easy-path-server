const PASSWORD_LENGTH = 8;

const validationRules = Object.freeze({
  EMAIL_REGEX: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
  INVALID_EMAIL_MESSAGE: "Email is invalid, please enter a valid email!",
  PASSWORD_REGEX:
    /^(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=]).*$/,
  INVALID_PASSWORD_MESSAGE:
    "Password invalid, it should contain an uppercase, a lowercase, a number and a special character!",
  PASSWORD_LENGTH: PASSWORD_LENGTH,
  INVALID_PASSWORD_LENGTH_MESSAGE: `Password must be at least ${PASSWORD_LENGTH} characters`,
});

module.exports = { validationRules };

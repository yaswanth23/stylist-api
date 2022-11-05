module.exports = {
  STATUS_CODES: {
    200: 200,
    301: 301,
    302: 302,
    303: 303,
    304: 304,
    305: 305,
    401: 401,
    402: 402,
  },
  STATUS_MESSAGE: {
    200: "success",
    301: "user already exists",
    302: "user not found",
    303: "OTP has not verified for this user",
    304: "incorrect password",
    305: "account not verified",
    401: "invalid OTP",
    402: "OTP has expired",
  },
};

module.exports = {
  STATUS_CODES: {
    200: 200,
    301: 301,
    302: 302,
    303: 303,
    304: 304,
    401: 401,
    402: 402,
  },
  STATUS_MESSAGE: {
    200: "success",
    301: "user already exists",
    302: "user not found",
    303: "failed sending OTP ",
    304: "Invalid input base64ImgString",
    401: "invalid OTP",
    402: "OTP has expired",
  },
};

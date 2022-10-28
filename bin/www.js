const dotenv = require("dotenv").config();
const colors = require("colors/safe");
const http = require("http");
const app = require("../src/app");
const connectDB = require("../src/db/dbConnection");

(async () => {
  await connectDB();
  http.createServer(app).listen(process.env.APP_PORT, () => {
    const url = `http://localhost:${process.env.APP_PORT}`;
    console.log(`webserver listening on ${url}`);
    console.log(`use the following command to test the ping call`);
    console.debug(`${colors.yellow("curl " + url + "/api/ping")}`);
  });
})();

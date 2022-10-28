const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI, {}, (err) => {
      if (!err) console.log("database connected");
      else console.log("database connection error", err);
    });
  } catch (e) {
    process.exit(1);
  }
};

module.exports = connectDB;

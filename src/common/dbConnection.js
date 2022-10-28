// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {});
//   } catch (e) {
//     process.exit(1);
//   }
// };


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://stylist:<password>@dev-db.7fff284.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});



// module.exports = connectDB;

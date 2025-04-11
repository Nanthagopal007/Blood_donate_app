const mongoose = require("mongoose");
require("dotenv").config();

const connectDb = async () => {
  try {
    const uri = process.env.MONGO_URI; // You can also use the string directly here if needed

    const connect = await mongoose.connect(uri);
    console.log(`✅ Database Connected: ${connect.connection.host}/${connect.connection.name}`);
  } catch (error) {
    console.error("❌ Database Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDb;

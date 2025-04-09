const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        const uri = "mongodb+srv://nanthagopal:9994797571@cluster0.0am1g.mongodb.net/BLOOD";
        const connect = await mongoose.connect(uri);
        console.log(`✅ Database Connected: ${connect.connection.host}/${connect.connection.name}`);
    } catch (error) {
        console.error("❌ Database Connection Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDb;

const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        // Fetch URI from environment variables
        const uri = process.env.MONGO_URI;
        const connect = await mongoose.connect(uri);
        console.log(`✅ Database Connected: ${connect.connection.host}/${connect.connection.name}`);
    } catch (error) {
        console.error("❌ Database Connection Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDb;

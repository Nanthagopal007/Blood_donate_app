const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB_NAME}`;
        const connect = await mongoose.connect(uri);
        console.log(`✅ Database Connected: ${connect.connection.host}/${connect.connection.name}`);
    } catch (error) {
        console.error("❌ Database Connection Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDb;

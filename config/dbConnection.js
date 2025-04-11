const mongoose = require("mongoose");
require("dotenv").config(); // load env variables

const connectDb = async () => {
    try {
        // Construct MongoDB URI from env vars
        const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;

        const connect = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ Database Connected: ${connect.connection.host}/${connect.connection.name}`);
    } catch (error) {
        console.error("❌ Database Connection Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDb;

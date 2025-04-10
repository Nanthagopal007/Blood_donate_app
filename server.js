const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler"); // ✅ Fix path
const connectDb = require("./config/dbConnection");


connectDb();
const app = express();

const port = process.env.PORT || 5001;



app.use(
  cors({
    origin: process.env.REACT_APP_API_URL, // ✅ Allow the frontend domain from .env
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // ✅ Allow cookies or other credentials
  })
);


app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes")); // ✅ Fix path
app.use("/api/users", require("./routes/userRoutes")); // ✅ Fix path
app.use("/api/donors", require("./routes/donorDetailsRoutes")); // ✅ Fix path

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler"); // ✅ Fix path
const connectDb = require("./config/dbConnection");


connectDb();
const app = express();

const port = process.env.PORT || 5001;


// ✅ Use the correct CORS settings
app.use(
  cors({
    origin: "http://localhost:3000", // ✅ Set your frontend URl
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // ✅ Allow credentials (cookies, authentication)
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

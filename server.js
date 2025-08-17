const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const connectDb = require("./config/dbConnection");
const cookieParser = require("cookie-parser");

connectDb();

const app = express();
const port = process.env.PORT || 5001;

// ✅ Allowed frontend origins
const allowedOrigins = [
  "http://localhost:3000", // local dev
  "https://blood-donation-social-service-app.vercel.app" // production frontend
];

// ✅ Use CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());

// ✅ API Routes
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/donors", require("./routes/donorDetailsRoutes"));

// ✅ Error handler
app.use(errorHandler);

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

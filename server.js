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
  "http://localhost:3000",  // local dev
  "https://blood-donation-social-service-app.vercel.app"  // vercel frontend
];

// ✅ Use CORS (handle preflight too)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false); // ❌ instead of throwing error
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle preflight requests globally
app.options("*", cors());

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());

// ✅ API Routes
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/donors", require("./routes/donorDetailsRoutes"));

// ✅ Error handler
app.use(errorHandler);

// ✅ Start server (Render hosting supports this)
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

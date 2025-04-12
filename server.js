const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const connectDb = require("./config/dbConnection");
const cookieParser = require("cookie-parser"); // Optional if you use cookies

connectDb();

const app = express();
const port = process.env.PORT || 5001;

// ✅ Use CORS early (PRODUCTION setup)
const allowedOrigins = [
  "http://localhost:3000",
  "https://blood-donation-social-service-app.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
// ✅ Parse cookies and JSON
app.use(cookieParser());
app.use(express.json());

// ✅ API Routes
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/donors", require("./routes/donorDetailsRoutes"));

// ✅ Error handler (must be after routes)
app.use(errorHandler);

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running in production on port ${port}`);
});

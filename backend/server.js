// Load environment variables from .env file
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoute");
const {checkAuthorize} = require("./middleware/authMiddleware");

const app = express();
const port = process.env.PORT || 9999;

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));


// Database connection
mongoose
  .connect(process.env.DB_CONNECTION, {dbName: process.env.DB_NAME})
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Could not connect to the database", err));

// Routes
app.use("/auth", authRoutes);

app.get("/admin-only", checkAuthorize(["admin"]), (req, res) => {
  res.json({ message: "Admin only route" });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

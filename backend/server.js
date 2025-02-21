// Load environment variables from .env file
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoute");
const testRoutes = require("./routes/testRoute");
const movieRoutes = require("./routes/movieRoute");
const eventRoutes = require("./routes/eventRoute");
const {checkAuthorize} = require("./middleware/authMiddleware");
const DB = require("./config/db");

const app = express();
const port = process.env.PORT || 9999;

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Routes
app.use("/auth", authRoutes);
app.use("/test", testRoutes);
app.use("/movie", movieRoutes); 
app.use("/event", eventRoutes);

app.get("/admin-only", checkAuthorize(["admin"]), (req, res) => {
  res.json({ message: "Admin only route" });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  // Database connection
  DB.connectDB();
});

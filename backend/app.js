const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const connectDatabase = require("./config/database");
const dataRoute = require("./routes/dataRoute"); // Import data routes

// Connecting to database
connectDatabase();

const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:5173", // Frontend origin
  credentials: true, // Allow credentials (cookies)
  methods: "GET,POST,PUT",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));

// Use the data routes under /api
app.use("/api", dataRoute);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

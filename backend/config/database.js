const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_LOCAL_URI, {
    })
};

module.exports = connectDatabase;

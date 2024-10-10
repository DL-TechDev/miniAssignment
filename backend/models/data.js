const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  postId: Number,
  id: Number,
  name: String,
  email: String,
  body: String,
},
  { collection: 'Data' }
);

const Data = mongoose.model("Data", dataSchema);

module.exports = Data;

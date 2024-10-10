const Data = require("../models/data"); // Import the Data model

// POST: Upload data (insert into the database)
exports.uploadData = async (req, res) => {
  try {
    const records = req.body; // Directly take the array from req.body
    //console.log("Received data:", records); // Log the data received by the server

    // Check if the received data is an array
    if (!Array.isArray(records)) {
      return res.status(400).json({ message: "Expected an array of records" });
    }

    // Clear the existing data in the database
    await Data.deleteMany({});
    console.log("Previous data cleared");

    await Data.insertMany(records); // Insert records into the database
    res.status(200).send("Data uploaded successfully");
  } catch (error) {
    console.error("Error while uploading data:", error);
    res.status(400).json({ message: error.message });
  }
};

// fetch data
exports.getData = async (req, res) => {
  const { page, limit } = req.body;
  try {
    const records = await Data.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const totalRecords = await Data.countDocuments();
    res.status(200).json({
      records,
      page: Number(page),
      totalPages: Math.ceil(totalRecords / limit),
    });
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
};


// search data
exports.findData = async (req, res) => {
  const { page, limit, data } = req.body;
  const searchQuery = data.toLowerCase();
  try {
    const records = await Data.find({
      $or: [
        { name: new RegExp(searchQuery, "i") },
        { email: new RegExp(searchQuery, "i") },
        { body: new RegExp(searchQuery, "i") }
      ],
      })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const totalRecords = await Data.countDocuments();
    res.status(200).json({
      records,
      page: Number(page),
      totalPages: Math.ceil(totalRecords / limit),
    });
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
};
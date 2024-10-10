const express = require("express");
const router = express.Router();
const dataController = require("../controllers/dataController.js");

// POST route to upload data
router.post("/upload", dataController.uploadData);

// // POST route to fetch data with pagination (parameters sent in the body)
router.post("/data", dataController.getData);

router.post("/search", dataController.findData);

module.exports = router;

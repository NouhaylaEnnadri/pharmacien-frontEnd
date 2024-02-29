const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 6,
    max: 255,
  },
  description: {
    type: String, // Use Text type for longer text
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    type: String,
  },
});

module.exports = mongoose.model("product", productSchema);

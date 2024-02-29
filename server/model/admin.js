const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    max: 255,
    min: 6,
  },
  password: {
    type: String,
    max: 1024,
    min: 6,
  },
});

module.exports = mongoose.model("Admin", adminSchema);

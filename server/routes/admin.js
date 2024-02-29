const express = require("express");
const router = express.Router();
const Admin = require("../model/admin");
const {
  registerValidation,
  loginValidation,
} = require("../validation/validation");
const bcrypt = require("bcrypt");

// register
router.post("/register", async (req, res) => {
  // Let's validate the data before we create a user
  const { error } = req.body;
  if (error) return res.status(400).send(error.details[0].message);

  // Check if the user is already in the database
  const emailExists = await Admin.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email already exists");

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new user based on the validated data
  const admin = new Admin({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    // Save the user to the database
    const savedAdmin = await admin.save();
    res.send({ admin: savedAdmin._id });
  } catch (err) {
    // Handle database save error
    res.status(500).send(err);
  }
});

// login
// login
router.post("/login", async (req, res) => {
  // Let's validate the data before we create a user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // Check if the user is already in the database
  const admin = await Admin.findOne({ email: req.body.email });
  if (!admin)
    return res.status(400).json({ message: "Invalid email or password" });

  // Check the password
  const validPwd = await bcrypt.compare(req.body.password, admin.password);
  if (!validPwd) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Send the token as a response header and success message
  res.json({ message: "Login successful" });
  return; // Ensure the function exits after sending the response
});

module.exports = router;

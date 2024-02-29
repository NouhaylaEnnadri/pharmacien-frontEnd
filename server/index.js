// index.js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import routes
const authRoute = require("./routes/admin");
const productRoute = require("./routes/products"); // Corrected from 'products' to 'productRoute'

dotenv.config();
app.use(cors());
// Connect to DB
mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => console.log("Connected to DB"))
  .catch((error) => console.error("Error connecting to DB:", error));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set the view engine
app.set("view engine", "ejs");

// Routes Middleware
app.use("/api/admin", authRoute);
app.use("/api/product", productRoute);

app.listen(5001, () => console.log("Listening on port 5001"));

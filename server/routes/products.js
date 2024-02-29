// productRoute.js
const express = require("express");
const router = express.Router();
const path = require("path");
const Product = require("../model/product");
const { productValidation } = require("../validation/productValidation");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Temporary storage for file uploads

router.use("/uploads", express.static("uploads"));

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: "uploads/", // Specify the folder where images will be stored temporarily
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  },
});


// Reconfigure multer to use the storage setup
const uploadWithStorage = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route handler to add a new product with image upload
router.post("/", uploadWithStorage.single("image"), async (req, res) => {
  try {
    const { error } = productValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name, description, category } = req.body;
    const image = req.file; // Access the uploaded file from req.file

    // Check if the product already exists
    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists" });
    }

    // Create a new product
    const newProduct = new Product({
      name,
      description,
      category,
      image: image ? `/uploads/${image.filename}` : null,
    });

    // Save the product to the database
    await newProduct.save();

    res.status(201).json({
      _id: newProduct._id,
      name: newProduct.name,
      description: newProduct.description,
      category: newProduct.category,
      image: newProduct.image,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

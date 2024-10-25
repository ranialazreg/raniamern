const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);  // Ensure the upload directory is correct
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);  // Generate a unique filename
  }
});

const upload = multer({ storage: storage });


// GET all products with pagination and search
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 2, search = '' } = req.query;

    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ],
    };

    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments(query);

    res.status(200).json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
      const { name, price, category, description } = req.body;
      const image = req.file ? req.file.filename : null;  // Get the image filename
  
      if (!name || !price || !category) {
        return res.status(400).json({ message: 'Name, price, and category are required' });
      }
  
      const newProduct = new Product({ name, price, category, description, image });
      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating product:', error.message);
      res.status(500).json({ message: 'Error creating product', error: error.message });
    }
  });
  
  // Serve images from the uploads folder
  router.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));


// PUT update a product by ID
router.put('/:id', async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, category, description },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// DELETE a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

module.exports = router;

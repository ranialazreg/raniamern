const express = require('express');
const Adherent = require('../models/Adherent');
const router = express.Router();

// Create an adherent (POST)
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    const newAdherent = new Adherent({ name, email });
    await newAdherent.save();
    res.status(201).json(newAdherent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating adherent', error: error.message });
  }
});

// Get all adherents (GET)
router.get('/', async (req, res) => {
    try {
      const { page = 1, limit = 2, search = '' } = req.query;  // Get pagination and search params
  
      const query = {
        $or: [
          { name: { $regex: search, $options: 'i' } }, // Search adherents by name (case insensitive)
          { email: { $regex: search, $options: 'i' } }, // Search adherents by email (case insensitive)
        ],
      };
  
      const adherents = await Adherent.find(query)
        .limit(limit * 1)  // Limit the number of adherents per page
        .skip((page - 1) * limit)  // Skip the adherents from previous pages
        .exec();
  
      const count = await Adherent.countDocuments(query);  // Total number of adherents matching the query
  
      res.status(200).json({
        adherents,
        totalPages: Math.ceil(count / limit),  // Calculate total pages
        currentPage: Number(page),
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching adherents', error: error.message });
    }
  });

// Get a single adherent by ID (GET)
router.get('/:id', async (req, res) => {
  try {
    const adherent = await Adherent.findById(req.params.id);
    if (!adherent) return res.status(404).json({ message: 'Adherent not found' });
    res.status(200).json(adherent);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching adherent', error: error.message });
  }
});

// Update an adherent by ID (PUT)
router.put('/:id', async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedAdherent = await Adherent.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );
    if (!updatedAdherent) return res.status(404).json({ message: 'Adherent not found' });
    res.status(200).json(updatedAdherent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating adherent', error: error.message });
  }
});

// Delete an adherent by ID (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const deletedAdherent = await Adherent.findByIdAndDelete(req.params.id);
    if (!deletedAdherent) return res.status(404).json({ message: 'Adherent not found' });
    res.status(200).json({ message: 'Adherent deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting adherent', error: error.message });
  }
});

module.exports = router;

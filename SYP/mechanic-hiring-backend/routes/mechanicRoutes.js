const express = require('express');
const router = express.Router();
const { getAllMechanics, getMechanicById, updateMechanicProfile } = require('../controllers/mechanicController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all approved mechanics (public route)
router.get('/', getAllMechanics);

// Get mechanic by ID
router.get('/:id', getMechanicById);

// Update mechanic profile (protected)
router.put('/:id', authMiddleware, updateMechanicProfile);

module.exports = router;
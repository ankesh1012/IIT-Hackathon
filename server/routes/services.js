// server/routes/services.js

const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');

// @route   GET /api/services
// @desc    Get all active service listings
// @access  Public
router.get('/', serviceController.getServices);

// @route   GET /api/services/:id
// @desc    Get single service details
// @access  Public
router.get('/:id', serviceController.getServiceById);

// @route   POST /api/services
// @desc    Create a new service listing
// @access  Private
router.post('/', protect, serviceController.createService);

// @route   POST /api/services/:id/purchase
// @desc    Purchase a service
// @access  Private
router.post('/:id/purchase', protect, serviceController.purchaseService);

module.exports = router;
// server/controllers/serviceController.js

const Service = require('../models/Service');
const Skill = require('../models/Skill');

// @desc    Create a new service listing
// @route   POST /api/services
// @access  Private
exports.createService = async (req, res) => {
  const { title, description, skillName, price } = req.body;

  try {
    // 1. Find the skill ID
    const skillDoc = await Skill.findOne({ name: { $regex: new RegExp(`^${skillName}$`, 'i') } });
    if (!skillDoc) {
      return res.status(400).json({ message: 'Skill not found. Please select a valid skill.' });
    }

    // 2. Create the service
    const service = await Service.create({
      title,
      description,
      skill: skillDoc._id,
      provider: req.user._id, // Set the logged-in user as provider
      price: parseInt(price),
    });

    res.status(201).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during service listing creation.' });
  }
};

// @desc    Get all active service listings (Marketplace)
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ isAvailable: true })
      .populate('provider', 'name location rating avatar')
      .populate('skill', 'name')
      .sort({ createdAt: -1 });

    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching services.' });
  }
};

// @desc    Get a single service by ID
// @route   GET /api/services/:id
// @access  Public
exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
            .populate('provider', 'name location rating avatar email')
            .populate('skill', 'name');

        if (!service) {
            return res.status(404).json({ message: 'Service not found.' });
        }
        res.json(service);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching service details.' });
    }
};

// @desc    Purchase a service (Placeholder for complex transaction logic)
// @route   POST /api/services/:id/purchase
// @access  Private
exports.purchaseService = async (req, res) => {
  // NOTE: This is a simplified placeholder. Real logic would involve:
  // 1. Transaction model update (debiting buyer, crediting seller).
  // 2. Ensuring buyer has sufficient tokens.
  // 3. Creating a new Booking/Order record.

  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    if (service.provider.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'Cannot purchase your own service.' });
    }

    // 1. Placeholder: Check user balance (Assumes user balance is a field on the User model)
    const buyer = await User.findById(req.user._id).select('+balance'); // Assuming balance field
    if (!buyer || buyer.balance < service.price) {
        return res.status(400).json({ message: 'Insufficient credits to purchase this service.' });
    }

    // 2. Perform Transaction (DUMMY TRANSACTION)
    buyer.balance -= service.price;
    await buyer.save();

    // 3. Mark the transaction successful and notify provider (Placeholder)
    res.json({ message: `Successfully purchased ${service.title} for ${service.price} credits. Provider will be notified.` });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Transaction failed.' });
  }
};
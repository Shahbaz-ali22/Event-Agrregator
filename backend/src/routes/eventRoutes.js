import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

// Get all events with pagination and filters
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const events = await Event.find(query)
      .sort({ date: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Event.countDocuments(query);

    res.json({
      events,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get event categories
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await Event.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 
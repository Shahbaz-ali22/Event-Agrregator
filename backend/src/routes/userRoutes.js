import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Register user interest in an event
router.post('/interest', async (req, res) => {
  try {
    const { email, eventId, hasOptedIn } = req.body;

    if (!email || !eventId) {
      return res.status(400).json({ message: 'Email and event ID are required' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        hasOptedIn,
        interestedEvents: [eventId]
      });
    } else {
      if (!user.interestedEvents.includes(eventId)) {
        user.interestedEvents.push(eventId);
      }
      if (hasOptedIn !== undefined) {
        user.hasOptedIn = hasOptedIn;
      }
    }

    await user.save();
    res.json({ message: 'Interest registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update email preferences
router.put('/preferences', async (req, res) => {
  try {
    const { email, hasOptedIn } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.hasOptedIn = hasOptedIn;
    await user.save();

    res.json({ message: 'Preferences updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: String,
  venue: {
    name: String,
    address: String,
    city: {
      type: String,
      default: 'Sydney'
    },
    country: {
      type: String,
      default: 'Australia'
    }
  },
  category: String,
  imageUrl: String,
  ticketUrl: {
    type: String,
    required: true
  },
  price: {
    from: Number,
    to: Number,
    currency: {
      type: String,
      default: 'AUD'
    }
  },
  source: {
    type: String,
    required: true
  },
  sourceId: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

eventSchema.index({ title: 'text', description: 'text' });

const Event = mongoose.model('Event', eventSchema);

export default Event; 
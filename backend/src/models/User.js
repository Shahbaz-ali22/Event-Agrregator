import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  hasOptedIn: {
    type: Boolean,
    default: false
  },
  interestedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash email before saving (for privacy)
userSchema.pre('save', async function(next) {
  if (this.isModified('email')) {
    this.email = await bcrypt.hash(this.email, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User; 
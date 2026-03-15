const mongoose = require('mongoose');

const HabitEntrySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  completed: { type: Boolean, default: false }
});

const HabitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  entries: {
    type: Map,
    of: [HabitEntrySchema], // Key = "YYYY-MM"
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Habit', HabitSchema);

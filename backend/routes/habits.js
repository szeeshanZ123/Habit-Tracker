const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Get habits for a specific month
router.get('/', auth, async (req, res) => {
  try {
    const { year, month } = req.query; // month is 1-indexed
    const yearMonth = `${year}-${month.toString().padStart(2, '0')}`;
    
    const habits = await Habit.find({ userId: req.user.id });
    
    // Format response to include only entries for the requested month
    const formattedHabits = habits.map(h => ({
      _id: h._id,
      name: h.name,
      entries: h.entries.get(yearMonth) || []
    }));

    res.json(formattedHabits);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new habit
router.post('/', auth, async (req, res) => {
  try {
    const newHabit = new Habit({
      userId: req.user.id,
      name: req.body.name,
      entries: {}
    });
    const saved = await newHabit.save();
    res.json({ _id: saved._id, name: saved.name, entries: [] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update habit name
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name: req.body.name },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a habit
router.delete('/:id', auth, async (req, res) => {
  try {
    await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle a day completion
router.post('/toggle', auth, async (req, res) => {
  try {
    const { habitId, year, month, day, completed } = req.body;
    const yearMonth = `${year}-${month.toString().padStart(2, '0')}`;
    
    const habit = await Habit.findOne({ _id: habitId, userId: req.user.id });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    let currentEntries = habit.entries.get(yearMonth) || [];
    
    const entryIndex = currentEntries.findIndex(e => e.day === day);
    if (entryIndex >= 0) {
      currentEntries[entryIndex].completed = completed;
    } else {
      currentEntries.push({ day, completed });
    }

    habit.entries.set(yearMonth, currentEntries);
    await habit.save();

    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

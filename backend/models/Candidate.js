// backend/models/Candidate.js
const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  pan: { type: String, required: true, unique: true },
  testSet: { type: String, enum: ['set1', 'set2'], required: true },
  testScore: { type: Number, default: 0 },
  status: { type: String, enum: ['selected', 'rejected'], default: 'rejected' },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate', candidateSchema);

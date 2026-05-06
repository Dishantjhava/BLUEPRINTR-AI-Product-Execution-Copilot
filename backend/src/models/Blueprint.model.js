const mongoose = require('mongoose');

const blueprintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  idea: {
    type: String,
    required: true,
    trim: true
  },
  solution: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  title: {
    type: String,
    trim: true,
    default: ''
  },
  folder: {
    type: String,
    trim: true,
    default: null
  }
}, { timestamps: true });

// Compound index for fast user-scoped queries
blueprintSchema.index({ userId: 1, createdAt: -1 });

const Blueprint = mongoose.model('Blueprint', blueprintSchema);

module.exports = Blueprint;

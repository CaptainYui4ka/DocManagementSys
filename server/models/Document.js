const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  agent: {
    type: String,
    required: true,
  },
  documentName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;

const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  original_url: { type: String, required: true, unique: true },
  original_content: { type: String, required: true }, // The scraped content
  updated_content: { type: String }, // To be filled in Phase 2
  status: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Completed', 'Failed'], 
    default: 'Pending' 
  },
  reference_links: [String], // To be filled in Phase 2
  published_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', ArticleSchema);

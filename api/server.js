require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Article = require('../models/Article');
const { scrapeOldestArticles } = require('../scraper/node-scraper');

const app = express();

// CORS Configuration - Allow all origins for testing
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

// Additional CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Origin: ${req.get('origin')}`);
  next();
});

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/content_pipeline', {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,
})
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ DB Error:', err.message));


// --- Root Endpoint ---
app.get('/', (req, res) => {
  res.json({
    message: 'BeyoundChats Content Pipeline API - Phase 1',
    status: 'Server is running',
    endpoints: {
      scrape: 'POST /api/scrape',
      getAllArticles: 'GET /api/articles',
      getArticle: 'GET /api/articles/:id',
      updateArticle: 'PUT /api/articles/:id',
      deleteArticle: 'DELETE /api/articles/:id'
    }
  });
});

// --- API Endpoints (CRUD) ---

// 1. Trigger Scraper (The "Action" Button)
app.get('/api/scrape', async (req, res) => {
  try {
    console.log('🔄 Scraper endpoint called...');
    
    res.json({ message: 'Scraping started. Check logs for progress.' });

    scrapeOldestArticles().catch(err => console.error('Scraper error:', err));
    
  } catch (error) {
    console.error(error); 
    if (!res.headersSent) res.status(500).json({ error: error.message });
  }
});

// 2. GET All Articles (Read)
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.find()
      .sort({ published_date: -1 })
      .limit(10); // Changed limit to 10 so you see more data
      // REMOVED: .select('-original_content -updated_content'); 
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. GET Single Article
app.get('/api/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. UPDATE Article (Used by Phase 2 script later)
app.put('/api/articles/:id', async (req, res) => {
  try {
    const updated = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. DELETE Article
app.delete('/api/articles/:id', async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Local access: http://localhost:${PORT}`);
});
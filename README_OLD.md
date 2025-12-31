# BeyoundChats Content Pipeline - Phase One

A Node.js web scraper for automatically collecting and storing articles from the BeyondChats blog into MongoDB. Phase 1 focuses on **automated article discovery, web scraping, and persistent storage** with built-in duplicate detection and error handling.

**Status**: ✅ **Fully Operational** - Scrapes 5+ articles per run with MongoDB integration

## 📁 Project Structure

```
BeyoundChats-tasks/
├── api/
│   └── server.js              # Express server with CRUD API endpoints
├── scraper/
│   └── node-scraper.js        # Web scraper for BeyondChats blog articles
├── models/
│   └── Article.js             # MongoDB Article schema definition
├── database/
│   └── mongo.js               # (Legacy - Article schema moved to models/)
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── package.json               # Project dependencies
└── README.md                  
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/ADSingh2004/BeyoundChats-tasks.git
cd BeyoundChats-tasks
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env
```

Then edit `.env` and add your MongoDB connection URI:

```env
# For MongoDB Atlas (Cloud)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/content_pipeline?retryWrites=true&w=majority

PORT=5000
```

### MongoDB Connection Details

**Do we need MongoDB API key?**
- **Local MongoDB**: No API key required. Just ensure MongoDB is running locally.
- **MongoDB Atlas (Cloud)**: Yes, use your username and password in the connection string above.
- **No separate API key needed** - the credentials are embedded in the connection URI.

## 📦 Dependencies

- **express**: ^5.2.1 - Web server framework
- **mongoose**: ^9.1.1 - MongoDB object modeling
- **axios**: ^1.13.2 - HTTP client for fetching web pages
- **cheerio**: ^1.1.2 - jQuery-like syntax for parsing HTML
- **cors**: ^2.8.5 - Cross-Origin Resource Sharing middleware
- **dotenv**: ^17.2.3 - Environment variable management
- **nodemon**: ^3.1.11 - Auto-restart server during development

## 🔧 Configuration Files

### `env template`
Template for environment variables. Copy to `.env` and fill in your values.

```env
# For local MongoDB without API
MONGO_URI=mongodb://localhost:27017/content_pipeline
PORT=5000
```
```env
# For MongoDB Atlas (Cloud)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/content_pipeline?retryWrites=true&w=majority

PORT=5000
```

### `.gitignore`
Prevents tracking of sensitive files and dependencies:
- `node_modules/` - Dependencies (installed with npm)
- `.env` - Local environment variables with credentials
- `.env.*.local` - Environment-specific configs
- `*.log` - Log files
- `package-lock.json` - Lock file (optional)

## 📊 Data Schema

### Article Model
Located in [models/Article.js](models/Article.js)

```javascript
{
  title: String,                    // Article title (required)
  original_url: String,             // Source URL (required, unique)
  original_content: String,         // Scraped article content
  updated_content: String,          // For Phase 2 processing
  status: String,                   // 'Pending', 'Processing', 'Completed', 'Failed'
  reference_links: [String],        // Additional links (Phase 2)
  published_date: Date              // Auto-set to current time
}
```

## 🌐 API Endpoints

### 1. Trigger Scraper
**POST** `/api/scrape`

Initiates the scraping process to fetch articles from BeyondChats blogs.

**Response:**
```json
{
  "message": "Scraping started/completed. Check logs."
}
```

### 2. Get All Articles
**GET** `/api/articles`

Retrieves all articles sorted by newest first.

**Response:**
```json
[
  {
    "_id": "...",
    "title": "Article Title",
    "original_url": "https://...",
    "original_content": "...",
    "status": "Completed",
    "published_date": "2025-12-31T..."
  }
]
```

### 3. Get Single Article
**GET** `/api/articles/:id`

Retrieves a specific article by ID.

**Response:**
```json
{
  "_id": "...",
  "title": "Article Title",
  "original_url": "https://...",
  ...
}
```

### 4. Update Article
**PUT** `/api/articles/:id`

Updates article data (content, status, reference links for Phase 2).

**Request Body:**
```json
{
  "updated_content": "...",
  "status": "Processing"
}
```

### 5. Delete Article
**DELETE** `/api/articles/:id`

Removes an article from the database.

**Response:**
```json
{
  "message": "Article deleted"
}
```

## 🔄 Scraper Details

### File: [scraper/node-scraper.js](scraper/node-scraper.js)

The scraper performs the following steps:

1. **Find Last Page**: Detects the last page number from BeyondChats pagination
2. **Fetch Last Page**: Visits the latest articles page
3. **Extract Links**: Collects article URLs from the page
4. **Scrape Content**: Downloads each article and extracts:
   - Title (from `<h1>` tag)
   - Content (from `.entry-content`, `.post_content`, or `<article>` tags)
5. **Store in DB**: Saves to MongoDB with status "Pending"

**Features:**
- ✅ Duplicate detection (skips already-stored URLs)
- ✅ Error handling for failed requests
- ✅ Configurable content selectors
- ✅ Limits to 5 articles per run (adjustable)

## 🚀 Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
# OR use nodemon directly:
nodemon api/server.js
```

### Production Mode
```bash
node api/server.js
```

### Manual Scraping
```bash
node scraper/node-scraper.js
```

Or trigger via API:
```bash
curl -X POST http://localhost:5000/api/scrape
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running:
- Local: `mongod` in terminal
- Atlas: Check connection string in `.env`

### Module Not Found
```
Error: Cannot find module 'mongoose'
```
**Solution**: Run `npm install`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change port in `.env` or kill process using port 5000

### Scraper Not Finding Articles
**Solution**: Website structure may have changed. Update CSS selectors in `node-scraper.js`:
- Line with `h3 a, h2 a` - adjust for article links
- Line with `.entry-content` - adjust for content area

## 📝 File Corrections Made

✅ Fixed import paths:
- `api/server.js`: Updated paths to `../models/Article` and `../scraper/node-scraper`
- `scraper/node-scraper.js`: Updated path to `../models/Article`

✅ Fixed Cheerio syntax error:
- Changed `$()` to `$home()` for proper scoping

✅ Created missing `models/Article.js` file

✅ Updated `.gitignore` to include `.env` files

✅ Created `.env.example` template

✅ Completed README documentation

## 🔜 Phase 2 (Future)
- Content enrichment and processing
- Reference link extraction
- AI-powered content updates
- Advanced filtering and search

## 📧 Support
For issues or questions, please open an issue on [GitHub](https://github.com/ADSingh2004/BeyoundChats-tasks/issues)

## 📄 License
ISC

---

**Last Updated**: December 28, 2025  
**Status**: Phase 1 - Complete

# BeyondChats Content Pipeline

A full-stack web application for automated article ingestion, AI-powered content enhancement, and intelligent dashboard management. Built with Node.js, React, MongoDB, and Tailwind CSS.

**Phase 3 Status**: ✅ **Dashboard Complete** - Interactive React dashboard with real-time backend integration, article visualization, and scraping controls.

## ✨ Features

### 🔄 Automated Content Pipeline
- **Web Scraping**: Automated extraction of articles from BeyondChats blog
- **Duplicate Detection**: Intelligent prevention of duplicate content storage
- **Real-time Processing**: Live status updates and progress tracking

### 📊 Interactive Dashboard
- **Article Management**: View, filter, and manage scraped articles
- **Status Tracking**: Monitor processing states (Pending, Processing, Completed)
- **Content Comparison**: Side-by-side view of original vs AI-enhanced content
- **Live Statistics**: Real-time metrics for total, enhanced, and pending articles

### 🚀 Backend API
- **RESTful Endpoints**: Complete CRUD operations for articles
- **Scraping Triggers**: API-driven content ingestion
- **MongoDB Integration**: Persistent storage with Mongoose ODM

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Components**: Expandable article cards with smooth animations
- **Real-time Updates**: Live connection status and data synchronization

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Cheerio** - HTML parsing and scraping
- **Axios** - HTTP client

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Axios** - API communication

### Development
- **ESLint** - Code linting
- **Nodemon** - Auto-restart for development

## 📁 Project Structure

```
BeyoundChats-tasks/
├── api/
│   └── server.js              # Express server with REST API
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main dashboard component
│   │   ├── components/
│   │   │   └── ArticleCard.jsx # Article display component
│   │   ├── index.css          # Tailwind CSS imports
│   │   └── main.jsx           # React entry point
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration
│   └── tailwind.config.js     # Tailwind configuration
├── scraper/
│   └── node-scraper.js        # Web scraping logic
├── models/
│   └── Article.js             # MongoDB schema
├── database/
│   └── mongo.js               # Legacy database config
├── package.json               # Root dependencies
├── .env.example               # Environment template
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/ADSingh2004/BeyoundChats-tasks.git
cd BeyoundChats-tasks
```

2. **Install root dependencies:**
```bash
npm install
```

3. **Install frontend dependencies:**
```bash
cd frontend
npm install
cd ..
```

4. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your MongoDB connection:
```env
MONGO_URI=mongodb://localhost:27017/content_pipeline
PORT=5000
```

### MongoDB Setup

**Local MongoDB:**
- Install MongoDB Community Server
- Start MongoDB: `mongod`
- Use: `MONGO_URI=mongodb://localhost:27017/content_pipeline`

**MongoDB Atlas (Cloud):**
- Create cluster on MongoDB Atlas
- Get connection string
- Use: `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/content_pipeline`

## 🏃 Running the Application

### Development Mode

1. **Start the backend server:**
```bash
npm run dev
```
Server runs on `http://localhost:5000`

2. **Start the frontend dashboard:**
```bash
cd frontend
npm run dev
```
Dashboard runs on `http://localhost:5173`

3. **Access the application:**
Open `http://localhost:5173` in your browser

### Production Mode

1. **Build the frontend:**
```bash
cd frontend
npm run build
```

2. **Start the backend:**
```bash
npm start
```

## 📡 API Endpoints

### Articles
- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get single article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article

### Scraping
- `POST /api/scrape` - Trigger article scraping

### Example API Usage
```bash
# Get all articles
curl http://localhost:5000/api/articles

# Trigger scraping
curl -X POST http://localhost:5000/api/scrape
```

## 📊 Data Schema

### Article Model
```javascript
{
  title: String,                    // Article title
  original_url: String,             // Source URL (unique)
  original_content: String,         // Scraped content
  updated_content: String,          // AI-enhanced content (Phase 2)
  status: String,                   // 'Pending', 'Processing', 'Completed'
  reference_links: [String],        // Additional links
  published_date: Date              // Auto-generated timestamp
}
```

## 🔄 Development Phases

### Phase 1: Foundation ✅
- Web scraping implementation
- MongoDB integration
- Basic API endpoints
- Duplicate detection

### Phase 2: AI Enhancement 🔄
- Content processing pipeline
- AI-powered content enhancement
- Reference link extraction
- Advanced filtering

### Phase 3: Dashboard & Integration ✅
- React dashboard creation
- Real-time backend integration
- Interactive article management
- Responsive UI/UX design

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed:**
- Ensure MongoDB is running locally or check Atlas credentials
- Verify `MONGO_URI` in `.env`

**Port Already in Use:**
- Change `PORT` in `.env` or kill existing process

**Frontend Build Errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

**Scraper Not Working:**
- Website structure may have changed
- Update CSS selectors in `scraper/node-scraper.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

ISC License

## 📞 Support

For issues or questions, please open an issue on [GitHub](https://github.com/ADSingh2004/BeyoundChats-tasks/issues)

---

**Version**: 1.0.2  
**Phase**: 3 - Dashboard Complete  
**Last Updated**: December 31, 2025</content>
<parameter name="filePath">/workspaces/BeyoundChats-tasks/README.md

# BeyondChats Content Pipeline - Setup & Running

## Prerequisites
- Node.js (v18+)
- MongoDB (local or cloud connection)
- npm

## Installation

### 1. Install Root Dependencies
```bash
npm install
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

## Running the Application

### Option A: Development Mode (Recommended for Testing)

#### Terminal 1 - Start Backend Server
```bash
node api/server.js
```
The server will run on http://localhost:5000

#### Terminal 2 - Start Frontend Dev Server
```bash
cd frontend
npm run dev
```
The frontend will run on http://localhost:5173

**Access the app at http://localhost:5173**

---

### Option B: Production Build

#### Build Frontend
```bash
cd frontend
npm run build
cd ..
```

#### Run Backend with Production Frontend
```bash
node api/server.js
```
Then open http://localhost:5000 in your browser.

---

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb://localhost:27017/content_pipeline
PORT=5000
```

For MongoDB Atlas (cloud):
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/content_pipeline
PORT=5000
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Server status |
| GET | `/api/articles` | Get all articles (max 10) |
| GET | `/api/articles/:id` | Get single article by ID |
| POST/GET | `/api/scrape` | Trigger web scraper |
| PUT | `/api/articles/:id` | Update article |
| DELETE | `/api/articles/:id` | Delete article |

---

## Features

✅ **Web Scraping** - Automated article ingestion from BeyondChats blog
✅ **Database Integration** - MongoDB with Mongoose ODM
✅ **REST API** - Full CRUD operations
✅ **Interactive Dashboard** - Real-time React UI with Tailwind CSS
✅ **Live Status Tracking** - Monitor article processing states

---

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally: `mongod`
- Or update `MONGO_URI` to a cloud instance in `.env`

### Port Already in Use
- Backend: Change port in `.env` or code
- Frontend: Vite will auto-select next available port (5174, 5175, etc.)

### CORS Errors
- Backend has CORS enabled for all origins (`*`)
- Frontend URL is auto-detected based on current hostname

### Frontend Dependencies Missing
```bash
cd frontend
npm install
```

---

## Lint Check
```bash
cd frontend
npm run lint
```

---

**Happy Content Pipelining!** 🚀

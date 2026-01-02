import React, { useState } from 'react'; // Removed useEffect import
import axios from 'axios';
import ArticleCard from './components/ArticleCard';
import { Loader, AlertCircle, Zap, RotateCw, Database, Bot, LayoutTemplate } from 'lucide-react';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState(null);

  // --- API URL Configuration ---
  const getApiUrl = () => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // 1. Production (GitHub Pages) - MANUAL OVERRIDE REQUIRED
    // You must paste your Public Codespace Backend URL here for the deployed site to work.
    if (hostname.includes('github.io')) {
      // REPLACE THIS URL below with your actual Codespace backend URL (ending in -5000.app.github.dev)
      return 'https://probable-space-funicular-ww5qj6gwgw9fgg5p-5000.app.github.dev';
    }

    // 2. Development (GitHub Codespace Preview)
    if (hostname.includes('.app.github.dev')) {
      const baseHostname = hostname.replace(/-\d+\.app\.github\.dev/, '-5000.app.github.dev');
      return `https://${baseHostname}`;
    }

    // 3. Local Development (Localhost)
    if (hostname === 'localhost' || hostname === '127.0.0.1') return 'http://localhost:5000';

    // Fallback
    return `${protocol}//${hostname}:5000`;
  };

  const API_BASE_URL = getApiUrl();
  
  const axiosInstance = axios.create({ 
    baseURL: API_BASE_URL, 
    timeout: 300000 
  });

  // Fetch logic
  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/api/articles');
      if (Array.isArray(response.data)) setArticles(response.data);
      else setError('Invalid response format');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    setScraping(true);
    setError(null);
    try {
      await axiosInstance.get('/api/scrape');
      setTimeout(() => { 
        fetchArticles(); 
        setScraping(false); 
      }, 2000);
    } catch (err) {
      setError(`Scraping failed: ${err.message}`);
      setScraping(false);
    }
  };

  // --- CHANGED: Disabled Auto-Refresh ---
  // useEffect(() => { fetchArticles(); }, []);
  // --------------------------------------

  const stats = {
    total: articles.length,
    completed: articles.filter(a => a.status === 'Completed').length,
    pending: articles.filter(a => a.status !== 'Completed').length
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8 mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold tracking-wider uppercase">
                <Bot size={14} className="mr-2" /> Content Intelligence Pipeline
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                BeyondChats <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Pipeline</span>
              </h1>
              <p className="text-slate-500 max-w-lg">
                Automated article ingestion and AI-enhancement workflow.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full lg:w-auto">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <div className="text-3xl font-bold text-slate-800">{stats.total}</div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Total Articles</div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
                <div className="text-3xl font-bold text-emerald-600">{stats.completed}</div>
                <div className="text-xs text-emerald-600/80 font-medium uppercase tracking-wider mt-1">Enhanced</div>
              </div>
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-center">
                <div className="text-3xl font-bold text-amber-600">{stats.pending}</div>
                <div className="text-xs text-amber-600/80 font-medium uppercase tracking-wider mt-1">Pending</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={handleScrape}
                disabled={scraping || loading}
                className={`flex items-center justify-center px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all ${
                  scraping 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5'
                }`}
              >
                {scraping ? <Loader size={20} className="animate-spin" /> : <Zap size={20} className="mr-2" />}
                {scraping ? 'Running Scraper...' : 'Run Scraper'}
              </button>

              <button
                onClick={fetchArticles}
                disabled={loading}
                className="flex items-center justify-center px-6 py-3.5 rounded-xl font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                <RotateCw size={20} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center animate-pulse">
              <AlertCircle className="text-red-500 mr-3" size={20} />
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <LayoutTemplate size={20} className="mr-2 text-slate-400" />
              Recent Articles
            </h2>
            <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
              Live Connection: <span className="font-mono text-emerald-500">Active</span>
            </div>
          </div>

          {loading && articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white/50 rounded-3xl border border-slate-200 border-dashed">
              <Loader size={48} className="text-indigo-500 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Fetching data...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Database size={32} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Database Empty or Not Loaded</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-8">
                Click "Refresh" to load articles, or "Run Scraper" to fetch new content.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-12 text-center text-slate-400 text-sm font-medium">
          Powered by BeyondChats AI Core • v1.0.2
        </div>
      </div>
    </div>
  );
}

export default App;
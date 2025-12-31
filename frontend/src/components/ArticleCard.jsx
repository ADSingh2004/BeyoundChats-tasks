import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, AlertCircle, FileText, Sparkles, ExternalLink } from 'lucide-react';

const ArticleCard = ({ article }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Enhanced Status Badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Completed': 
        return (
          <span className="flex items-center text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            <Sparkles size={14} className="mr-1.5 text-emerald-500 fill-current" /> 
            AI Enhanced
          </span>
        );
      case 'Processing': 
        return (
          <span className="flex items-center text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            <Clock size={14} className="mr-1.5 animate-pulse" /> 
            Processing
          </span>
        );
      default: 
        return (
          <span className="flex items-center text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold">
            <AlertCircle size={14} className="mr-1.5" /> 
            Pending AI
          </span>
        );
    }
  };

  // Safe content accessors
  // This prevents the "Cannot read properties of undefined (reading 'substring')" error
  const originalContent = article.original_content || '';
  const updatedContent = article.updated_content || '';

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1">
      
      {/* Card Header */}
      <div className="p-6 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {getStatusBadge(article.status)}
              <span className="text-xs text-slate-400 font-medium flex items-center">
                <FileText size={12} className="mr-1" />
                ID: {article._id ? article._id.slice(-6) : 'N/A'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
              {article.title || 'Untitled Article'}
            </h2>
          </div>
          
          <a 
            href={article.original_url} 
            target="_blank" 
            rel="noreferrer" 
            onClick={(e) => e.stopPropagation()}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            title="View Original Source"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>

      {/* Expanded Content View */}
      <div className={`grid md:grid-cols-2 border-t border-slate-100 transition-all duration-500 ease-in-out ${isExpanded ? 'opacity-100 max-h-[800px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
        
        {/* LEFT: Original Content */}
        <div className="p-6 bg-slate-50/50">
          <h3 className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
            <FileText size={14} className="mr-2" /> Original Source
          </h3>
          <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed font-serif bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <p className="whitespace-pre-wrap">
              {originalContent ? `${originalContent.substring(0, 600)}...` : 'No content available preview.'}
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              <a href={article.original_url} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 font-semibold hover:underline">
                Read full article on source →
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT: AI Enhanced Content */}
        <div className="p-6 bg-indigo-50/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Sparkles size={100} />
          </div>
          
          <h3 className="flex items-center text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4 relative z-10">
            <Sparkles size={14} className="mr-2" /> AI Enhanced Version
          </h3>
          
          {updatedContent ? (
            <div className="prose prose-sm max-w-none text-slate-800 bg-white p-5 rounded-xl border border-indigo-100 shadow-sm relative z-10">
              <p>{updatedContent}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-slate-400 bg-white/50 rounded-xl border-2 border-dashed border-slate-200 relative z-10">
              <div className="bg-slate-50 p-3 rounded-full mb-3">
                <Clock size={24} className="text-slate-400" />
              </div>
              <p className="text-sm font-medium">Waiting for Phase 2 Processing</p>
              <p className="text-xs text-slate-400 mt-1">AI agent inactive</p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-2 bg-slate-50 hover:bg-slate-100 border-t border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center justify-center transition-colors"
      >
        {isExpanded ? (
          <><ChevronUp size={14} className="mr-2" /> Collapse Details</>
        ) : (
          <><ChevronDown size={14} className="mr-2" /> Compare Versions</>
        )}
      </button>
    </div>
  );
};

export default ArticleCard;
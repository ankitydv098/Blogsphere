import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, User, Tag, Sparkles, ArrowRight } from 'lucide-react';
import { mockService } from '../mock/mockService';
import { motion, AnimatePresence } from 'framer-motion';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open search modal
          window.dispatchEvent(new CustomEvent('toggle-search-modal'));
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await mockService.searchPosts(query, 0, 5);
        setResults(res.content || []);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectPost = (postId) => {
    onClose();
    navigate(`/blog/${postId}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <Search className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-3 flex-shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search articles, tags, authors... (Press Esc to exit)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-slate-900 dark:text-slate-100 text-sm font-medium focus:outline-none placeholder-slate-400 dark:placeholder-slate-500"
            />
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </form>

          {/* Body Content */}
          <div className="max-h-96 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="py-8 text-center text-xs font-semibold text-slate-400 dark:text-slate-500 animate-pulse">
                Searching tech stories...
              </div>
            ) : query.trim() === '' ? (
              <div className="py-6 px-4 space-y-3">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Popular Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Java 21', 'Spring Security 6', 'India', 'System Architecture', 'Virtual Threads', 'Spring AI'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        onClose();
                        navigate(`/?search=${encodeURIComponent(tag)}`);
                      }}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="h-3 w-3 text-indigo-500" />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No matching articles for "{query}"</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Try searching for Java, Spring, India, or Security</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2">
                  Results ({results.length})
                </div>
                {results.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => handleSelectPost(post.id)}
                    className="group p-3 rounded-2xl hover:bg-indigo-50/70 dark:hover:bg-slate-800/80 cursor-pointer transition-all duration-150 flex items-start gap-3 border border-transparent hover:border-indigo-100 dark:hover:border-slate-700"
                  >
                    <img
                      src={post.imageName}
                      alt={post.title}
                      className="h-12 w-12 rounded-xl object-cover flex-shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {post.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-normal">
                        {post.content.replace(/[^a-zA-Z0-9 ]/g, ' ')}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold">
                          <Tag className="h-3 w-3" />
                          {post.category?.categoryName}
                        </span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all self-center flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer bar */}
          <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px] shadow-2xs">↵ Enter</kbd> to search all
            </span>
            <span>BlogSphere Command Palette</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SearchModal;

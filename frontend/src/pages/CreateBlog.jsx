import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api/postApi';
import { getCategories } from '../api/categoryApi';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, Image, Eye, Edit3, ArrowLeft, Send } from 'lucide-react';

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'
];

const CreateBlog = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageName, setImageName] = useState(COVER_PRESETS[0]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      const cats = await getCategories();
      setCategories(cats || []);
      if (cats && cats.length > 0) {
        setCategoryId(cats[0].id);
      }
    };
    fetchCats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      const newPost = await createPost({
        title,
        content,
        categoryId: Number(categoryId),
        imageName
      });
      navigate(`/blog/${newPost.id}`);
    } catch (err) {
      console.error('Failed to create post', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-full">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'write' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs' : 'text-slate-500'
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'preview' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs' : 'text-slate-500'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || !title.trim() || !content.trim()}
            className="px-5 py-2 rounded-full font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Publish Story</span>
          </button>
        </div>
      </div>

      {activeTab === 'write' ? (
        <form className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          
          {/* Title Input */}
          <textarea
            rows={2}
            placeholder="Article Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none resize-none"
          ></textarea>

          {/* Category Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </div>

            {/* Cover Image Selector */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                Cover Image Preset
              </label>
              <div className="flex gap-2">
                {COVER_PRESETS.map((preset, idx) => (
                  <img
                    key={idx}
                    src={preset}
                    alt={`Preset ${idx}`}
                    onClick={() => setImageName(preset)}
                    className={`h-9 w-14 rounded-xl object-cover cursor-pointer border-2 transition-all ${
                      imageName === preset ? 'border-indigo-600 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Markdown Content Area */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
              Content (Supports Markdown headers ###, code blocks ```)
            </label>
            <textarea
              rows={14}
              placeholder="Write your technical article content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            ></textarea>
          </div>

        </form>
      ) : (
        /* Preview Tab */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">
              {title || 'Untitled Article'}
            </h1>
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-bold">
              <span>{categories.find(c => Number(c.id) === Number(categoryId))?.categoryName}</span>
            </div>
          </div>

          <div className="h-64 rounded-2xl overflow-hidden">
            <img src={imageName} alt="Cover Preview" className="w-full h-full object-cover" />
          </div>

          <div className="prose dark:prose-invert text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            {content || 'No content written yet.'}
          </div>
        </div>
      )}

    </div>
  );
};

export default CreateBlog;

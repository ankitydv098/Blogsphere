import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePost } from '../api/postApi';
import { getCategories } from '../api/categoryApi';
import { ArrowLeft, Save, Edit3, Eye } from 'lucide-react';

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'
];

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageName, setImageName] = useState(COVER_PRESETS[0]);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const cats = await getCategories();
        setCategories(cats || []);

        const post = await getPostById(id);
        setTitle(post.title);
        setContent(post.content);
        setCategoryId(post.category?.id || (cats[0] && cats[0].id));
        setImageName(post.imageName || COVER_PRESETS[0]);
      } catch (err) {
        console.error('Failed to load post for editing', err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      await updatePost(id, {
        title,
        content,
        categoryId: Number(categoryId),
        imageName
      });
      navigate(`/blog/${id}`);
    } catch (err) {
      console.error('Failed to update post', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-xs text-slate-400">Loading editor...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <button
          onClick={handleUpdate}
          disabled={submitting || !title.trim() || !content.trim()}
          className="px-5 py-2 rounded-full font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
        >
          <Save className="h-3.5 w-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      <form className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <textarea
          rows={2}
          placeholder="Article Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none resize-none"
        ></textarea>

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

        <div>
          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
            Content (Supports Markdown)
          </label>
          <textarea
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none"
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;

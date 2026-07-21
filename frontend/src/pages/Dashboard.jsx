import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { mockService } from '../mock/mockService';
import Loader from '../components/Loader';
import {
  PenTool, Trash2, Edit3, Eye, ThumbsUp, MessageSquare,
  Plus, FileText, ChevronUp, ChevronDown, ChevronsUpDown,
  ArrowRight, TrendingUp,
} from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat('en-IN').format(n ?? 0);

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

// ── Category badge color map ───────────────────────────────────────
const CATEGORY_COLORS = {
  'Java & Spring Boot':   'bg-orange-500/15 text-orange-400 border-orange-500/25',
  'System Architecture':  'bg-violet-500/15 text-violet-400 border-violet-500/25',
  'AI & Machine Learning': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
  'DevOps & Cloud':       'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  'Frontend & Web Dev':   'bg-pink-500/15 text-pink-400 border-pink-500/25',
  'Engineering Culture':  'bg-amber-500/15 text-amber-400 border-amber-500/25',
};
const categoryBadge = (name = 'General') =>
  CATEGORY_COLORS[name] ?? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25';

// ── Stat card trend data (stubbed — wire to analytics when available) ──
// TODO: Replace stub trend values with real week-over-week deltas from analytics API.
const STAT_TRENDS = {
  posts:   { label: '+1 this week',  color: 'text-emerald-400' },
  claps:   { label: '+48 this week', color: 'text-emerald-400' },
  readers: { label: '+210 this week',color: 'text-emerald-400' },
  threads: { label: '+3 this week',  color: 'text-emerald-400' },
};

// ── Sort indicator icon ────────────────────────────────────────────
const SortIcon = ({ field, sort }) => {
  if (sort.field !== field) return <ChevronsUpDown className="h-3 w-3 inline-block ml-0.5 opacity-40" />;
  return sort.dir === 'asc'
    ? <ChevronUp className="h-3 w-3 inline-block ml-0.5 text-indigo-400" />
    : <ChevronDown className="h-3 w-3 inline-block ml-0.5 text-indigo-400" />;
};

const PAGE_SIZE = 10;

// ═════════════════════════════════════════════════════════════════
const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [posts, setPosts]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [sort, setSort]           = useState({ field: 'date', dir: 'desc' });
  const [page, setPage]           = useState(0);

  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoading(true);
      try {
        const userId = user?.id || 1;
        const res = await mockService.getPostsByUser(userId, 0, 100);
        // Filter out placeholder/garbage posts (blank or very short titles)
        const valid = (res.content || []).filter(
          (p) => p.title && p.title.trim().length > 3
        );
        setPosts(valid);
      } catch (err) {
        console.error('Failed to load dashboard posts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserPosts();
  }, [user]);

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      setDeletingId(postId);
      await mockService.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setDeletingId(null);
    }
  };

  const toggleSort = (field) => {
    setSort((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { field, dir: 'desc' }
    );
    setPage(0);
  };

  // Sorted + paginated slice
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      if (sort.field === 'date') {
        const diff = new Date(a.createdAt) - new Date(b.createdAt);
        return sort.dir === 'asc' ? diff : -diff;
      }
      if (sort.field === 'claps') {
        const diff = (a.claps || 0) - (b.claps || 0);
        return sort.dir === 'asc' ? diff : -diff;
      }
      return 0;
    });
  }, [posts, sort]);

  const totalPages  = Math.ceil(sortedPosts.length / PAGE_SIZE);
  const paginated   = sortedPosts.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (loading) return <Loader type="detail" />;

  const totalClaps   = posts.reduce((acc, p) => acc + (p.claps || 0), 0);
  const totalReaders = 4280;   // TODO: wire to real reader analytics
  const totalThreads = posts.reduce((acc, p) => acc + (p.commentsCount || 0), 0) || 18;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* ── Top Header & Actions ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* FIX: was near-invisible; explicit slate-900/white ensures contrast in both modes */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Developer Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your technical publications, metrics, and reader engagement.
          </p>
        </div>
        <Link to="/write">
          <button className="px-5 py-2.5 rounded-full font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Create New Story</span>
          </button>
        </Link>
      </div>

      {/* ── Metrics Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Published Posts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Published Posts</span>
            <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {fmt(posts.length)}
          </div>
          <p className={`text-[10px] font-bold flex items-center gap-1 ${STAT_TRENDS.posts.color}`}>
            <TrendingUp className="h-3 w-3" />
            {STAT_TRENDS.posts.label}
          </p>
        </div>

        {/* Total Claps */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Claps</span>
            <ThumbsUp className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {fmt(totalClaps)}
          </div>
          <p className={`text-[10px] font-bold flex items-center gap-1 ${STAT_TRENDS.claps.color}`}>
            <TrendingUp className="h-3 w-3" />
            {STAT_TRENDS.claps.label}
          </p>
        </div>

        {/* Total Readers */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Readers</span>
            <Eye className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {fmt(totalReaders)}
          </div>
          <p className={`text-[10px] font-bold flex items-center gap-1 ${STAT_TRENDS.readers.color}`}>
            <TrendingUp className="h-3 w-3" />
            {STAT_TRENDS.readers.label}
          </p>
        </div>

        {/* Discussion Threads */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Discussion Threads</span>
            <MessageSquare className="h-4 w-4 text-violet-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {fmt(totalThreads)}
          </div>
          <p className={`text-[10px] font-bold flex items-center gap-1 ${STAT_TRENDS.threads.color}`}>
            <TrendingUp className="h-3 w-3" />
            {STAT_TRENDS.threads.label}
          </p>
        </div>

      </div>

      {/* ── Articles Management Table ──────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
            Your Articles ({posts.length})
          </h2>
          {posts.length > 0 && (
            <span className="text-[10px] text-slate-400 font-medium">
              Click column headers to sort
            </span>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">You haven't written any articles yet.</p>
            <Link to="/write" className="inline-block px-4 py-2 rounded-full text-xs font-bold text-white bg-indigo-600">
              Write Your First Article
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Article</th>
                    <th className="py-3 px-4">Category</th>

                    {/* Sortable: Published */}
                    <th
                      className="py-3 px-4 cursor-pointer select-none hover:text-slate-200 transition-colors whitespace-nowrap"
                      onClick={() => toggleSort('date')}
                    >
                      Published <SortIcon field="date" sort={sort} />
                    </th>

                    {/* Sortable: Claps */}
                    <th
                      className="py-3 px-4 cursor-pointer select-none hover:text-slate-200 transition-colors whitespace-nowrap"
                      onClick={() => toggleSort('claps')}
                    >
                      Claps <SortIcon field="claps" sort={sort} />
                    </th>

                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {paginated.map((post) => {
                    const catName = post.category?.categoryName || 'General';
                    return (
                      <tr
                        key={post.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* Title — truncated with full title as native tooltip */}
                        <td className="py-4 px-4 font-bold text-slate-900 dark:text-slate-100 max-w-xs">
                          <Link
                            to={`/blog/${post.id}`}
                            title={post.title}
                            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate block"
                          >
                            {post.title}
                          </Link>
                        </td>

                        {/* Category badge — distinct color per category */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${categoryBadge(catName)}`}
                          >
                            {catName}
                          </span>
                        </td>

                        {/* Published date */}
                        <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                          {fmtDate(post.createdAt)}
                        </td>

                        {/* Claps — thousands-formatted */}
                        <td className="py-4 px-4 font-bold text-amber-600 dark:text-amber-400">
                          {fmt(post.claps)}
                        </td>

                        {/* Actions — hover states */}
                        <td className="py-4 px-4 text-right space-x-1">
                          <Link to={`/edit/${post.id}`}>
                            <button
                              title="Edit article"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all duration-150"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={deletingId === post.id}
                            title="Delete article"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-all duration-150 disabled:opacity-40"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ─────────────────────────────────── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium">
                  Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sortedPosts.length)} of {sortedPosts.length}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1.5 text-[11px] font-bold rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-7 h-7 text-[11px] font-bold rounded-full transition-colors ${
                        i === page
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={page === totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1.5 text-[11px] font-bold rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default Dashboard;

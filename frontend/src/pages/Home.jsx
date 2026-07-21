import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getPosts, searchPosts, getPostsByCategory } from '../api/postApi';
import { getCategories } from '../api/categoryApi';
import { mockService } from '../mock/mockService';
import { ANKIT, ANKIT_SKILLS } from '../mock/mockData';
import BlogCard from '../components/BlogCard';
import Loader from '../components/Loader';
import {
  Search, Flame, TrendingUp, RefreshCw,
  Code2, MapPin, ExternalLink,
  ChevronRight, Tag, BookOpen, Terminal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Avatar initials helper ─────────────────────────────────────────
const AvatarInitials = ({ name, className = '' }) => {
  const initials = name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'AK';
  return (
    <div className={`avatar-initials ${className}`}>
      {initials}
    </div>
  );
};

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamQuery = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(searchParamQuery);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const trendingTopics = mockService.getTrendingTopics();

  useEffect(() => {
    setSearchQuery(searchParamQuery);
    if (searchParamQuery) setSelectedCategory(null);
    setPage(0);
  }, [searchParamQuery]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories', error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let data;
        if (searchParamQuery) {
          data = await searchPosts(searchParamQuery, page, 6);
        } else if (selectedCategory) {
          data = await getPostsByCategory(selectedCategory, page, 6);
        } else {
          data = await getPosts(page, 6);
        }
        setPosts(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error('Failed to load posts', error);
        setPosts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [searchParamQuery, selectedCategory, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    setSelectedCategory(null);
    setSearchParams(trimmed ? { search: trimmed } : {});
    setPage(0);
  };

  const handleTrendingTopicClick = (keyword) => {
    setSelectedCategory(null);
    setSearchQuery(keyword);
    setSearchParams({ search: keyword });
    setPage(0);
  };

  const handleCategorySelect = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
      setSearchParams({});
    }
    setPage(0);
  };

  const isFiltered = !!searchParamQuery || !!selectedCategory;

  // Mixed card layout: featured → medium pair → compact list
  const featuredPost = posts[0] ?? null;
  const mediumPosts = posts.slice(1, 3);
  const compactPosts = posts.slice(3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

      {/* ── Hero — Personal ───────────────────────────────────── */}
      {!isFiltered && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-3xl bg-slate-950 dark:bg-slate-950 border border-slate-800/80 shadow-2xl"
        >
          {/* Ambient glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 px-8 sm:px-12 py-12 sm:py-16 grid lg:grid-cols-5 gap-10 items-center">

            {/* Left Content */}
            <div className="lg:col-span-3 space-y-5">
              {/* Greeting */}
              <div className="flex items-center gap-3">
                <AvatarInitials
                  name="Ankit Kumar"
                  className="h-12 w-12 rounded-2xl text-sm shadow-lg shadow-indigo-500/30 flex-shrink-0"
                />
                <div>
                  <p className="text-slate-400 text-xs font-medium">Full Stack Portfolio</p>
                  <p className="text-white text-sm font-bold">@ankitydv098 · West Bengal, India</p>
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
                  Hi, I'm Ankit Kumar{' '}
                  <span className="inline-block animate-float">👋</span>
                </h1>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['Java Backend Developer', 'Spring Boot', 'REST APIs', 'DSA', 'Backend Architecture'].map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 border border-indigo-500/25 text-indigo-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed max-w-lg font-normal">
                I'm a Computer Science Engineering student passionate about building scalable backend systems
                using Java and Spring Boot. I enjoy solving DSA problems, designing REST APIs, learning system
                design, and creating production-ready applications.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="https://github.com/ankitydv098"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors shadow-md"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  GitHub
                </a>
                <a
                  href="https://linkedin.com/in/ankitkumar"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-blue-400"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
                <button
                  onClick={() => handleTrendingTopicClick('Java 21')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold hover:bg-indigo-600/30 transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Read Blogs
                </button>
              </div>

              {/* Real Achievement Badges */}
              <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800/80 pt-5">
                {[
                  { label: '100+ LeetCode', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                  { label: 'Java Backend', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
                  { label: 'Spring Boot', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                  { label: 'Open to Internship', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
                ].map(badge => (
                  <span
                    key={badge.label}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border ${badge.color}`}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Quick Stats Card */}
            <div className="lg:col-span-2 hidden lg:block">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Developer Stats</p>
                {[
                  { icon: <Code2 className="h-4 w-4 text-amber-400" />, label: 'LeetCode Problems', value: '100+' },
                  { icon: <Terminal className="h-4 w-4 text-indigo-400" />, label: 'Tech Articles', value: '6' },
                  { icon: <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-slate-300"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>, label: 'GitHub Repos', value: '12+' },
                  { icon: <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-emerald-400"><path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>, label: 'Hackathons', value: '2' },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-xs text-slate-400 font-medium">
                      {icon}
                      <span>{label}</span>
                    </div>
                    <span className="text-sm font-black text-white">{value}</span>
                  </div>
                ))}
                <div className="pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] text-emerald-400 font-bold">Seeking SDE Internship 2027</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* ── Category Chips ─────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">
            Filter by Topic
          </h2>
          {selectedCategory && (
            <button
              onClick={() => { setSelectedCategory(null); setSearchParams({}); }}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Clear
            </button>
          )}
        </div>
        {categoriesLoading ? (
          <Loader type="category" />
        ) : (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => { setSelectedCategory(null); setSearchParams({}); setSearchQuery(''); }}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                !selectedCategory && !searchParamQuery
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-transparent shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
              }`}
            >
              All Topics
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-700'
                }`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Main Content Grid ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Left: Posts Feed */}
        <div className="lg:col-span-8 space-y-6">

          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              {searchParamQuery
                ? `Results for "${searchParamQuery}"`
                : selectedCategory
                  ? `${categories.find(c => c.id === selectedCategory)?.categoryName} Articles`
                  : 'Latest Articles'}
            </h2>
            {isFiltered && (
              <button
                onClick={() => { setSelectedCategory(null); setSearchQuery(''); setSearchParams({}); }}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" /> Reset
              </button>
            )}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => <Loader key={i} type="card" />)}
            </div>

          /* Empty State */
          ) : posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">No articles found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                No stories match {searchParamQuery ? `"${searchParamQuery}"` : 'that filter'}. Try searching for "Java", "Spring", or "Docker".
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSearchParams({}); setSelectedCategory(null); }}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Clear filter & show all
              </button>
            </motion.div>

          ) : (
            <div className="space-y-6">
              {/* Featured Card — first post */}
              {featuredPost && <BlogCard key={featuredPost.id} post={featuredPost} variant="featured" />}

              {/* Medium Cards — posts 1 & 2 in 2-col grid */}
              {mediumPosts.length > 0 && (
                <div className={`grid gap-5 ${mediumPosts.length > 1 ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
                  {mediumPosts.map(post => (
                    <BlogCard key={post.id} post={post} variant="medium" />
                  ))}
                </div>
              )}

              {/* Compact Cards — rest of the posts */}
              {compactPosts.length > 0 && (
                <div className="space-y-3">
                  {compactPosts.map(post => (
                    <BlogCard key={post.id} post={post} variant="compact" />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-full hover:border-indigo-500 hover:text-indigo-600 transition-colors disabled:opacity-40"
              >
                ← Previous
              </button>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Page {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-full hover:border-indigo-500 hover:text-indigo-600 transition-colors disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {/* Right: Sidebar */}
        <div className="lg:col-span-4 space-y-6">

          {/* Search */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Search Articles</h3>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400">⌘K</kbd>
            </div>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Java, Spring, Docker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-full py-2.5 pl-4 pr-9 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition-colors"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-slate-400 hover:text-indigo-600 transition-colors">
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Trending Topics */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              Trending Topics
            </h3>
            <ul className="space-y-3">
              {trendingTopics.map((topic, idx) => (
                <li key={topic.id}>
                  <button
                    type="button"
                    onClick={() => handleTrendingTopicClick(topic.query)}
                    className="group w-full text-left flex items-start justify-between gap-2 focus:outline-none"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 mt-0.5 w-3 shrink-0">{idx + 1}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          # {topic.title}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 line-clamp-1">
                          {topic.desc}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap shrink-0 pt-0.5">{topic.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* About the Author */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">About the Author</h3>
            <div className="flex items-center gap-3">
              <AvatarInitials
                name="Ankit Kumar"
                className="h-11 w-11 rounded-xl text-sm flex-shrink-0 shadow-md shadow-indigo-500/20"
              />
              <div>
                <Link to="/profile/1" className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Ankit Kumar
                </Link>
                <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">Java Backend Developer</p>
                <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3" /> West Bengal, India
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              CSE (Cyber Security) student at Haldia Institute of Technology. Building production-ready backends with Spring Boot.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['Java', 'Spring Boot', 'JWT', 'MySQL', 'Docker', 'DSA'].map(skill => (
                <span key={skill} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://github.com/ankitydv098"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
              </a>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <Link to="/profile/1" className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                <ChevronRight className="h-3 w-3" /> Full Profile
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;

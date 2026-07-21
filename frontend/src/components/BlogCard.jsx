import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Clock, ThumbsUp, Tag, ArrowUpRight } from 'lucide-react';
import { mockService } from '../mock/mockService';
import { motion } from 'framer-motion';

// ── Helper: clean plain text excerpt ─────────────────────────────
const getExcerpt = (content = '', maxLen = 120) => {
  const plain = content.replace(/```[\s\S]*?```/g, '').replace(/[#*`_>~\[\]]/g, '').trim();
  return plain.length > maxLen ? plain.slice(0, maxLen) + '...' : plain;
};

// ── Date formatter ────────────────────────────────────────────────
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// ── Avatar Initials ───────────────────────────────────────────────
const AvatarInitials = ({ name, className = '' }) => {
  const initials = name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'AK';
  return <div className={`avatar-initials ${className}`}>{initials}</div>;
};

// ══════════════════════════════════════════════════════════════════
// FEATURED CARD — full-width, large image top, magazine feel
// ══════════════════════════════════════════════════════════════════
const FeaturedCard = ({ post, claps, isClapped, isBookmarked, onClap, onBookmark }) => (
  <motion.article
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg dark:hover:shadow-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
  >
    {/* Image */}
    <Link to={`/blog/${post.id}`} className="block relative h-52 sm:h-64 overflow-hidden">
      <img
        src={post.imageName}
        alt={post.title}
        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />
      {post.category && (
        <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-600/90 backdrop-blur-sm text-white">
          {post.category.categoryName}
        </span>
      )}
      {post.readTime && (
        <span className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/60 backdrop-blur-sm text-slate-200">
          <Clock className="h-3 w-3" /> {post.readTime}
        </span>
      )}
    </Link>

    {/* Content */}
    <div className="p-5 sm:p-6 space-y-3">
      <Link to={`/profile/${post.user?.id}`} className="flex items-center gap-2 w-fit group/a">
        <AvatarInitials name={post.user?.name} className="h-6 w-6 rounded-lg text-[10px] flex-shrink-0" />
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover/a:text-indigo-600 dark:group-hover/a:text-indigo-400 transition-colors">
          {post.user?.name}
        </span>
        <span className="text-[11px] text-slate-400">· {formatDate(post.createdAt)}</span>
      </Link>

      <Link to={`/blog/${post.id}`} className="block space-y-2">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug line-clamp-2">
          {post.title}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
          {getExcerpt(post.content, 140)}
        </p>
      </Link>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={onClap}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
              isClapped
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 scale-110'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600'
            }`}
          >
            <ThumbsUp className={`h-3.5 w-3.5 ${isClapped ? 'fill-amber-500 text-amber-500' : ''}`} />
            {claps}
          </button>
          {post.tags?.[0] && (
            <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Tag className="h-2.5 w-2.5" /> {post.tags[0]}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onBookmark} className={`p-1.5 rounded-full transition-colors ${isBookmarked ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
          <Link to={`/blog/${post.id}`} className="p-1.5 rounded-full text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  </motion.article>
);

// ══════════════════════════════════════════════════════════════════
// MEDIUM CARD — square image top, used in 2-column grid
// ══════════════════════════════════════════════════════════════════
const MediumCard = ({ post, claps, isClapped, isBookmarked, onClap, onBookmark }) => (
  <motion.article
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md dark:hover:shadow-slate-950/50 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col"
  >
    <Link to={`/blog/${post.id}`} className="relative block h-40 overflow-hidden flex-shrink-0">
      <img
        src={post.imageName}
        alt={post.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {post.category && (
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/70 backdrop-blur-sm text-white">
          {post.category.categoryName}
        </span>
      )}
    </Link>

    <div className="p-4 flex flex-col flex-1 space-y-2.5">
      <Link to={`/blog/${post.id}`} className="block flex-1">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
          {post.title}
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed font-normal">
          {getExcerpt(post.content, 80)}
        </p>
      </Link>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <AvatarInitials name={post.user?.name} className="h-5 w-5 rounded-md text-[9px] flex-shrink-0" />
          <span className="font-medium text-slate-600 dark:text-slate-400 truncate max-w-[80px]">{post.user?.name?.split(' ')[0]}</span>
          {post.readTime && <><span>·</span><Clock className="h-3 w-3" /><span>{post.readTime}</span></>}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onClap}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold transition-all ${
              isClapped ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30'
            }`}
          >
            <ThumbsUp className={`h-3 w-3 ${isClapped ? 'fill-amber-500' : ''}`} />
            {claps}
          </button>
          <button onClick={onBookmark} className={`p-1 rounded-full transition-colors ${isBookmarked ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
            <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  </motion.article>
);

// ══════════════════════════════════════════════════════════════════
// COMPACT CARD — horizontal, minimal, thumbnail right
// ══════════════════════════════════════════════════════════════════
const CompactCard = ({ post, claps, isClapped, isBookmarked, onClap, onBookmark }) => (
  <motion.article
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.25 }}
    className="group flex items-center gap-4 p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all duration-200"
  >
    <Link to={`/blog/${post.id}`} className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden">
      <img
        src={post.imageName}
        alt={post.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </Link>
    <div className="flex-1 min-w-0 space-y-1">
      <Link to={`/blog/${post.id}`} className="block">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
          {post.title}
        </h3>
      </Link>
      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
        {post.category && (
          <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            {post.category.categoryName}
          </span>
        )}
        {post.readTime && <><Clock className="h-3 w-3" />{post.readTime}</>}
      </div>
    </div>
    <div className="flex items-center gap-1 flex-shrink-0">
      <button
        onClick={onClap}
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold transition-all ${
          isClapped ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' : 'text-slate-400 hover:text-amber-600'
        }`}
      >
        <ThumbsUp className={`h-3 w-3 ${isClapped ? 'fill-amber-500' : ''}`} />
        {claps}
      </button>
      <button
        onClick={onBookmark}
        className={`p-1.5 rounded-full transition-colors ${isBookmarked ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
      >
        <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
      </button>
    </div>
  </motion.article>
);

// ══════════════════════════════════════════════════════════════════
// DEFAULT CARD — original horizontal layout (fallback)
// ══════════════════════════════════════════════════════════════════
const DefaultCard = ({ post, claps, isClapped, isBookmarked, onClap, onBookmark }) => (
  <motion.article
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="group flex flex-col sm:flex-row gap-5 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
  >
    <Link to={`/blog/${post.id}`} className="w-full sm:w-44 h-36 flex-shrink-0 rounded-xl overflow-hidden relative">
      <img src={post.imageName} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      {post.category && (
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/70 text-white">
          {post.category.categoryName}
        </span>
      )}
    </Link>
    <div className="flex-1 min-w-0 space-y-2.5">
      <Link to={`/profile/${post.user?.id}`} className="flex items-center gap-2 w-fit group/a">
        <AvatarInitials name={post.user?.name} className="h-6 w-6 rounded-lg text-[10px] flex-shrink-0" />
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover/a:text-indigo-600 transition-colors">{post.user?.name}</span>
        <span className="text-[11px] text-slate-400">· {formatDate(post.createdAt)}</span>
      </Link>
      <Link to={`/blog/${post.id}`} className="block">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
          {post.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
          {getExcerpt(post.content)}
        </p>
      </Link>
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button onClick={onClap} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${isClapped ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-600'}`}>
            <ThumbsUp className={`h-3.5 w-3.5 ${isClapped ? 'fill-amber-500 text-amber-500' : ''}`} />
            {claps}
          </button>
          {post.readTime && (
            <span className="flex items-center gap-1 text-[10px] text-slate-400"><Clock className="h-3 w-3" />{post.readTime}</span>
          )}
        </div>
        <button onClick={onBookmark} className={`p-1.5 rounded-full transition-colors ${isBookmarked ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  </motion.article>
);

// ══════════════════════════════════════════════════════════════════
// MAIN EXPORT — BlogCard with variant prop
// ══════════════════════════════════════════════════════════════════
const BlogCard = ({ post, variant = 'default' }) => {
  const [claps, setClaps] = useState(post.claps || 0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isClapped, setIsClapped] = useState(false);

  useEffect(() => {
    const saved = mockService.getBookmarks();
    setIsBookmarked(saved.includes(post.id));
  }, [post.id]);

  const handleClap = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isClapped) return;
    setIsClapped(true);
    setClaps(prev => prev + 1);
    await mockService.toggleClap(post.id);
    setTimeout(() => setIsClapped(false), 600);
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = await mockService.toggleBookmark(post.id);
    setIsBookmarked(newState);
  };

  const sharedProps = { post, claps, isClapped, isBookmarked, onClap: handleClap, onBookmark: handleBookmark };

  if (variant === 'featured') return <FeaturedCard {...sharedProps} />;
  if (variant === 'medium') return <MediumCard {...sharedProps} />;
  if (variant === 'compact') return <CompactCard {...sharedProps} />;
  return <DefaultCard {...sharedProps} />;
};

export default BlogCard;

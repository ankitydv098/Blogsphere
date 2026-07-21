import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPostById, getPostComments, addComment } from '../api/postApi';
import { mockService } from '../mock/mockService';
import Loader from '../components/Loader';
import BlogCard from '../components/BlogCard';
import confetti from 'canvas-confetti';
import { ThumbsUp, Bookmark, Share2, Clock, Calendar, ArrowLeft, MessageSquare, Send, Check, User, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  const [claps, setClaps] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  // Scroll Progress listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const current = (window.scrollY / totalHeight) * 100;
        setScrollProgress(current);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchPostDetails = async () => {
      setLoading(true);
      try {
        const data = await getPostById(id);
        setPost(data);
        setClaps(data.claps || 0);

        const comms = await getPostComments(id);
        setComments(comms || []);

        // Bookmarks check
        const bookmarks = mockService.getBookmarks();
        setIsBookmarked(bookmarks.includes(Number(id)));

        // Related posts
        const allPostsRes = await mockService.getPosts(0, 4);
        const related = (allPostsRes.content || []).filter(p => p.id !== Number(id)).slice(0, 2);
        setRelatedPosts(related);
      } catch (error) {
        console.error('Failed to load post details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const handleClap = async () => {
    setClaps(prev => prev + 1);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.85 }
    });
    await mockService.toggleClap(id);
  };

  const handleBookmark = async () => {
    const newState = await mockService.toggleBookmark(id);
    setIsBookmarked(newState);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      const newComment = await addComment(id, commentText);
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (loading) {
    return <Loader type="detail" />;
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Article not found</h2>
        <Link to="/" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
          Return to Home Feed
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <>
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Feed</span>
        </button>

        {/* Hero Header */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            {post.category && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                {post.category.categoryName}
              </span>
            )}
            <span className="text-xs text-slate-400 font-medium">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-50 tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Author Card */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Link to={`/profile/${post.user?.id}`}>
                <img
                  src={post.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                  alt={post.user?.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
              </Link>
              <div>
                <Link to={`/profile/${post.user?.id}`} className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 transition-colors block">
                  {post.user?.name}
                </Link>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{post.user?.bio || 'Software Architect'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  isFollowing
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20'
                }`}
              >
                {isFollowing ? 'Following' : '+ Follow Author'}
              </button>

              <div className="flex items-center gap-1.5 text-slate-400">
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-full transition-colors ${
                    isBookmarked
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-indigo-600 dark:fill-indigo-400' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 max-h-[480px]">
          <img
            src={post.imageName}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Article Body */}
          <div className="lg:col-span-8 space-y-6">
            <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed font-normal space-y-4">
              {post.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('### ')) {
                  return <h3 key={idx} className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-6 mb-2">{paragraph.replace('### ', '')}</h3>;
                }
                if (paragraph.startsWith('```')) {
                  const lines = paragraph.split('\n');
                  const code = lines.slice(1, -1).join('\n');
                  return (
                    <div key={idx} className="my-4 rounded-2xl bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-x-auto border border-slate-800 shadow-lg">
                      <pre><code>{code}</code></pre>
                    </div>
                  );
                }
                return <p key={idx} className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">{paragraph}</p>;
              })}
            </div>

            {/* Claps Celebration Banner */}
            <div className="py-8 my-10 border-y border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Did you find this architectural deep dive valuable?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Give a clap to support the author and boost visibility.</p>
              </div>
              <button
                onClick={handleClap}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 hover:scale-105 transition-all duration-200"
              >
                <ThumbsUp className="h-4 w-4 fill-white" />
                <span>{claps} Claps</span>
              </button>
            </div>

            {/* Comments Section */}
            <div className="space-y-6 pt-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Discussion ({comments.length})
              </h3>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="space-y-3">
                <textarea
                  rows={3}
                  placeholder="What are your thoughts on this architecture?"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-2xl p-4 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-colors"
                ></textarea>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !commentText.trim()}
                    className="px-5 py-2 rounded-full font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Post Comment</span>
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4 pt-2">
                {comments.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={c.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                          alt={c.user?.name}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{c.user?.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-normal leading-relaxed pl-9">{c.content}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Table of Contents & Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm sticky top-24 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                Table of Contents
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">1. Introduction & Background</li>
                <li className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">2. Core Architectural Changes</li>
                <li className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">3. Practical Code Implementation</li>
                <li className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">4. Performance Benchmarks</li>
              </ul>
            </div>
          </div>

        </div>

      </article>
    </>
  );
};

export default BlogDetails;

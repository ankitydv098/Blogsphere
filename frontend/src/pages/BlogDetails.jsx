import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPostById, getPostComments, addComment, deleteComment } from '../api/postApi';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { Calendar, User, MessageSquare, Trash2, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const BlogDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated, isAdmin } = useContext(AuthContext);
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  
  const navigate = useNavigate();

  // Fetch Post details & Comments
  useEffect(() => {
    const fetchPostData = async () => {
      setLoading(true);
      try {
        const postData = await getPostById(id);
        setPost(postData);
        
        const commentsData = await getPostComments(id);
        setComments(commentsData);
      } catch (error) {
        toast.error('Failed to load article details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchPostData();
  }, [id, navigate]);

  // Format Date Helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Cover Image URL mapper
  const getImageUrl = (imageName) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    if (!imageName || imageName === 'default.png') {
      return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop';
    }
    return `${baseUrl}/api/images/${imageName}`;
  };

  // Initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Add comment submit handler
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setCommentLoading(true);
    try {
      const newComment = await addComment(id, { content: commentContent.trim() });
      setComments([newComment, ...comments]); // Prepend comment
      setCommentContent('');
      toast.success('Comment added successfully!');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  // Delete comment handler
  const handleCommentDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await deleteComment(commentId);
      setComments(comments.filter((c) => c.id !== commentId));
      toast.success('Comment deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  // Helper check for comment deletion permissions
  const canDeleteComment = (commentUser) => {
    if (!user) return false;
    // Authorized if owner of the comment OR admin
    return commentUser.email === user.email || isAdmin();
  };

  if (loading) return <Loader type="details" />;
  if (!post) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)} 
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:text-primary-900 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Article Header */}
      <header className="space-y-6">
        
        {/* Category Badge */}
        {post.category && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary-100 text-primary-800">
            {post.category.categoryName}
          </span>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-primary-900 leading-tight">
          {post.title}
        </h1>

        {/* Author Info Panel */}
        <div className="flex items-center gap-3 border-y border-primary-100 py-4">
          <div className="h-10 w-10 rounded-full bg-primary-900 text-white flex items-center justify-center font-bold text-sm">
            {getInitials(post.user?.name)}
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary-800">
              <Link to={`/profile/${post.user?.id}`} className="hover:underline">
                {post.user?.name || 'Anonymous'}
              </Link>
            </h3>
            <p className="text-xs text-primary-500 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(post.createdAt)}
              </span>
            </p>
          </div>
        </div>

      </header>

      {/* Cover Image */}
      <div className="my-8 rounded-2xl overflow-hidden bg-primary-50 border border-primary-100 max-h-[450px]">
        <img
          src={getImageUrl(post.imageName)}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Body Content */}
      <article className="prose prose-slate max-w-none text-primary-850 text-base md:text-lg leading-relaxed space-y-6">
        {post.content.split('\n').map((paragraph, index) => {
          if (!paragraph.trim()) return null;
          return <p key={index}>{paragraph}</p>;
        })}
      </article>

      {/* Comment Section Divider */}
      <section className="mt-16 pt-8 border-t border-primary-100 space-y-8">
        
        <h2 className="text-xl font-black text-primary-900 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Responses ({comments.length})
        </h2>

        {/* New Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <div className="relative">
              <textarea
                placeholder="What are your thoughts?"
                rows="3"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="w-full bg-primary-50 border border-primary-200 rounded-2xl py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-primary-900 focus:border-primary-900 resize-none"
              />
              <button
                type="submit"
                disabled={!commentContent.trim() || commentLoading}
                className="absolute right-4.5 bottom-4 p-1.5 text-primary-500 hover:text-primary-900 hover:bg-primary-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4 text-center">
            <p className="text-sm text-primary-600">
              Please{' '}
              <Link to="/login" className="font-bold text-primary-900 hover:underline">
                Sign In
              </Link>{' '}
              to participate in the discussion.
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6 pt-4">
          {comments.length === 0 ? (
            <p className="text-sm text-primary-400 italic text-center py-6">
              No responses yet. Be the first to share your thoughts!
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-primary-50/50 rounded-2xl border border-primary-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary-200 flex items-center justify-center font-bold text-[10px]">
                        {getInitials(comment.user?.name)}
                      </div>
                      <span className="text-xs font-bold text-primary-800">{comment.user?.name}</span>
                      <span className="text-[10px] text-primary-400">{formatDate(comment.createdAt)}</span>
                    </div>

                    {canDeleteComment(comment.user) && (
                      <button
                        onClick={() => handleCommentDelete(comment.id)}
                        className="p-1 text-primary-400 hover:text-red-600 rounded transition-colors"
                        title="Delete Comment"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-primary-700 pl-8 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </section>

    </div>
  );
};

export default BlogDetails;

import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getPostsByUser, deletePost } from '../api/postApi';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Button from '../components/Button';
import BlogCard from '../components/BlogCard';
import { BookOpen, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  
  const navigate = useNavigate();

  // Load user posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoading(true);
      try {
        const data = await getPostsByUser(user.id, 0, 50); // Show up to 50 posts
        setPosts(data.content);
        setTotalPosts(data.totalElements);
      } catch (error) {
        toast.error('Failed to load dashboard posts');
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  // Handle post editing redirection
  const handleEdit = (postId) => {
    navigate(`/posts/edit/${postId}`);
  };

  // Handle post deletion action
  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this blog post? This action is permanent.')) return;

    try {
      await deletePost(postId);
      setPosts(posts.filter((post) => post.id !== postId));
      setTotalPosts((prev) => prev - 1);
      toast.success('Blog post deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  if (loading) return <Loader type="details" />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Dashboard Info Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-primary-100 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-primary-900">Dashboard</h1>
          <p className="text-sm text-primary-500">
            Manage your published articles, views, and responses.
          </p>
        </div>
        
        <Link to="/write" className="shrink-0">
          <Button variant="primary" className="flex items-center gap-1.5 py-2.5">
            <PlusCircle className="h-4.5 w-4.5" />
            Write Article
          </Button>
        </Link>
      </div>

      {/* Posts Section */}
      <div className="space-y-6">
        
        <div className="flex items-center justify-between font-semibold text-xs text-primary-500 uppercase tracking-widest">
          <span>My Stories</span>
          <span>{totalPosts} Total</span>
        </div>

        {posts.length === 0 ? (
          
          /* Empty Dashboard State */
          <div className="text-center py-20 bg-primary-50 rounded-3xl border border-primary-100 space-y-4">
            <BookOpen className="mx-auto h-12 w-12 text-primary-300" />
            <h3 className="text-lg font-bold text-primary-850">You haven't written any stories yet</h3>
            <p className="text-sm text-primary-500 max-w-xs mx-auto">
              Share your insights and experiences. Create your first blog post and publish it to the world.
            </p>
            <Link to="/write" className="inline-block pt-2">
              <Button variant="primary">Create first post</Button>
            </Link>
          </div>

        ) : (
          
          /* User's posts with management triggers */
          <div className="divide-y divide-primary-50">
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showActions={true}
              />
            ))}
          </div>
        )}

      </div>

    </div>
  );
};

export default Dashboard;

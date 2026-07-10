import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostsByUser } from '../api/postApi';
import axiosInstance from '../api/axiosConfig';
import BlogCard from '../components/BlogCard';
import Loader from '../components/Loader';
import { Calendar, User as UserIcon, BookOpen, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { id } = useParams();
  
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // 1. Fetch basic user details
        const userResponse = await axiosInstance.get(`/api/users/${id}`);
        setProfileUser(userResponse.data);

        // 2. Fetch user's posts
        const postsData = await getPostsByUser(id, 0, 50); // Fetch up to 50 posts for profile view
        setPosts(postsData.content);
        setTotalPosts(postsData.totalElements);
      } catch (error) {
        toast.error('Failed to load profile details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [id, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) return <Loader type="details" />;
  if (!profileUser) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Profile Header Card */}
      <div className="bg-primary-50 rounded-3xl p-6 sm:p-8 border border-primary-100 flex flex-col sm:flex-row items-center gap-6 mb-10">
        
        {/* Avatar */}
        <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-primary-900 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shrink-0 select-none shadow-sm">
          {getInitials(profileUser.name)}
        </div>

        {/* User Info Details */}
        <div className="text-center sm:text-left space-y-3 flex-1">
          <h1 className="text-2xl sm:text-3xl font-black text-primary-900 tracking-tight">
            {profileUser.name}
          </h1>

          <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 text-xs font-semibold text-primary-500">
            <span className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              {profileUser.email}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Joined {formatDate(profileUser.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {totalPosts} {totalPosts === 1 ? 'Post' : 'Posts'} published
            </span>
          </div>
        </div>

      </div>

      {/* Authored Posts section */}
      <div className="space-y-6">
        <h2 className="text-lg font-black uppercase tracking-widest text-primary-800 pb-3 border-b border-primary-100">
          Articles by {profileUser.name.split(' ')[0]}
        </h2>

        {posts.length === 0 ? (
          <div className="text-center py-12 border border-primary-100 rounded-2xl bg-primary-50/50">
            <BookOpen className="mx-auto h-8 w-8 text-primary-300 mb-2" />
            <p className="text-sm font-semibold text-primary-600">No articles published yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-primary-50">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Profile;

import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Calendar, User } from 'lucide-react';

const BlogCard = ({ post, onEdit, onDelete, showActions = false }) => {
  const { id, title, content, imageName, createdAt, user, category } = post;

  // Format Date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Helper to get image URL
  const getImageUrl = (imageName) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    if (!imageName || imageName === 'default.png') {
      // Fallback placeholder image
      return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600&auto=format&fit=crop';
    }
    return `${baseUrl}/api/images/${imageName}`;
  };

  // Truncate HTML content to plain text short description
  const getShortDescription = (htmlContent, length = 150) => {
    if (!htmlContent) return '';
    // Strip HTML tags
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  // Get author's initials
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 py-6 border-b border-primary-100 hover:border-primary-200 transition-colors group">
      
      {/* Blog Info */}
      <div className="flex-1 order-2 md:order-1 flex flex-col justify-between">
        <div className="space-y-3">
          
          {/* Author & Date */}
          <div className="flex items-center gap-2 text-xs text-primary-500">
            <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700 text-[10px]">
              {getInitials(user?.name)}
            </div>
            <span className="font-semibold text-primary-800">{user?.name || 'Anonymous'}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(createdAt)}
            </span>
          </div>

          {/* Title */}
          <Link to={`/posts/${id}`} className="block group-hover:text-primary-600 transition-colors">
            <h2 className="text-xl font-bold tracking-tight text-primary-900 md:text-2xl leading-snug">
              {title}
            </h2>
          </Link>

          {/* Description */}
          <p className="text-primary-600 text-sm leading-relaxed line-clamp-2 md:line-clamp-3">
            {getShortDescription(content)}
          </p>
        </div>

        {/* Footer & Actions */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            {category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {category.categoryName}
              </span>
            )}
          </div>

          {showActions && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(id)}
                className="p-1 text-primary-500 hover:text-primary-900 hover:bg-primary-50 rounded transition-colors"
                title="Edit Post"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(id)}
                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                title="Delete Post"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Cover Image */}
      <Link 
        to={`/posts/${id}`} 
        className="w-full md:w-44 h-44 md:h-32 shrink-0 rounded-xl overflow-hidden bg-primary-50 border border-primary-100 order-1 md:order-2 group-hover:shadow-md transition-shadow duration-300"
      >
        <img
          src={getImageUrl(imageName)}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

    </div>
  );
};

export default BlogCard;

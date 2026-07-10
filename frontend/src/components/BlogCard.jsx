import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Calendar, BookOpen } from 'lucide-react';

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
      return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600&auto=format&fit=crop';
    }
    return `${baseUrl}/api/images/${imageName}`;
  };

  // Truncate HTML content to plain text short description
  const getShortDescription = (htmlContent, length = 130) => {
    if (!htmlContent) return '';
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

  // Categorized badge colors
  const getCategoryStyles = (catName) => {
    const defaultStyle = 'bg-slate-50 text-slate-700 border-slate-200/50';
    if (!catName) return defaultStyle;
    
    const colors = {
      'Java': 'bg-amber-50 text-amber-800 border-amber-200/40',
      'Spring Boot': 'bg-emerald-50 text-emerald-800 border-emerald-200/40',
      'Technology': 'bg-blue-50 text-blue-800 border-blue-200/40',
      'Artificial Intelligence': 'bg-purple-50 text-purple-800 border-purple-200/40',
      'AI': 'bg-purple-50 text-purple-800 border-purple-200/40',
      'Programming': 'bg-rose-50 text-rose-800 border-rose-200/40',
    };
    return colors[catName] || defaultStyle;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 p-6 mb-6 bg-white border border-slate-100/80 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-slate-100/60 hover:-translate-y-1 transition-all duration-300 group">
      
      {/* Blog Info */}
      <div className="flex-1 flex flex-col justify-between order-2 sm:order-1">
        <div className="space-y-3.5">
          
          {/* Author & Date */}
          <div className="flex items-center gap-2.5 text-xs text-slate-500">
            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-indigo-50 to-violet-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-[10px] select-none">
              {getInitials(user?.name)}
            </div>
            <span className="font-bold text-slate-700">{user?.name || 'Anonymous'}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-slate-400" />
              {formatDate(createdAt)}
            </span>
          </div>

          {/* Title */}
          <Link to={`/posts/${id}`} className="block group-hover:text-indigo-600 transition-colors duration-250">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl leading-snug">
              {title}
            </h2>
          </Link>

          {/* Description */}
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
            {getShortDescription(content)}
          </p>
        </div>

        {/* Footer & Actions */}
        <div className="flex items-center justify-between pt-5 mt-auto">
          {category && (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border transition-colors ${getCategoryStyles(category.categoryName)}`}>
              {category.categoryName}
            </span>
          )}

          {showActions && (
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 p-1 rounded-full">
              <button
                onClick={() => onEdit(id)}
                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-full transition-colors"
                title="Edit Post"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(id)}
                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-white rounded-full transition-colors"
                title="Delete Post"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Cover Image */}
      <Link 
        to={`/posts/${id}`} 
        className="w-full sm:w-44 h-48 sm:h-36 shrink-0 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 order-1 sm:order-2 group-hover:shadow-md transition-all duration-300"
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

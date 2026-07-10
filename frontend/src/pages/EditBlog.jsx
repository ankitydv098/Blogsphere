import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePost, uploadPostImage } from '../api/postApi';
import { getCategories } from '../api/categoryApi';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

const EditBlog = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  
  // Existing image info
  const [existingImage, setExistingImage] = useState(null);
  
  // New image upload info
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // Load Categories & Current Post details
  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesList = await getCategories();
        setCategories(categoriesList);

        const currentPost = await getPostById(id);
        
        // Ownership validation
        if (currentPost.user.email !== user.email) {
          toast.error('You are not authorized to edit this post');
          navigate('/dashboard');
          return;
        }

        setTitle(currentPost.title);
        setContent(currentPost.content);
        setCategoryId(currentPost.category ? currentPost.category.id.toString() : '');
        setExistingImage(currentPost.imageName);
      } catch (error) {
        toast.error('Failed to load post data');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate, user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds the 5MB limit');
        return;
      }
      
      const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowed.includes(file.type)) {
        toast.error('Invalid image format (allowed: JPG, PNG, GIF, WEBP)');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const getExistingImageUrl = (imageName) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    if (!imageName || imageName === 'default.png') {
      return null;
    }
    return `${baseUrl}/api/images/${imageName}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !categoryId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const updatedData = {
        title: title.trim(),
        content: content.trim(),
        categoryId: Number(categoryId),
      };

      await updatePost(id, updatedData);

      // Handle image upload if a new one is selected
      if (imageFile) {
        await uploadPostImage(id, imageFile);
      }

      toast.success('Blog post updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update post';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-black tracking-tight text-primary-900">
          Edit Story
        </h1>
        <p className="text-sm text-primary-500">
          Make updates to your published article contents.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-primary-700">Title</label>
          <input
            type="text"
            placeholder="Title of your post..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white border border-primary-200 rounded-2xl py-3 px-4 text-lg font-bold focus:outline-none focus:ring-1 focus:ring-primary-900 focus:border-primary-900"
            required
          />
        </div>

        {/* Category & Cover Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-primary-700">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-white border border-primary-200 rounded-full py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary-900 focus:border-primary-900"
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
              ))}
            </select>
          </div>

          {/* Cover image file input */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-primary-700">Cover Image</label>
            {!imagePreview ? (
              <div className="relative border border-dashed border-primary-300 rounded-full hover:bg-primary-50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-center gap-2 py-2 px-4 text-sm font-semibold text-primary-600">
                  <Upload className="h-4 w-4" />
                  <span>Replace cover image...</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2 border border-primary-200 rounded-full bg-primary-50">
                <span className="text-xs truncate max-w-[200px] font-medium text-primary-700 pl-3">{imageFile.name}</span>
                <button
                  type="button"
                  onClick={removeImage}
                  className="p-1 rounded-full hover:bg-primary-200 text-primary-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Preview Panel (new preview overrides existing cover preview) */}
        {imagePreview ? (
          <div className="relative rounded-2xl overflow-hidden bg-primary-50 border border-primary-100 max-h-[300px]">
            <img
              src={imagePreview}
              alt="New Cover Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-4 right-4 p-2 bg-primary-900/80 text-white rounded-full hover:bg-primary-950 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : getExistingImageUrl(existingImage) ? (
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-primary-400">Current Cover Image</label>
            <div className="rounded-2xl overflow-hidden bg-primary-50 border border-primary-100 max-h-[300px]">
              <img
                src={getExistingImageUrl(existingImage)}
                alt="Current Cover"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : null}

        {/* Content Body Textarea */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-primary-700">Content</label>
          <textarea
            placeholder="Tell your story..."
            rows="12"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-white border border-primary-200 rounded-2xl py-4 px-4 text-base focus:outline-none focus:ring-1 focus:ring-primary-900 focus:border-primary-900 placeholder-primary-300 resize-none font-sans"
            required
          />
        </div>

        {/* Submit Panel */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            Save Changes
          </Button>
        </div>

      </form>

    </div>
  );
};

export default EditBlog;

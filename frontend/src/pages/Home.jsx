import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPosts, searchPosts, getPostsByCategory } from '../api/postApi';
import { getCategories } from '../api/categoryApi';
import BlogCard from '../components/BlogCard';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { Search, Flame, Award, TrendingUp } from 'lucide-react';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Search parameters from React Router
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamQuery = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(searchParamQuery);

  // Pagination states
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Synchronize searchQuery with query parameter changes
  useEffect(() => {
    setSearchQuery(searchParamQuery);
    setPage(0);
  }, [searchParamQuery]);

  // Fetch categories
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

  // Fetch posts when dependencies change
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let data;
        if (searchParamQuery) {
          data = await searchPosts(searchParamQuery, page, 8);
        } else if (selectedCategory) {
          data = await getPostsByCategory(selectedCategory, page, 8);
        } else {
          data = await getPosts(page, 8);
        }
        setPosts(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Failed to load posts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [searchParamQuery, selectedCategory, page]);

  // Handle local search input submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { search: searchQuery } : {});
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchParams({}); // Clear search when selecting category
    setPage(0);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Hero section */}
      {!searchParamQuery && !selectedCategory && (
        <div className="border-b border-primary-100 pb-12 mb-10 space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-primary-900 leading-none">
            Stay curious.
          </h1>
          <p className="text-lg text-primary-600 max-w-lg leading-relaxed">
            Discover stories, thinking, and expertise from writers on any topic. 
            A platform engineered for the modern technical builder.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Blog List */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section title */}
          <div className="flex items-center justify-between pb-3 border-b border-primary-100">
            <h2 className="text-sm font-black uppercase tracking-widest text-primary-800 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {searchParamQuery 
                ? `Results for "${searchParamQuery}"` 
                : selectedCategory 
                  ? `${categories.find(c => c.id === selectedCategory)?.categoryName} Articles`
                  : 'Latest Articles'
              }
            </h2>
            {selectedCategory && (
              <button 
                onClick={() => handleCategorySelect(null)} 
                className="text-xs text-primary-500 hover:text-primary-900 underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* Skeletons while loading */}
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => <Loader key={i} type="card" />)}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-primary-50 rounded-2xl border border-primary-100 space-y-4">
              <Search className="mx-auto h-12 w-12 text-primary-300" />
              <h3 className="text-lg font-bold text-primary-800">No posts found</h3>
              <p className="text-sm text-primary-500 max-w-sm mx-auto">
                We couldn't find any articles matching your request. Try refining your keywords or choosing another category.
              </p>
            </div>

          ) : (
            
            /* Blog Cards */
            <div className="divide-y divide-primary-50">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && !loading && (
            <div className="flex items-center justify-between pt-6 border-t border-primary-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <span className="text-xs font-semibold text-primary-500">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
              >
                Next
              </Button>
            </div>
          )}

        </div>

        {/* Right Side: Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Custom Search Form */}
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-primary-700">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-primary-200 rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary-900 focus:border-primary-900"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-primary-400 hover:text-primary-900">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Categories Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-primary-700">Categories</h3>
            {categoriesLoading ? (
              <Loader type="category" />
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                      selectedCategory === cat.id
                        ? 'bg-primary-900 text-white border-transparent'
                        : 'bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100 hover:text-primary-900'
                    }`}
                  >
                    {cat.categoryName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Staff Picks / Trending */}
          <div className="border border-primary-100 rounded-2xl p-5 space-y-4 bg-primary-50/50">
            <h3 className="text-xs font-black uppercase tracking-wider text-primary-700 flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
              Trending Topics
            </h3>
            <ul className="space-y-3">
              <li className="text-sm font-semibold text-primary-800 hover:underline cursor-pointer">
                # Spring Boot Security 6
              </li>
              <li className="text-sm font-semibold text-primary-800 hover:underline cursor-pointer">
                # Java 21 Virtual Threads
              </li>
              <li className="text-sm font-semibold text-primary-800 hover:underline cursor-pointer">
                # Microservices Orchestration
              </li>
            </ul>
          </div>

          {/* Authors Spotlight */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-primary-700 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-primary-700" />
              Writers Spotlight
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary-200 flex items-center justify-center font-bold text-xs">AS</div>
                <div>
                  <h4 className="text-xs font-bold text-primary-800">Aarav Sharma</h4>
                  <p className="text-[10px] text-primary-500">Backend Architect • Java Expert</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary-200 flex items-center justify-center font-bold text-xs">PP</div>
                <div>
                  <h4 className="text-xs font-bold text-primary-800">Priya Patel</h4>
                  <p className="text-[10px] text-primary-500">Spring Boot Contributor</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getPosts, searchPosts, getPostsByCategory } from '../api/postApi';
import { getCategories } from '../api/categoryApi';
import BlogCard from '../components/BlogCard';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { Search, Flame, Award, TrendingUp, Sparkles, BookOpen } from 'lucide-react';

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

  useEffect(() => {
    setSearchQuery(searchParamQuery);
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
          data = await searchPosts(searchParamQuery, page, 6); // Smaller batch for premium spacing
        } else if (selectedCategory) {
          data = await getPostsByCategory(selectedCategory, page, 6);
        } else {
          data = await getPosts(page, 6);
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { search: searchQuery } : {});
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchParams({}); 
    setPage(0);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Premium Hero Section */}
      {!searchParamQuery && !selectedCategory && (
        <div className="relative overflow-hidden bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 md:p-16 mb-12 shadow-2xl shadow-indigo-950/20 border border-slate-800">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-xl space-y-6 relative z-10 animate-fade-in">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
              <Sparkles className="h-3 w-3" />
              Welcome to the builder community
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none">
              Where dev stories <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-300 bg-clip-text text-transparent">come alive</span>.
            </h1>
            <p className="text-slate-350 text-base sm:text-lg leading-relaxed font-medium">
              Discover clean tutorials, backend architectural deep dives, and expert perspectives written by developers for developers.
            </p>
            <div className="pt-2">
              <Link to="/write">
                <button className="px-6 py-3 rounded-full font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                  Start Writing
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Columns: Blogs List */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              {searchParamQuery 
                ? `Results for "${searchParamQuery}"` 
                : selectedCategory 
                  ? `${categories.find(c => c.id === selectedCategory)?.categoryName} Articles`
                  : 'Trending Articles'
              }
            </h2>
            {selectedCategory && (
              <button 
                onClick={() => handleCategorySelect(null)} 
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Reset Filter
              </button>
            )}
          </div>

          {/* Skeletons while loading */}
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => <Loader key={i} type="card" />)}
            </div>
          ) : posts.length === 0 ? (
            
            /* Empty State Container */
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No matching articles</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                We couldn't find any stories matching your request. Try searching for "Java" or select another category filter.
              </p>
            </div>

          ) : (
            
            /* Clean card listings */
            <div className="space-y-1">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && !loading && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <span className="text-xs font-bold text-slate-500">
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

        {/* Right Columns: Sidebar Panel */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Custom Search Form */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Search Hub</h3>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Find articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 focus:border-indigo-500 rounded-full py-2.5 pl-4 pr-10 text-xs focus:outline-none focus:ring-4 focus:ring-indigo-100/30 transition-all duration-200"
              />
              <button type="submit" className="absolute right-3.5 top-2.5 text-slate-400 hover:text-indigo-600 transition-colors">
                <Search className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>

          {/* Categories Grid */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Explore Categories</h3>
            {categoriesLoading ? (
              <Loader type="category" />
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all duration-250 ${
                      selectedCategory === cat.id
                        ? 'bg-indigo-600 text-white border-transparent shadow-md shadow-indigo-100'
                        : 'bg-slate-50 text-slate-600 border-slate-200/50 hover:bg-slate-100/70 hover:text-slate-900'
                    }`}
                  >
                    {cat.categoryName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Staff Picks / Trending */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
              Trending Topics
            </h3>
            <ul className="space-y-4">
              <li className="group cursor-pointer">
                <span className="text-xs font-bold text-indigo-600"># Spring Boot Security 6</span>
                <h4 className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors line-clamp-1">Stateless APIs and JWT authorization patterns.</h4>
              </li>
              <li className="group cursor-pointer">
                <span className="text-xs font-bold text-indigo-600"># Java 21 Virtual Threads</span>
                <h4 className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors line-clamp-1">Project Loom concurrency deep dive with code.</h4>
              </li>
              <li className="group cursor-pointer">
                <span className="text-xs font-bold text-indigo-600"># System Architecture</span>
                <h4 className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors line-clamp-1">Designing resilient database layer mappings.</h4>
              </li>
            </ul>
          </div>

          {/* Writers Spotlight */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-indigo-600" />
              Featured Writers
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group">
                <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs shadow-sm">AS</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors cursor-pointer">Aarav Sharma</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Backend Architect • Java Expert</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="h-9 w-9 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center font-bold text-violet-700 text-xs shadow-sm">PP</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors cursor-pointer">Priya Patel</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Spring Boot Contributor</p>
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

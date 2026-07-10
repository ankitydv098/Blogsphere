import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, PenTool, LogOut, User, LayoutDashboard, Search, Home, BookOpen } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100/80 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo & Search */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform duration-300">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                Blog<span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Sphere</span>
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search posts, tags, writers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-72 pl-10 pr-4 py-2 text-xs bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 focus:border-indigo-500 rounded-full focus:outline-none focus:ring-4 focus:ring-indigo-100/50 placeholder-slate-400 transition-all duration-200"
              />
            </form>
          </div>

          {/* Desktop Right Nav Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-semibold transition-colors duration-200 ${
                isActive('/') ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-5">
                <Link 
                  to="/write" 
                  className={`flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 ${
                    isActive('/write') ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <PenTool className="h-4 w-4" />
                  Write
                </Link>
                <Link 
                  to="/dashboard" 
                  className={`flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 ${
                    isActive('/dashboard') ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link 
                  to={`/profile/${user.id}`} 
                  className={`flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 ${
                    isActive(`/profile/${user.id}`) ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-semibold text-slate-550 hover:text-red-600 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-indigo-50 select-none">
                  {getInitials(user.name)}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <button className="text-sm font-semibold text-slate-700 hover:text-indigo-600 px-4 py-2 transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link to="/register">
                  <button className="text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 px-5 py-2.5 rounded-full shadow-md shadow-indigo-150/50 hover:shadow-lg transition-all duration-200">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger Menu - Mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-100 bg-white px-4 pt-3 pb-5 space-y-3 shadow-inner">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-full focus:outline-none focus:ring-4 focus:ring-indigo-50"
            />
          </form>

          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          {isAuthenticated ? (
            <div className="space-y-1">
              <Link
                to="/write"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
              >
                <PenTool className="h-4 w-4" />
                Write Post
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to={`/profile/${user.id}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-base font-semibold text-red-600 hover:bg-red-50 text-left transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 flex flex-col gap-2.5">
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <button className="w-full text-center py-2.5 border border-slate-200 hover:border-slate-900 rounded-full font-semibold text-slate-700 hover:text-slate-900 transition-all duration-200">
                  Sign In
                </button>
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)}>
                <button className="w-full text-center py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full font-semibold shadow-md shadow-indigo-100 hover:shadow-lg transition-all duration-200">
                  Get Started
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

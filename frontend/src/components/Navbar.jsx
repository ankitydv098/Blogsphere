import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, PenTool, LogOut, User, LayoutDashboard, Search, Home } from 'lucide-react';
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

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-primary-100 backdrop-blur-md bg-white/95">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-6">
            
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-black tracking-tight text-primary-900">
                Blog<span className="text-primary-500">Sphere</span>
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-primary-400" />
              </div>
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-64 pl-10 pr-3 py-1.5 text-sm bg-primary-50 border border-primary-200 rounded-full focus:outline-none focus:ring-1 focus:ring-primary-900 focus:border-primary-900 placeholder-primary-400"
              />
            </form>
          </div>

          {/* Desktop Right Nav Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-primary-600 hover:text-primary-900">
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/write" className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-900">
                  <PenTool className="h-4 w-4" />
                  Write
                </Link>
                <Link to="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-900">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link to={`/profile/${user.id}`} className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-900">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
                <div className="h-8 w-8 rounded-full bg-primary-900 text-white flex items-center justify-center font-bold text-xs select-none">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Hamburger Menu - Mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary-400 hover:text-primary-500 hover:bg-primary-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-primary-100 bg-white px-4 pt-2 pb-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-primary-400" />
            </div>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 text-sm bg-primary-50 border border-primary-200 rounded-full focus:outline-none focus:ring-1 focus:ring-primary-900 focus:border-primary-900"
            />
          </form>

          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-primary-700 hover:text-primary-900 hover:bg-primary-50"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/write"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-primary-700 hover:text-primary-900 hover:bg-primary-50"
              >
                <PenTool className="h-4 w-4" />
                Write
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-primary-700 hover:text-primary-900 hover:bg-primary-50"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to={`/profile/${user.id}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-primary-700 hover:text-primary-900 hover:bg-primary-50"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50 text-left"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)}>
                <Button variant="primary" className="w-full">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import SearchModal from './SearchModal';
import {
  Menu, X, PenTool, LogOut, User, LayoutDashboard,
  Search, BookOpen, Sun, Moon, ChevronDown,
} from 'lucide-react';

// ── Avatar Initials ───────────────────────────────────────────────
const AvatarInitials = ({ name, size = 'md' }) => {
  const initials = name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'AK';
  const sizeClass = size === 'sm' ? 'h-7 w-7 text-[10px] rounded-lg' : 'h-8 w-8 text-xs rounded-xl';
  return (
    <div className={`avatar-initials flex-shrink-0 ${sizeClass}`}>
      {initials}
    </div>
  );
};

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { theme, toggleTheme, isDark } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ⌘K hotkey bridge
  useEffect(() => {
    const handleCustomToggle = () => setIsSearchOpen(prev => !prev);
    window.addEventListener('toggle-search-modal', handleCustomToggle);
    return () => window.removeEventListener('toggle-search-modal', handleCustomToggle);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setIsOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className={`sticky top-0 z-40 glass-nav border-b border-slate-200/70 dark:border-slate-800/70 transition-all duration-200 ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-15 py-3">

            {/* ── Logo ──────────────────────────────────────────── */}
            <div className="flex items-center gap-5">
              <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                  <BookOpen className="h-4 w-4" />
                </div>
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-50">
                  Blog<span className="text-gradient">Sphere</span>
                </span>
              </Link>

              {/* Desktop search pill */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-full text-xs text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 transition-all duration-200 w-56 group"
              >
                <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                <span className="flex-1 text-left font-medium">Search articles...</span>
                <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* ── Desktop Right ──────────────────────────────────── */}
            <div className="hidden md:flex items-center gap-3">

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isDark
                  ? <Sun className="h-4 w-4 text-amber-400" />
                  : <Moon className="h-4 w-4 text-indigo-600" />
                }
              </button>

              {isAuthenticated ? (
                <>
                  <Link to="/write">
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 shadow-sm shadow-indigo-500/20 hover:shadow-md transition-all duration-200">
                      <PenTool className="h-3.5 w-3.5" />
                      Write
                    </button>
                  </Link>

                  {/* Profile Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-1.5 p-1 pr-2 rounded-full border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
                    >
                      <AvatarInitials name={user?.name} size="sm" />
                      <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-1.5 z-50">
                        <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user?.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate">{user?.email}</p>
                        </div>
                        <Link
                          to={`/profile/${user?.id}`}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          My Profile
                        </Link>
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <LayoutDashboard className="h-3.5 w-3.5 text-slate-400" />
                          Dashboard
                        </Link>
                        <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left transition-colors"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <button className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 transition-colors">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="text-xs font-bold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 px-4 py-2 rounded-full transition-all">
                      Get Started
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* ── Mobile Right ───────────────────────────────────── */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* ── Mobile Drawer ─────────────────────────────────────── */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-5 space-y-1.5">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                  <AvatarInitials name={user?.name} />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user?.name}</p>
                    <p className="text-[10px] text-slate-400">{user?.email}</p>
                  </div>
                </div>
                <Link to="/write" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors">
                  <PenTool className="h-4 w-4" /> Write New Article
                </Link>
                <Link to={`/profile/${user?.id}`} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <User className="h-4 w-4 text-slate-400" /> Profile
                </Link>
                <Link to="/dashboard" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <LayoutDashboard className="h-4 w-4 text-slate-400" /> Dashboard
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left transition-colors">
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login">
                  <button className="w-full py-2.5 border border-slate-200 dark:border-slate-700 rounded-full font-semibold text-xs text-slate-700 dark:text-slate-300 hover:border-indigo-400 transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link to="/register">
                  <button className="w-full py-2.5 bg-indigo-600 text-white rounded-full font-semibold text-xs hover:bg-indigo-700 transition-colors">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* ── Command Palette Modal ──────────────────────────────── */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;

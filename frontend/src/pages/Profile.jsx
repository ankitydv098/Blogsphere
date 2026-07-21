import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockService } from '../mock/mockService';
import { AuthContext } from '../context/AuthContext';
import { ANKIT, ANKIT_SKILLS, ANKIT_ACHIEVEMENTS, ANKIT_STATS } from '../mock/mockData';
import BlogCard from '../components/BlogCard';
import Loader from '../components/Loader';
import {
  MapPin, Globe, BookOpen, Bookmark, Edit,
  Code2, Trophy, Award, GitFork, Target,
  Mail, ExternalLink, Terminal, Cpu,
} from 'lucide-react';
import { motion } from 'framer-motion';

// ── Avatar Initials ───────────────────────────────────────────────
const AvatarInitials = ({ name, className = '' }) => {
  const initials = name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'AK';
  return <div className={`avatar-initials ${className}`}>{initials}</div>;
};

// ── Achievement icon map ─────────────────────────────────────────
const AchievementIcon = ({ icon }) => {
  const icons = {
    Code2: <Code2 className="h-4 w-4" />,
    Trophy: <Trophy className="h-4 w-4" />,
    Award: <Award className="h-4 w-4" />,
    Github: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  };
  return icons[icon] || <Code2 className="h-4 w-4" />;
};

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useContext(AuthContext);

  const [profileUser] = useState(ANKIT); // Always Ankit Kumar
  const [userPosts, setUserPosts] = useState([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('articles');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const postsRes = await mockService.getPostsByUser(1, 0, 10);
        setUserPosts(postsRes.content || []);
        const saved = await mockService.getBookmarkedPosts();
        setBookmarkedPosts(saved || []);
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id, currentUser]);

  const isOwnProfile = true; // Always Ankit's profile in this portfolio

  if (loading) return <Loader type="detail" />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* ── Profile Header ─────────────────────────────────────── */}
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">

        {/* Cover Image */}
        <div className="h-40 sm:h-52 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
          {/* Decorative code lines */}
          <div className="absolute bottom-4 right-6 text-[10px] font-mono text-white/20 text-right leading-loose hidden sm:block">
            <div>@SpringBootApplication</div>
            <div>public class AnkitPortfolio {'{'}</div>
            <div>&nbsp;&nbsp;@Autowired Backend dev;</div>
            <div>{'}'}</div>
          </div>
        </div>

        {/* User Info Container */}
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-5">
            <AvatarInitials
              name="Ankit Kumar"
              className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl text-2xl sm:text-3xl font-black shadow-2xl ring-4 ring-white dark:ring-slate-900 flex-shrink-0"
            />
            {isOwnProfile ? (
              <Link to="/dashboard">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-all shadow-sm">
                  <Edit className="h-3.5 w-3.5" />
                  Dashboard
                </button>
              </Link>
            ) : null}
          </div>

          <div className="space-y-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 leading-tight">
                Ankit Kumar
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Java Backend Developer
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  Student
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
              I'm a passionate Java Backend Developer and Computer Science student focused on Spring Boot, REST APIs,
              System Design, and DSA. I enjoy building production-ready backend systems and continuously improving
              my software engineering skills. Currently looking for Software Development Internship opportunities.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                West Bengal, India
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-slate-400" />
                Haldia Institute of Technology · CSE (Cyber Security)
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com/ankitydv098"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/ankitkumar"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current text-blue-500"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
              <a
                href="mailto:ankitydv098@gmail.com"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                Email
              </a>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            {ANKIT_STATS.map(stat => (
              <div key={stat.label} className="text-center sm:text-left">
                <div className="text-xl font-black text-slate-900 dark:text-slate-100">{stat.value}</div>
                <div className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Two Column: Skills + Achievements ─────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Skills */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5" /> Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {ANKIT_SKILLS.map(skill => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5" /> Achievements
          </h2>
          <ul className="space-y-3">
            {ANKIT_ACHIEVEMENTS.map(ach => (
              <li key={ach.label} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <AchievementIcon icon={ach.icon} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{ach.label}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{ach.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Internship Goal Banner ─────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-5 flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <Target className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-black text-indigo-100 uppercase tracking-widest">Current Goal</p>
          <p className="text-white font-bold text-sm mt-0.5">Seeking Software Development Internship · 2027</p>
          <p className="text-indigo-200 text-xs font-medium mt-0.5">Open to backend, full-stack, and Java engineering roles</p>
        </div>
        <div className="ml-auto">
          <a
            href="mailto:ankitydv098@gmail.com"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-white text-indigo-700 hover:bg-indigo-50 transition-colors shadow-sm"
          >
            <Mail className="h-3.5 w-3.5" /> Contact Me
          </a>
        </div>
      </div>

      {/* ── Tabs ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('articles')}
          className={`pb-3 px-1 text-xs font-bold transition-all border-b-2 mr-4 flex items-center gap-1.5 ${
            activeTab === 'articles'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Articles ({userPosts.length})
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`pb-3 px-1 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'bookmarks'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Bookmark className="h-3.5 w-3.5" />
          Saved ({bookmarkedPosts.length})
        </button>
      </div>

      {/* ── Tab Content ───────────────────────────────────────── */}
      {activeTab === 'articles' ? (
        userPosts.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
              <BookOpen className="h-5 w-5" />
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">No published articles yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userPosts.map(post => <BlogCard key={post.id} post={post} variant="default" />)}
          </div>
        )
      ) : (
        bookmarkedPosts.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
              <Bookmark className="h-5 w-5" />
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">No saved articles. Click the bookmark icon on any article card.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarkedPosts.map(post => <BlogCard key={post.id} post={post} variant="compact" />)}
          </div>
        )
      )}

    </div>
  );
};

export default Profile;

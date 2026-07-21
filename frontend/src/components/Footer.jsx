import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Send, Check, Mail, Globe } from 'lucide-react';

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-slate-800/60">

          {/* Brand */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 w-fit">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                Blog<span className="text-gradient">Sphere</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              A personal developer blog by Ankit Kumar — Java Backend Developer and CSE student at Haldia Institute of Technology.
              Writing about Spring Boot, System Architecture, DSA, and the Indian tech ecosystem.
            </p>
            <div className="flex items-center gap-2.5">
              {/* GitHub — hover: white (brand) */}
              <a
                href="https://github.com/ankitydv098"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-900 text-slate-500 hover:text-white hover:bg-[#24292e] transition-all duration-200"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </a>
              {/* LinkedIn — hover: LinkedIn blue */}
              <a
                href="https://linkedin.com/in/ankitkumar"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-900 text-slate-500 hover:text-[#0A66C2] hover:bg-blue-950/60 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
              {/* Email — hover: indigo */}
              <a
                href="mailto:ankitydv098@gmail.com"
                className="p-2 rounded-xl bg-slate-900 text-slate-500 hover:text-indigo-400 hover:bg-indigo-950/60 transition-all duration-200"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-300">Explore Topics</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/?search=Java%2021" className="hover:text-indigo-400 transition-colors">
                  Java 21 & Virtual Threads
                </Link>
              </li>
              <li>
                <Link to="/?search=Spring%20Security%206" className="hover:text-indigo-400 transition-colors">
                  Spring Security 6 & JWT
                </Link>
              </li>
              <li>
                <Link to="/?search=System%20Architecture" className="hover:text-indigo-400 transition-colors">
                  System Architecture & Sharding
                </Link>
              </li>
              <li>
                <Link to="/?search=Spring%20AI" className="hover:text-indigo-400 transition-colors">
                  Spring AI & RAG
                </Link>
              </li>
              <li>
                <Link to="/?search=Docker" className="hover:text-indigo-400 transition-colors">
                  Docker & Kubernetes
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-300">Stay Updated</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get notified when I publish new articles on Java, Spring Boot, and system design.
            </p>
            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                Subscribed! You'll hear from me soon.
              </div>
            ) : (
              <form onSubmit={handleSubscribe}>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full p-1 focus-within:border-indigo-500 transition-colors">
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent py-1.5 pl-3 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex-shrink-0"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-600 mt-1.5 pl-1">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-600">
          <p>
            © {new Date().getFullYear()} Ankit Kumar · BlogSphere Portfolio
          </p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> using React 19, Vite & Tailwind CSS
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

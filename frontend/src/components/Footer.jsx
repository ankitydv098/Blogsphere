import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-primary-100 py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center">
            <span className="text-xl font-black tracking-tight text-primary-900">
              Blog<span className="text-primary-500">Sphere</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-primary-500 justify-center">
            <Link to="/" className="hover:text-primary-900 transition-colors">Home</Link>
            <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noopener noreferrer" className="hover:text-primary-900 transition-colors">API Docs</a>
            <span className="cursor-default">About</span>
            <span className="cursor-default">Privacy</span>
            <span className="cursor-default">Terms</span>
          </div>
          <div className="text-sm text-primary-400">
            © {new Date().getFullYear()} BlogSphere. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

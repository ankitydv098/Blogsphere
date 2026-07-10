import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BlogDetails from './pages/BlogDetails';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Toast Notification Container */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '9999px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            background: '#0f172a',
            color: '#ffffff',
          },
          success: {
            iconTheme: {
              primary: '#ffffff',
              secondary: '#0f172a',
            },
          },
        }}
      />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Pages Content */}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts/:id" element={<BlogDetails />} />
          <Route path="/profile/:id" element={<Profile />} />

          {/* Protected Routes (Authenticated Users Only) */}
          <Route
            path="/write"
            element={
              <ProtectedRoute>
                <CreateBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/edit/:id"
            element={
              <ProtectedRoute>
                <EditBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Page Footer */}
      <Footer />
    </div>
  );
}

export default App;

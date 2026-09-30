import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import BrowseItems from './pages/BrowseItems';
import ItemDetails from './pages/ItemDetails';
import Dashboard from './pages/Dashboard';
import PostItem from './pages/PostItem';
import MyPosts from './pages/MyPosts';
import EditItem from './pages/EditItem';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/items" element={<BrowseItems />} />
            <Route path="/items/:itemId" element={<ItemDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes (Authentication Required) */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/post-item" 
              element={
                <ProtectedRoute>
                  <PostItem />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-posts" 
              element={
                <ProtectedRoute>
                  <MyPosts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-posts/:itemId/edit" 
              element={
                <ProtectedRoute>
                  <EditItem />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/items/:itemId/edit" 
              element={
                <ProtectedRoute>
                  <EditItem />
                </ProtectedRoute>
              } 
            />

            {/* Fallback Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
